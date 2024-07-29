"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { ShieldAlert, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null); // Initialize with null
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    console.log(params.interviewId);
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));

    setInterviewData(result[0]);
  };

  // Conditional rendering
  if (!interviewData) {
    return <div>Loading...</div>;
  }
  return (
    <div className="my-10 ">
      <h2 className="font-bold text-2xl ">
        Lets Get Started
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-10">

        
        
        <div className=" my-5 gap-5 ">
        <div className=" p-5 border rounded-lg border-yellow-300 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-500">
              <ShieldAlert />
              <strong>Information</strong>
            </h2>
            <h2 className="mt-3 text-yellow-500">
              {process.env.NEXT_PUBLIC_INFORMATION}
            </h2>
          </div>
          {/* the interview details */}
          <div className="mt-3 flex flex-col p-5 gap-5 rounded-lg border ">
            <h2 className="text-lg">
              <strong>Job Role/Job Position: </strong>
              {interviewData.jobPosition}
            </h2>
            <h2 className="text-lg">
              <strong>Job Role/Job Position: </strong>
              {interviewData.jobDesc}
            </h2>
            <h2 className="text-lg">
              <strong>Job Role/Job Position: </strong>
              {interviewData.jobExperience}
            </h2>
          </div>
         
        </div>

        {/* the webcam */}
        <div>
          {webCamEnabled ? 
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              // solving the mirror of the webcam
              mirrored={true}
              style={{
                height: 300,
                width: 300,
              }}
            />
           : 
            <>
              <WebcamIcon className="h-72 w-full my-5 p-20 bg-yellow-100 rounded-lg border-s-2" />
              <Button
                variant="ghost"
                onClick={() => setWebCamEnabled(true)}
                className="bg-blue-50 text-blue-800 w-full"
              >
                
                Enable Web Camera Now
              </Button>
            </>
          }
        </div>
      </div>

      <div className="flex justify-end items-end mt-2">
        <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
        <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;
