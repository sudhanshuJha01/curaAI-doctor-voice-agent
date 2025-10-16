"use client"
import axios from 'axios'
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { UserDetailContext } from '@/context/userDetailContext';

export type UserType = {
    name:string,
    email:string,
    credit:number
}

const Provider = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
    const { user } = useUser();
    const [userDetail , setUserDetail] = useState();

    useEffect(() => {
        if (user) {
            createNewUser();
        }
    }, [user]);

    const createNewUser = async () => {
        try {
            const response = await axios.post('/api/users');
            setUserDetail(response?.data)
        } catch (error) {
            console.error("Failed to create or fetch user:", error);
        }
    };

    return (
        <div>
            <UserDetailContext.Provider value={{userDetail , setUserDetail}}>
            {children}
            </UserDetailContext.Provider>
            </div>
    )
}

export default Provider;