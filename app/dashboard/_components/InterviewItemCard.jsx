import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
// import Interview from './../interview/[interviewId]/page';

function InterviewItemCard({interview}) {

  const router=useRouter();

  const onStart=()=>{
    router.push("/dashboard/interview/"+interview?.mockId);
    // <Interview params={{interviewId:interview?.mockId}} />
  }
  const onFeedbackPress=()=>{
    router.push("/dashboard/interview/"+interview?.mockId+"/feedback");
    // <Interview params={{interviewId:interview?.mockId}} />
  }

  return (
    <div className='border shadow-sm rounded-lg p-3'>
        <h2 className='font-bold text-primary'>{interview?.jobPosition}</h2>
        <h2 className='text-sm text-gray-600'>{interview?.jobExperience}Years of Experience</h2>
        <h2 className='text-xs text-gray-400'>Created At:{interview?.createdAt}</h2>

        <div className='flex justify-between mt-2 gap-5'>
          {/* <Link href={"/dashboard/interview/"+interview?.mockId}></Link> */}
          <Button size="sm" variant="outline" className='w-full'
          onClick={onFeedbackPress}
          >Feedback</Button>
          
        
          <Button size="sm"  className='w-full'
          onClick={onStart}
          >Re-Take</Button>
        </div>
    </div>
  )
}

export default InterviewItemCard