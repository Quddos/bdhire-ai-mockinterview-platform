'use client'
import React, { useEffect, useState } from 'react'
import {db} from '@/utils/db'
import { eq } from 'drizzle-orm'
import { UserAnswer } from '@/utils/schema'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronsUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

// import Feedback from './page';

function Feedback({params}) {

    const [FeedbackList, setFeedbackList] =useState([]);
    const router=useRouter();
    useEffect(()=>{
        GetFeedBack();
    })
    const GetFeedBack=async ()=>{
        const result=await db.select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef,params.interviewId))
        .orderBy(UserAnswer.id);

        console.log(result);
        setFeedbackList(result);

    }
  return (
    <div className='p-10'>
        
        
        {FeedbackList?.length==0?
                <h2 className='font-bold text-xl text-gray-500'>No Interview Feedback Record found</h2>
                  :
                  <>
                  <h2 className='text-2xl font-bold text-green-500'>Congratulations</h2>
                  <h2 className='font-bold text-2xl'>Here is your Interview Feedback</h2>
                  <h2 className='text-primary text-lg my-3 '>Your overall interview rating: <strong>7/10</strong></h2>

<h2 className='text-sm text-gray-500'>Find below interview question with correct answer, your answer and feedback for improvement</h2>
{FeedbackList&&FeedbackList.map((item,index )=>(
    <Collapsible key={index} className='mt-7'>
    <CollapsibleTrigger className='p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-7 w-full'>
    {item.question}  <ChevronsUpDown className='h-5 w-5'/>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div className='flex flex-col gap-2'>
        <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong>{item.rating}</h2>
        <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer: </strong>{item.userAns}</h2>
        
      
        
        <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer: </strong>{item.correctAns}</h2>
        <h2 className='p-2 border rounded-lg bg-yellow-50 text-sm text-yellow-900'><strong>Feedback: </strong>{item.feedback}</h2>


      </div>
    </CollapsibleContent>
  </Collapsible>
  
))}
                  </>
              }
        
        

        <Button onClick={()=>router.replace('/dashboard')}>Go Home</Button>

    </div>
  )
}

export default Feedback