"use client";
import { useParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { Loader2 } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string; 
};

type Doctor = {
  image: string;
  specialist: string;
};

type SessionDetail = {
  selectedDoctor: Doctor;
};

const DoctorVoiceAgent = () => {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [isEndingCall, setIsEndingCall] = useState(false); 

  const [messages, setMessages] = useState<Message[]>([]);
  const [liveMessage, setLiveMessage] = useState<Message | null>(null);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>([]); 
  
  const [vapi] = useState(() => new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!));


  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  

  useEffect(() => {
    if (sessionId) {
      const getSessionDetail = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`/api/session-chat?sessionId=${sessionId}`);
          setSessionDetail(response.data);
        } catch (error) {
          console.error("Failed to fetch session details:", error);
        }
        setIsLoading(false);
      };
      getSessionDetail();
    }
  }, [sessionId]);


  useEffect(() => {
    const onCallStart = () => setIsCallConnected(true);
    const onSpeechStart = () => setIsAssistantSpeaking(true);
    const onSpeechEnd = () => setIsAssistantSpeaking(false);

    const onCallEnd = () => {
      setIsCallConnected(false);
      setIsAssistantSpeaking(false);
      setMessages([]);
      setLiveMessage(null);
    };

    const onMessage = (message: any) => {
      if (message.type !== 'transcript' || !message.transcript) return;
      const { role, transcript, transcriptType } = message;
      const currentMessage: Message = { role, content: transcript };

      if (transcriptType === 'partial') {
        setLiveMessage(currentMessage);
      } else if (transcriptType === 'final') {
        setMessages((prev) => [...prev, currentMessage]);
        setLiveMessage(null);
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on("message", onMessage);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off("message", onMessage);
    };
  }, [vapi]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, liveMessage]);

  const startCall = useCallback(() => {
    vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID!);
  }, [vapi]);

  const generateReport = async (conversation: Message[]) => {
    try {
      const result = await axios.post('/api/medical-report', {
        messages: conversation,
        sessionDetail,
        sessionId
      });
      console.log("Report generated:", result.data);
      return result.data;
    } catch (error) {
      console.error("Failed to generate report:", error);
    }
  };

  const endCall = useCallback(async () => {
    setIsEndingCall(true);
    await generateReport(messagesRef.current);
    vapi.stop();
    setIsEndingCall(false);
  }, [vapi, sessionDetail, sessionId]); 


  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-blue-500" /></div>;
  }

  const getStatusText = () => {
    if (isCallConnected) {
      return isAssistantSpeaking ? "Assistant is Speaking..." : "Listening...";
    }
    return "Ready to Connect";
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-4 h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{sessionDetail?.selectedDoctor?.specialist || "Doctor"}</h2>
          <p className={`font-semibold transition-colors duration-300 ${isCallConnected ? 'text-green-500' : 'text-gray-500'}`}>{getStatusText()}</p>
        </div>

        <div className="flex justify-center mb-4">
          <div className="relative">
            <Image
              src={sessionDetail?.selectedDoctor?.image || "/default-avatar.png"}
              alt={sessionDetail?.selectedDoctor?.specialist || "Doctor"}
              width={120}
              height={120}
              className={`rounded-full border-4 transition-all duration-300 ${isAssistantSpeaking ? 'border-blue-500 animate-pulse' : 'border-gray-200'}`}
            />
          </div>
        </div>

        <div ref={chatContainerRef} className="mb-4 w-full bg-gray-50 p-4 rounded-lg shadow-inner min-h-[300px] max-h-[300px] overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={`final-${index}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-[85%] break-words ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {liveMessage && (
            <div className={`flex ${liveMessage.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-[85%] break-words text-gray-500 ${liveMessage.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {liveMessage.content}
              </div>
            </div>
          )}
          {!isCallConnected && messages.length === 0 && <div className="text-center text-gray-400 pt-20">Start the call to see the transcript.</div>}
        </div>

        <div className="flex justify-center">
            {!isCallConnected ? (
              <Button onClick={startCall} size="lg" className="w-full">Start Call</Button>
            ) : (
              // 4. UX: Improved button loading state
              <Button onClick={endCall} variant="destructive" size="lg" className="w-full" disabled={isEndingCall}>
                {isEndingCall && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEndingCall ? "Generating Report..." : "End Call"}
              </Button>
            )}
        </div>
      </div>
    </div>
  );
};

export default DoctorVoiceAgent;