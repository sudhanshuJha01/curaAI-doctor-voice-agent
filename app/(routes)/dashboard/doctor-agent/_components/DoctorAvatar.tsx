import Image from "next/image";
import { Heart, Image as ImageIcon, Mic, MicOff } from "lucide-react";
import { useState } from "react";

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


export const DoctorAvatar = ({
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