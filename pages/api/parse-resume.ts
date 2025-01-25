import { NextApiRequest, NextApiResponse } from 'next';
import { parseAndScoreResume } from '@/utils/resumeParser';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const analysis = await parseAndScoreResume(resumeText, jobDescription);
    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Resume parsing error:', error);
    return res.status(500).json({ message: 'Error analyzing resume' });
  }
} 