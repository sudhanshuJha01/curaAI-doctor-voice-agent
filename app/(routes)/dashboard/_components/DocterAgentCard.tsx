"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { Lock, Loader2 } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const hasProPlan = isSignedIn && has({ plan: "pro" });

  const canConsult = !docterAgent.subscriptionRequired || hasProPlan;

  const handleStartConsultation = async () => {
    if (!canConsult || loading) return;
    
    try {
      setLoading(true);
      const result = await axios.post('/api/session-chat', {
        note: "User selected doctor agent",
        selectedDoctor: docterAgent
      });

      if (result.data.sessionId) {
           router.push(`/dashboard/doctor-agent/${result.data.sessionId}`);
      }
    } catch (error) {
      console.error("Error starting consultation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-pink-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
      <div className="relative w-full h-56 bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-2">
        <div className="relative w-full h-full">
          <Image
            src={docterAgent.image}
            alt={docterAgent.specialist}
            fill
            className="object-contain"
          />
        </div>
        {docterAgent.subscriptionRequired && !hasProPlan && (
          <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            PRO
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {docterAgent.specialist}
        </h3>
        <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">
          {docterAgent.description}
        </p>

        <Button 
          onClick={handleStartConsultation} 
          className="w-full bg-pink-600 hover:bg-pink-700 text-white" 
          disabled={!canConsult || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Starting...
            </>
          ) : !canConsult ? (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Pro Plan Required
            </>
          ) : (
            "Start Consultation"
          )}
        </Button>
      </div>
    </div>
  );
};

export default DoctorAgentCard;