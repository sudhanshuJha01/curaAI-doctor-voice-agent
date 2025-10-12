"use client"

import { useParams } from 'next/navigation'
import axios from 'axios'
import { useEffect, useState } from 'react'

const DoctorVoiceAgent = () => {
  const [sessionDetail , setSessionDetail] = useState()

    const { sessionId } = useParams();

    useEffect(() => {
        if (sessionId) {
            getSessionDetail();
        }
    }, [sessionId]);

    const getSessionDetail = async () => {
        try {
            
            const response = await axios.get(`/api/session-chat?sessionId=${sessionId}`);
            setSessionDetail(response.data)
            console.log("Session detail:", response.data);
        } catch (error) {

            console.error("Failed to fetch session details:", error);
        }
    };

    return (
        <div>Session ID: {sessionId}</div>
    );
}

export default DoctorVoiceAgent;