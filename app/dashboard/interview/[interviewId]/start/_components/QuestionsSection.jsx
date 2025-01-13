import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'

function QuestionsSection({mockInterviewQuestion, activeQuestionIndex}) {
  
  const textToSpeech=(text) => {
    if('speechSynthesis' in window){
      const speech=new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    }
    else{
      alert('Your browser does not support Text-To-Speech');
    }

  }
  return mockInterviewQuestion&&(
    <div className='p-5 border rounded-lg my-10'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {mockInterviewQuestion&&mockInterviewQuestion.map((question, index)=>(
                <h2 className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer
                    ${activeQuestionIndex==index&&'bg-yellow-500 text-white'}`}>Question #{index+1}</h2>
            ))}
            
        </div>
        <h2 className='my-5 text-md md:text-lg'>{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>
        {/* for AI to speak out the question to user */}
        <Volume2 className="cursor-pointer" onClick={()=>textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}/>

        {/* // Adding a note */}
        <div className='border rounded-lg p-5 bg-yellow-300 mt-20'>
            <h2 className='flex gap-2 items-center text-yellow-500'>
            <Lightbulb/>
            <strong>Note:</strong>
            </h2>
            <h2 className='text-sm text-yellow-500 my-2'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
           
        </div>

    </div>
    
  )
}

export default QuestionsSection