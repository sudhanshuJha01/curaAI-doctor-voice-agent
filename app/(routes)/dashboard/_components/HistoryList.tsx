"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddNewSessionDialog from '@/app/(routes)/dashboard/_components/AddNewSessionDialog';
import HistoryListTable from './HistoryListTable';
import { Heart, Loader2 } from 'lucide-react';

interface HistoryListProps {
  limit?: number;
}

const HistoryList = ({ limit }: HistoryListProps) => {
  const [historyList, setHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getHistoryList();
  }, []);

  const getHistoryList = async () => {
    try {
      setIsLoading(true);
      const result = await axios.get('/api/session-chat?sessionId=all');
      console.log('history list', result.data);
      const dataToShow = limit ? result.data.slice(0, limit) : result.data;
      setHistoryList(dataToShow);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-[400px] flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-rose-50 rounded-xl border border-pink-100 p-8'>
        <div className='relative mb-4'>
          <div className='w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse'>
            <Heart className='w-10 h-10 text-white fill-white' />
          </div>
          <Loader2 className='absolute -bottom-2 -right-2 w-6 h-6 text-pink-600 animate-spin' />
        </div>
        <p className='text-gray-600 font-medium'>Loading your consultation history...</p>
      </div>
    );
  }

  if (historyList.length === 0) {
    return (
      <div className='min-h-[400px] flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-rose-50 rounded-xl border border-pink-100 p-8'>
        <div className='relative mb-6'>
          <div className='w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg'>
            <Heart className='w-12 h-12 text-white fill-white' />
          </div>
          <div className='absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white'></div>
        </div>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>No Consultation History</h2>
        <p className='text-gray-600 mb-6 text-center max-w-md'>
          Start your first AI-powered medical consultation to get instant guidance and personalized health reports.
        </p>
        <AddNewSessionDialog />
      </div>
    );
  }

  return (
    <div className='bg-white rounded-xl border border-pink-100 shadow-sm'>
      <HistoryListTable historyList={historyList} limit={limit} />
    </div>
  );
};

export default HistoryList;