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
  voiceId: string;
  agentPrompt: string;
};

type SessionDetail = {
  selectedDoctor: Doctor;
};

const DoctorAvatar = ({
  doctor,
  isCallConnected,
  isAssistantSpeaking,
}: {
  doctor: Doctor | undefined;
  isCallConnected: boolean;
  isAssistantSpeaking: boolean;
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative flex justify-center mb-6">
      <div
        className={`relative transition-all duration-300 ${
          isAssistantSpeaking ? "scale-105" : "scale-100"
        }`}
      >
        <div
          className={`absolute inset-0 rounded-full transition-all duration-300 ${
            isAssistantSpeaking
              ? "bg-pink-500 opacity-30 blur-xl animate-pulse"
              : "bg-pink-200 opacity-0"
          }`}
        ></div>

        <div
          className={`relative w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-300 ${
            isAssistantSpeaking
              ? "border-pink-500 shadow-lg shadow-pink-300"
              : isCallConnected
              ? "border-green-400"
              : "border-pink-200"
          }`}
        >
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
  isAssistantSpeaking,
  timeRemaining,
}: {
  isCallConnected: boolean;
  isAssistantSpeaking: boolean;
  timeRemaining: number;
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeRemaining > 60) return "text-green-600";
    if (timeRemaining > 30) return "text-yellow-600"; // > 1 minute
    return "text-red-600 animate-pulse"; 
  };

  return (
    <div className="text-center mb-6">
      <p
        className={`font-semibold text-lg transition-colors duration-300 ${getStatusColor()}`}
      >
        {getStatusText()}
      </p>
      {isCallConnected && (
        <div className="flex flex-col items-center gap-2 mt-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isAssistantSpeaking
                  ? "bg-pink-500 animate-pulse"
                  : "bg-green-500"
              }`}
            ></div>
            <p className="text-sm text-gray-600">
              {isAssistantSpeaking ? "AI Processing" : "Your Turn"}
            </p>
          </div>
          <div
            className={`text-2xl font-bold ${getTimerColor()} flex items-center gap-2`}
          >
            <span>⏱️</span>
            <span>{formatTime(timeRemaining)}</span>
          </div>
          {timeRemaining <= 60 && (
            <p className="text-xs text-red-600 font-medium">
              Consultation ending soon
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const TranscriptMessage = ({
  message,
  isLive,
}: {
  message: Message;
  isLive?: boolean;
}) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-2 transition-all duration-200 ${
          isUser
            ? `bg-pink-600 text-white ${isLive ? "opacity-70" : ""}`
            : `bg-gray-100 text-gray-800 ${isLive ? "opacity-70" : ""}`
        }`}
      >
        <p className="text-sm break-words">{message.content}</p>
      </div>
    </div>
  );
};

const TranscriptContainer = ({
  messages,
  liveMessage,
  isCallConnected,
}: {
  messages: Message[];
  liveMessage: Message | null;
  isCallConnected: boolean;
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
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
          <p className="text-gray-500 font-medium">
            Start the call to see live transcript
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Your conversation will appear here in real-time
          </p>
        </div>
      ) : (
        <>
          {messages.map((msg, index) => (
            <TranscriptMessage key={`msg-${index}`} message={msg} />
          ))}
          {liveMessage && <TranscriptMessage message={liveMessage} isLive />}
        </>
      )}
    </div>
  );
};

const CallControls = ({
  isCallConnected,
  isEndingCall,
  isConnecting,
  onStartCall,
  onEndCall,
}: {
  isCallConnected: boolean;
  isEndingCall: boolean;
  isConnecting: boolean;
  onStartCall: () => void;
  onEndCall: () => void;
}) => {
  return (
    <div className="flex gap-3">
      {!isCallConnected ? (
        <Button
          onClick={onStartCall}
          className="flex-1 h-12 bg-pink-600 hover:bg-pink-700 text-white text-lg"
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Phone className="w-5 h-5 mr-2" />
              Start Consultation
            </>
          )}
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
  const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [isEndingCall, setIsEndingCall] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [liveMessage, setLiveMessage] = useState<Message | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(180);

  const messagesRef = useRef<Message[]>([]);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [vapi] = useState(
    () => new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!)
  );

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (sessionId) {
      const getSessionDetail = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(
            `/api/session-chat?sessionId=${sessionId}`
          );
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
    const onCallStart = () => {
      setIsCallConnected(true);
      setIsConnecting(false);
      setTimeRemaining(180); 

      countdownIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      callTimerRef.current = setTimeout(() => {
        console.log("5-minute limit reached - auto-ending call");
        endCall();
      }, 3* 60 * 1000);
    };

    const onSpeechStart = () => setIsAssistantSpeaking(true);
    const onSpeechEnd = () => setIsAssistantSpeaking(false);

    const onCallEnd = () => {
      setIsCallConnected(false);
      setIsAssistantSpeaking(false);
      setIsConnecting(false);
      setMessages([]);
      setLiveMessage(null);
      setTimeRemaining(300);

      if (callTimerRef.current) {
        clearTimeout(callTimerRef.current);
        callTimerRef.current = null;
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
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

    const onError = (error: any) => {
      console.error("VAPI Error:", error);
      setIsConnecting(false);
      setIsCallConnected(false);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("message", onMessage);
      vapi.off("error", onError);

      if (callTimerRef.current) {
        clearTimeout(callTimerRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [vapi]);

  const startCall = () => {
    if (!sessionDetail?.selectedDoctor) {
      console.error("No doctor selected");
      return;
    }

    setIsConnecting(true);

    const doctor = sessionDetail.selectedDoctor;

    const vapiConfig = {
      name: doctor.specialist,
      voice: {
        model: "tts-1",
        voiceId: doctor.voiceId,
        provider: "openai",
      },
      model: {
        model: "gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `${doctor?.agentPrompt}

CRITICAL INSTRUCTIONS:
- Always reply in natural, conversational paragraphs (never use bullet points or numbered lists)
- Speak like a real human doctor - warm, empathetic, and concise
- Keep each response under 50 words to maintain engagement
- This is a 5-MINUTE quick consultation - aim to complete in 5-6 exchanges total
- Track the conversation: After 4-5 exchanges, start wrapping up
- After gathering key information, provide a brief assessment and actionable recommendations
- On your 6th response OR when you sense the call is ending, provide a quick conclusion: "Based on what you've shared, here's my assessment: [brief summary]. My recommendations: [2-3 key points]. Thank you for consulting with me today."
- Be efficient but thorough - ask focused questions to gather symptoms, duration, severity, and relevant history
- Avoid lengthy explanations unless critical for patient safety
- If the session must end abruptly, quickly summarize what you learned and give brief advice`,
          },
        ],
        provider: "google",
      },
      firstMessage: `Hello! I'm your AI ${doctor.specialist}. How can I help you today? Please tell me your name, age, and what brings you here.`,
      voicemailMessage: "Please call back when you're available.",
      endCallMessage:
        "Thank you for consulting with me today. Take care and feel better soon!",
      transcriber: {
        language: "en",
        provider: "assembly-ai",
        formatTurns: true,
        confidenceThreshold: 0.4,
        disablePartialTranscripts: false,
      },
      backgroundDenoisingEnabled: true,
    };

    try {
      //@ts-ignore
      vapi.start(vapiConfig);
    } catch (error) {
      console.error("Failed to start call:", error);
      setIsConnecting(false);
    }
  };

  const generateReport = async (conversation: Message[]) => {
    try {
      console.log("conversation " , conversation)
      console.log("sessionDetail  " , sessionDetail)
      console.log("sessionID " , sessionId)
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
  }, [vapi, sessionId, router]);

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
            {sessionDetail?.selectedDoctor?.specialist ||
              "AI Medical Consultation"}
          </h1>
          <p className="text-sm text-gray-600">
            Live voice consultation with real-time transcript
          </p>
        </div>

        <DoctorAvatar
          doctor={sessionDetail?.selectedDoctor}
          isCallConnected={isCallConnected}
          isAssistantSpeaking={isAssistantSpeaking}
        />

        <StatusIndicator
          isCallConnected={isCallConnected}
          isAssistantSpeaking={isAssistantSpeaking}
          timeRemaining={timeRemaining}
        />

        <TranscriptContainer
          messages={messages}
          liveMessage={liveMessage}
          isCallConnected={isCallConnected}
        />

        <CallControls
          isCallConnected={isCallConnected}
          isEndingCall={isEndingCall}
          isConnecting={isConnecting}
          onStartCall={startCall}
          onEndCall={endCall}
        />
      </div>
    </div>
  );
};

export default DoctorVoiceAgent;
