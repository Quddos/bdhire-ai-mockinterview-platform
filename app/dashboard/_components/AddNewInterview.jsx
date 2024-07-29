"use client"
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModal";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { v4 as uuidv4} from 'uuid';
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { uuid } from "drizzle-orm/pg-core";
import { MockInterview } from "@/utils/schema";
import { useRouter } from "next/navigation";


function AddNewInterview() {
  const [openDialog, setDialogOpen] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading]= useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const {user}=useUser();
  const router = useRouter();


  const onSubmit =async(e) => {
    setLoading(true)
    
    const InputPrompt="job position: "+jobPosition+", job Decscription: "+jobDesc+", Years of experience: "+jobExperience+", Base on this information kindly give me "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" interview questions with answers in json format. Give question and answered as field in json."
    e.preventDefault()


    console.log(jobDesc,jobExperience, jobPosition, process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT);
    
    

    const result=await chatSession.sendMessage(InputPrompt);
    const MockJsonResp=(result.response.text()).replace('```json','').replace('```','');
    console.log(JSON.parse(MockJsonResp));
    setJsonResponse(MockJsonResp);
    setDialogOpen(false);

    if(MockJsonResp) 
      {
    const resp=await db.insert(MockInterview).values(
      {
        mockId: uuidv4(),
        jsonMockResp: MockJsonResp,
        jobPosition: jobPosition,
        jobDesc: jobDesc,
        jobExperience: jobExperience,
        createdBy:user?.primaryEmailAddress?.emailAddress,
        createdAt:moment().format('YYYY-MM-DD')
       
      }).returning({mockId:MockInterview.mockId})

      console.log("Inserted ID:", resp)
      if(resp)
      {
        setDialogOpen(false);
        router.push(`/dashboard/interview/${resp[0].mockId}`)
      }
    }
    else{
      console.log("MockInterview not set ERROR")
    }

      setLoading(false);
  }
  return (
    <div>
      {/* for the box/card */}
      <div className="p-10 border rounded-lg bg-yellow-100 hover:scale-105 hover:shadow-md "
      onClick={()=>setDialogOpen(true)}>
        <h2>+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Let's Get to Know Your Dream Job!</DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>Share Insights on Your Job Title/Position, Responsibilities, and Professional Experience</h2>
                  <div className="mt-7 my-3">
                    <label>Job Role/Job Position</label>
                    <Input placeholder="E.g., Marketing Manager, Software Developer, Nurse" required
                    onChange={(event)=>setJobPosition(event.target.value)}></Input>

                  </div>
                  <div className="my-3">
                    <label>Key Responsibilities/Skills Description</label>
                    <Textarea placeholder="Ex. managing projects, java, React, patient care, digital marketing, figma etc" required
                    onChange={(event)=>setJobDesc(event.target.value)}/>
                  </div>

                  <div className="my-3">
                    <label>Years of Experience</label>
                    <Input type="number" max="100" placeholder="E.g. 5" required
                    onChange={(event)=>setJobExperience(event.target.value)}></Input>

                  </div>

                </div>

              <div className="flex gap-5 justify-end">
              <Button type="button" variant="ghost" onClick={()=>setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading} className="bg-yellow-500 " >
                {loading? 
                <>
                <LoaderCircle className='animate-ping'/> Preparing AI Interview
                </>:'Start Interview'}</Button>
              </div>

              </form>
              
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
