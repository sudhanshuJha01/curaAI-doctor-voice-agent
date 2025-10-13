"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { Lock } from "lucide-react"; 
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export type DoctorAgentType = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
  voiceId: string;
  subscriptionRequired: boolean;
  regionOfSelection?: string;
};

type DoctorPropType = {
  docterAgent: DoctorAgentType;
};


const DoctorAgentCard = ({ docterAgent }: DoctorPropType) => {
  const { isSignedIn, has } = useAuth();
  const [loading , setLoading] = useState(false)
  const router = useRouter()
  const hasProPlan = isSignedIn && has({ plan: "pro" }); 
  

  const canConsult = !docterAgent.subscriptionRequired || hasProPlan;
  console.log("specialist",docterAgent.specialist)

      const handleStartConsultation =async ()=>{
        setLoading(true)
        const result  = await axios.post('/api/session-chat',{
            note:"user selected doctor agent",
            selectedDoctor:docterAgent.specialist
        })

        console.log("result " , result.data)
        if(result.data.sessionId){
            console.log("result sessionId" , result.data.sessionId)
            router.push(`/dashboard/doctor-agent/${result.data.sessionId}`)
        }
        setLoading(false)
    }

  return (
    <div className="border rounded-lg p-4 flex flex-col items-center text-center shadow-md">
      <Image
        src={docterAgent.image}
        alt={docterAgent.specialist}
        width={200}
        height={300}
        className="w-full h-[250px] object-cover rounded-t-lg"
      />
      <h2 className="text-xl font-bold mt-4">{docterAgent.specialist}</h2>
      <p className="text-gray-600 mt-2 flex-grow">{docterAgent.description}</p>

      <Button onClick={handleStartConsultation} className="mt-4 w-full" disabled={!canConsult}>
        {!canConsult && <Lock className="mr-2 h-4 w-4" />}
        {canConsult ? "Start Consult" : "Pro Plan Required"}
      </Button>
    </div>
  );
};

export default DoctorAgentCard;