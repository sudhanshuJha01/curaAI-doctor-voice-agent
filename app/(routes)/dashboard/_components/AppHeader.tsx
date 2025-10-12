import React from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'

const menuOption = [
    {
        id:1,
        name:"home",
        path:"/home"
    },
    {
        id:2,
        name:"history",
        path:"/history"
    },
    {
        id:3,
        name:"pricing",
        path:"/pricing"
    },
    {
        id:4,
        name:"profile",
        path:"/profile"
    },
]

const AppHeader = () => {
  return (
    <div className='flex justify-between items-center p-4'>
        <div className='text-3xl font-bold'>
            {/* <Image src={""} alt="logo" /> */}
            cureAi</div>
            <div className='flex items-center gap-2 text-xl'>
            {menuOption && menuOption.map(item=>(
                 <div key={item.id} className='cursor-pointer'>
                     <h2>{item.name}</h2>
                </div>
            ))}
            </div>
            <UserButton/>
    </div>
  ) 
}

export default AppHeader