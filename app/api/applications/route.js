import { db } from '@/utils/db'
import { jobApplication } from '@/utils/schema'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'qudmeet@gmail.com',
    pass: process.env.EMAIL_PASSWORD // Set this in your .env file
  }
})

export async function POST(request) {
  try {
    const formData = await request.formData()
    
    // Get the resume file
    const resume = formData.get('resume')
    if (!resume) {
      return NextResponse.json(
        { error: 'Resume is required' },
        { status: 400 }
      )
    }

    // Convert file to buffer for email attachment
    const bytes = await resume.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create application record
    const applicationData = {
      jobId: parseInt(formData.get('jobId')),
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      gender: formData.get('gender'),
      roleApplying: formData.get('roleApplying'),
      joinTime: formData.get('joinTime'),
      resumeUrl: resume.name, // In production, you'd upload to cloud storage
      status: 'pending'
    }

    // Save to database
    const newApplication = await db
      .insert(jobApplication)
      .values(applicationData)
      .returning()

    // Send email notification
    await transporter.sendMail({
      from: 'qudmeet@gmail.com',
      to: 'qudmeet@gmail.com',
      subject: `New Job Application: ${applicationData.roleApplying}`,
      html: `
        <h2>New Job Application Received</h2>
        <p><strong>Name:</strong> ${applicationData.fullName}</p>
        <p><strong>Email:</strong> ${applicationData.email}</p>
        <p><strong>Role:</strong> ${applicationData.roleApplying}</p>
        <p><strong>Gender:</strong> ${applicationData.gender}</p>
        <p><strong>Available to Join:</strong> ${applicationData.joinTime}</p>
      `,
      attachments: [
        {
          filename: resume.name,
          content: buffer
        }
      ]
    })

    return NextResponse.json(newApplication[0])
  } catch (error) {
    console.error('Error processing application:', error)
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const applications = await db
      .select()
      .from(jobApplication)
      .orderBy(jobApplication.appliedAt)
    return NextResponse.json(applications)
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
} 