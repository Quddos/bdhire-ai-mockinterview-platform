"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";

function StartInterview({params}) {
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  useEffect(() => {
    GetInterviewDetails();
   
  }, []);

  // used to get the interviw details
  const GetInterviewDetails =async()=>{
    const result =await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));

    const jsonMockResp=JSON.parse(result[0].jsonMockResp);
    console.log(jsonMockResp);

    // console.log(result);
    setMockInterviewQuestion(jsonMockResp);
    setInterviewData(result[0]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-10">
      <QuestionsSection 
      mockInterviewQuestion={mockInterviewQuestion}
      activeQuestionIndex={activeQuestionIndex}/>
      <RecordAnswerSection/>
    </div>
  )
}

export default StartInterview;
