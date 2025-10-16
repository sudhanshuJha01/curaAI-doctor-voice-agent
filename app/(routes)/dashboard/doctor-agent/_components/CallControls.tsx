import { Button } from "@/components/ui/button";
import { Loader2, Phone, PhoneOff } from "lucide-react";

export const CallControls = ({
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
