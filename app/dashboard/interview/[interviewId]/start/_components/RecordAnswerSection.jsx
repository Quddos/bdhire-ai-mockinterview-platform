import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModal";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { db } from "@/utils/db";


function RecordAnswerSection({mockInterviewQuestion,activeQuestionIndex,interviewData}) {
  const [userAnswer,setUserAnswer]=useState('');
  const {user}=useUser();
  const [loading, setLoading] = useState(false);
  // const {loading, setLoading}=useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  // this will execute whenever result gets change
  useEffect(()=>{
    results.map((result)=>(
      setUserAnswer(prevAns=>prevAns+result?.transcript)
    ))

  }, [results])

  useEffect(()=>{
    if(!isRecording&&userAnswer.length>10)
    {
      UpdateUserAnswer();
    }
 

  },[userAnswer])

  // To save the user answer
  const StartStopRecording=async()=>{
    if(isRecording)
      {
      
      stopSpeechToText()
      // console.log(userAnswer)           
    }
    else{
      startSpeechToText();
    }

  }

  const UpdateUserAnswer=async()=>{

    console.log(userAnswer)
    setLoading(true);
    const feedbackPrompt="Question:"+mockInterviewQuestion[activeQuestionIndex]?.question+
      ", User Answer:"+userAnswer+", Depends on Question and User Answer for the given Interview Question"+
      "Please give us rating for answer and feedback as area of improvement if any"+
      "in just 3 to 5 lines to improve it in JSON format with rating field.";

      const result=await chatSession.sendMessage(feedbackPrompt);

      const mockJsonResp=(result.response.text()).replace('```json','').replace('```','')
      console.log(mockJsonResp)
      const  JsonFeedbackResp=JSON.parse(mockJsonResp);

      const resp=await db.insert(UserAnswer)
      .values({
        mockIdRef:interviewData?.mockId,
        question:mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns:userAnswer,
        feedback:JsonFeedbackResp?.feedback,
        rating:JsonFeedbackResp?.rating,
        userEmail:user?.primaryEmailAddress?.emailAddress,
        createdAt:moment().format('DD-MM-YYYY')
      })

      if(resp)
      {
        toast.success('User Answer recorded successfully');
        setUserAnswer('');
        setResults([]);
      }
      setResults([]);
      
      setLoading(false);

  }

  return (
    <div className="flex items-center flex-col justify-center ">
      <div className="flex flex-col justify-center items-center mt-20 bg-slate-400 rounded-lg p-5">
        <Image
          src={"/webcam.png"}
          width={400}
          height={200}
          className="absolute"
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,

            // bdhire-ai-mockinterview-platform
          }}
        />
      </div>
      <Button 
      disabled={loading}
      variant="outline" className="my-10"
      onClick={StartStopRecording}>
        {isRecording ? 
        <h2 className="text-red-600 flex gap-2">
          <Mic/>Stop Recording...
        </h2>
        : 'Record Answer'}
        
      </Button>

      {/* <h1>Recording: {isRecording.toString()}</h1>
      <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      <ul>
        {results.map((result) => (
          <li key={result.timestamp}>{result.transcript}</li>
        ))}
        {interimResult && <li>{interimResult}</li>}
      </ul> */}
      {/* <Button onClick={()=>console.log(userAnswer)}>Show user Answer</Button> */}


    </div>
  );
}

export default RecordAnswerSection;
