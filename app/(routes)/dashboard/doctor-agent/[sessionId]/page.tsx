"use client";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { Loader2, Phone, PhoneOff, Mic, MicOff, Heart } from "lucide-react";

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

const DoctorAvatar = ({ 
  doctor, 
  isCallConnected, 
  isAssistantSpeaking 
}: { 
  doctor: Doctor | undefined; 
  isCallConnected: boolean; 
  isAssistantSpeaking: boolean;
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative flex justify-center mb-6">
      <div className={`relative transition-all duration-300 ${isAssistantSpeaking ? 'scale-105' : 'scale-100'}`}>
        <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
          isAssistantSpeaking 
            ? 'bg-pink-500 opacity-30 blur-xl animate-pulse' 
            : 'bg-pink-200 opacity-0'
        }`}></div>
        
        <div className={`relative w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-300 ${
          isAssistantSpeaking 
            ? 'border-pink-500 shadow-lg shadow-pink-300' 
            : isCallConnected 
              ? 'border-green-400' 
              : 'border-pink-200'
        }`}>
          {!imageError && doctor?.image ? (
            <Image
              src={doctor.image}
              alt={doctor.specialist || "Doctor"}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <Heart className="w-16 h-16 text-white fill-white" />
            </div>
          )}
        </div>

        {isCallConnected && (
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
            {isAssistantSpeaking ? (
              <Mic className="w-5 h-5 text-white" />
            ) : (
              <MicOff className="w-5 h-5 text-white" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const StatusIndicator = ({ 
  isCallConnected, 
  isAssistantSpeaking 
}: { 
  isCallConnected: boolean; 
  isAssistantSpeaking: boolean;
}) => {
  const getStatusText = () => {
    if (isCallConnected) {
      return isAssistantSpeaking ? "AI Doctor is Speaking..." : "Listening...";
    }
    return "Ready to Start Consultation";
  };

  const getStatusColor = () => {
    if (isCallConnected) {
      return isAssistantSpeaking ? "text-pink-600" : "text-green-600";
    }
    return "text-gray-500";
  };

  return (
    <div className="text-center mb-6">
      <p className={`font-semibold text-lg transition-colors duration-300 ${getStatusColor()}`}>
        {getStatusText()}
      </p>
      {isCallConnected && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className={`w-2 h-2 rounded-full ${isAssistantSpeaking ? 'bg-pink-500 animate-pulse' : 'bg-green-500'}`}></div>
          <p className="text-sm text-gray-600">
            {isAssistantSpeaking ? "AI Processing" : "Your Turn"}
          </p>
        </div>
      )}
    </div>
  );
};

const TranscriptMessage = ({ 
  message, 
  isLive 
}: { 
  message: Message; 
  isLive?: boolean;
}) => {
  const isUser = message.role === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`max-w-[85%] rounded-lg px-4 py-2 transition-all duration-200 ${
        isUser 
          ? `bg-pink-600 text-white ${isLive ? 'opacity-70' : ''}` 
          : `bg-gray-100 text-gray-800 ${isLive ? 'opacity-70' : ''}`
      }`}>
        <p className="text-sm break-words">{message.content}</p>
      </div>
    </div>
  );
};

const TranscriptContainer = ({ 
  messages, 
  liveMessage, 
  isCallConnected 
}: { 
  messages: Message[]; 
  liveMessage: Message | null; 
  isCallConnected: boolean;
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, liveMessage]);

  return (
    <div 
      ref={chatContainerRef}
      className="bg-gradient-to-b from-pink-50 to-rose-50 rounded-xl p-4 min-h-[350px] max-h-[350px] overflow-y-auto mb-6 border border-pink-100"
    >
      {!isCallConnected && messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
            <Phone className="w-8 h-8 text-pink-600" />
          </div>
          <p className="text-gray-500 font-medium">Start the call to see live transcript</p>
          <p className="text-sm text-gray-400 mt-2">Your conversation will appear here in real-time</p>
        </div>
      ) : (
        <>
          {messages.map((msg, index) => (
            <TranscriptMessage key={`msg-${index}`} message={msg} />
          ))}
          {liveMessage && (
            <TranscriptMessage message={liveMessage} isLive />
          )}
        </>
      )}
    </div>
  );
};

const CallControls = ({ 
  isCallConnected, 
  isEndingCall, 
  onStartCall, 
  onEndCall 
}: { 
  isCallConnected: boolean; 
  isEndingCall: boolean; 
  onStartCall: () => void; 
  onEndCall: () => void;
}) => {
  return (
    <div className="flex gap-3">
      {!isCallConnected ? (
        <Button 
          onClick={onStartCall} 
          className="flex-1 h-12 bg-pink-600 hover:bg-pink-700 text-white text-lg"
        >
          <Phone className="w-5 h-5 mr-2" />
          Start Consultation
        </Button>
      ) : (
        <Button 
          onClick={onEndCall} 
          variant="destructive" 
          className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-lg"
          disabled={isEndingCall}
        >
          {isEndingCall ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <PhoneOff className="w-5 h-5 mr-2" />
              End Consultation
            </>
          )}
        </Button>
      )}
    </div>
  );
};

const DoctorVoiceAgent = () => {
  const { sessionId } = useParams();
  const router = useRouter();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [isEndingCall, setIsEndingCall] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [liveMessage, setLiveMessage] = useState<Message | null>(null);
  
  const messagesRef = useRef<Message[]>([]);
  const [vapi] = useState(() => new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!));

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (sessionId) {
      const getSessionDetail = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`/api/session-chat?sessionId=${sessionId}`);
          setSessionDetail(response.data);
        } catch (error) {
          console.error("Failed to fetch session details:", error);
        } finally {
          setIsLoading(false);
        }
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
      if (message.type !== "transcript" || !message.transcript) return;
      const { role, transcript, transcriptType } = message;
      const currentMessage: Message = { role, content: transcript };

      if (transcriptType === "partial") {
        setLiveMessage(currentMessage);
      } else if (transcriptType === "final") {
        setMessages((prev) => [...prev, currentMessage]);
        setLiveMessage(null);
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("message", onMessage);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("message", onMessage);
    };
  }, [vapi]);

  const startCall = useCallback(() => {
    vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID!);
  }, [vapi]);

  const generateReport = async (conversation: Message[]) => {
    try {
      const result = await axios.post("/api/medical-report", {
        messages: conversation,
        sessionDetail,
        sessionId,
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
    router.push("/dashboard/history");
  }, [vapi, sessionDetail, sessionId, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-pink-50 to-rose-50">
        <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-4 animate-pulse">
          <Heart className="w-12 h-12 text-white fill-white" />
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-pink-600 mb-2" />
        <p className="text-gray-600 font-medium">Loading consultation...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-pink-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {sessionDetail?.selectedDoctor?.specialist || "AI Medical Consultation"}
          </h1>
          <p className="text-sm text-gray-600">Live voice consultation with real-time transcript</p>
        </div>

        <DoctorAvatar 
          doctor={sessionDetail?.selectedDoctor} 
          isCallConnected={isCallConnected} 
          isAssistantSpeaking={isAssistantSpeaking} 
        />

        <StatusIndicator 
          isCallConnected={isCallConnected} 
          isAssistantSpeaking={isAssistantSpeaking} 
        />

        <TranscriptContainer 
          messages={messages} 
          liveMessage={liveMessage} 
          isCallConnected={isCallConnected} 
        />

        <CallControls 
          isCallConnected={isCallConnected} 
          isEndingCall={isEndingCall} 
          onStartCall={startCall} 
          onEndCall={endCall} 
        />
      </div>
    </div>
  );
};

export default DoctorVoiceAgent;