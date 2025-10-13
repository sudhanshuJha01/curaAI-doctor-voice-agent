"use client";
import React from 'react';
// Remove the Image import if it's no longer used elsewhere
// import Image from 'next/image'; 
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/app/_components/Logo'

const menuOption = [
  { id: 1, name: "Home", path: "/dashboard" },
  { id: 2, name: "History", path: "/dashboard/history" },
  { id: 3, name: "Pricing", path: "/pricing" },
  { id: 4, name: "Profile", path: "/profile" },
];

const AppHeader = () => {
  const pathname = usePathname();

  return (
    <div className='flex justify-between items-center p-4 shadow-sm border-b'>
      <Link href="/dashboard" className='flex items-center gap-2'>
        <Logo width={40} height={40} />
        
        <div className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent'>
          CureAI
        </div>
      </Link>
      
      <div className='hidden md:flex items-center gap-6 text-md font-medium text-gray-600'>
        {menuOption.map(item => {
          const isActive = pathname === item.path;
          return (
            <Link 
              href={item.path} 
              key={item.id} 
              className={`capitalize transition-colors hover:text-blue-600 
                ${isActive ? 'text-blue-600 font-semibold' : ''}`
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