"use client";
import React, { useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import AddNewSessionDialog from '@/app/_components/AddNewSessionDialog';

const HistoryList = () => {
    const [historyList , setHistoryList] = useState([]);
  return (
    <div className='border-2 border-red-700 p-4 flex flex-col items-center justify-center'>
        {historyList.length==0?<div>
            <Image src={'/medical-assistance.png'} alt='medical-assistance-logo' 
            width={150}
            height={150}
            />
            <h2>No recent Consultation</h2>
            <h2>worite some thing good here</h2>
            <AddNewSessionDialog/>
        </div>:<div>List</div>
        }
    </div>
  )
} 

export default HistoryList