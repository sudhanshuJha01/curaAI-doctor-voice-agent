"use client";
import React from 'react';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart } from 'lucide-react';

const menuOption = [
  { id: 1, name: "Home", path: "/dashboard" },
  { id: 2, name: "History", path: "/dashboard/history" },
  { id: 3, name: "Pricing", path: "/dashboard/pricing" },
];

const AppHeader = () => {
  const pathname = usePathname();

  return (
    <div className='flex justify-between items-center p-4 shadow-sm border-b border-pink-100 bg-white'>
      <Link href="/dashboard" className='flex items-center gap-2'>
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-md">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
        
        <div className='text-xl md:text-2xl font-bold text-gray-900'>
          Cure<span className='text-pink-600'>AI</span>
        </div>
      </Link>
      
      <div className='hidden md:flex items-center gap-6 text-md font-medium text-gray-600'>
        {menuOption.map(item => {
          const isActive = pathname === item.path;
          return (
            <Link 
              href={item.path} 
              key={item.id} 
              className={`capitalize transition-colors hover:text-pink-600 
                ${isActive ? 'text-pink-600 font-semibold' : ''}`
              }
            >
              {item.name}
            </Link>
          );
        })}
      </div>
      
      <UserButton />
    </div>
  );
};

export default AppHeader;