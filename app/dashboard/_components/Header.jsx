'use client'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'


function Header() {
    const path= usePathname();
    useEffect(() => {
        console.log(path);
    }, [])
  return (
    <div className='flex p-4 items-center justify-between bg-indigo-200 shadow-md'>
        <Image src={'/bdnaturetech_logo.svg'} width={50} height={100} alt="logo" />
        <ul className='hidden md:flex gap-6'>
            <li className={`hover:text-yellow-600 hover:font-bold transition-all cursor-pointer
                ${path=='/dashboard'&& 'text-yellow-600 font-bold hover:text-primary'}
                `}>Dashboard</li>
            <li className={`hover:text-yellow-600 hover:font-bold transition-all cursor-pointer
                ${path=='/dashboard/questions'&& 'text-yellow-600 font-bold'}`}>Questions</li>
            <li className={`hover:text-yellow-600 hover:font-bold transition-all cursor-pointer
                ${path=='/dashboard/upgrade'&& 'text-yellow-600 font-bold hover:text-primary'}`}>Upgrade</li>
            <li className={`hover:text-yellow-600 hover:font-bold transition-all cursor-pointer
                ${path=='/dashboard/how'&& 'text-yellow-600 font-bold hover:text-primary'}`}>How it Works?</li>
            <li className={`hover:text-yellow-600 hover:font-bold transition-all cursor-pointer
                ${path=='/dashboard./job'&& 'text-yellow-600 font-bold hover:text-primary'}`}>Op2ni<span className='font-bold'>T</span></li>
        </ul>
        <UserButton/>
    </div>
  )
}

export default Header