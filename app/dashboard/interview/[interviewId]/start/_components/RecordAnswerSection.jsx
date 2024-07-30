
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import Webcam from 'react-webcam'

function RecordAnswerSection() {
  return (
    <div className='flex items-center flex-col justify-center '>
        <div className='flex flex-col justify-center items-center mt-20 bg-slate-400 rounded-lg p-5'>
        <Image src={'/webcam.png'} width={400} height={200}
        className='absolute'/>
        <Webcam
        mirrored={true}
        style={{
            height:300,
            width: '100%',
            zIndex:10,
            
            // bdhire-ai-mockinterview-platform
         

        }}/>
    </div>
    <Button variant="outline" className="my-10">Record Answer</Button>
    </div>
  )
}

export default RecordAnswerSection