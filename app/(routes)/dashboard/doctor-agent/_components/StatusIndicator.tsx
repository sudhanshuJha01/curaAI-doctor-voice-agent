
export const StatusIndicator = ({
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
    if (timeRemaining > 30) return "text-yellow-600"; 
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