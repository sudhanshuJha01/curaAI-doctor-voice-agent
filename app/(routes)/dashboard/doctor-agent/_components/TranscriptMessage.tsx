
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


export const TranscriptMessage = ({
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