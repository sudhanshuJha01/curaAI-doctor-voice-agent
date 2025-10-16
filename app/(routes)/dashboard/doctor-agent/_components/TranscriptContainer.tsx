import { Phone } from "lucide-react";
import { useEffect, useRef } from "react";
import { TranscriptMessage } from "./TranscriptMessage";

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


export const TranscriptContainer = ({
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