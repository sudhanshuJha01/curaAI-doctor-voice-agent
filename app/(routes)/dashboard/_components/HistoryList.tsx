"use client";
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import axios from 'axios';
import AddNewSessionDialog from '@/app/_components/AddNewSessionDialog';
import HistoryListTable from './HistoryListTable';

const HistoryList = () => {
    const [historyList , setHistoryList] = useState([]);

    useEffect(()=>{
       getHistoryList()
    },[])

    const getHistoryList =async ()=>{
      const result = await axios.get('/api/session-chat?sessionId=all');
      console.log('history list ' , result.data)
      setHistoryList(result.data)
    }

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
        </div>:<div>
          <HistoryListTable historyList={historyList}/>
        </div>
        }
    </div>
  )
} 

export default HistoryList