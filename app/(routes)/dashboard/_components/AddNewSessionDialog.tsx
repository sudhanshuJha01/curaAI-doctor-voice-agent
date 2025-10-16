"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import axios from "axios";
import { DoctorAgentType } from "./DocterAgentCard";
import { Loader2, Plus, Sparkles } from "lucide-react";
import SelectDoctorAgentCard from "./SelectDoctorAgentCard";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const AddNewSessionDialog = () => {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<DoctorAgentType[]>();
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorAgentType>();
  const [historyList, setHistoryList] = useState([]);
  const [open, setOpen] = useState(false);
  const { isSignedIn, has } = useAuth();
  const router = useRouter();

  const hasProPlan = isSignedIn && has({ plan: "pro" });

  useEffect(() => {
    getHistoryList();
  }, []);

  const getHistoryList = async () => {
    try {
      const result = await axios.get("/api/session-chat?sessionId=all");
      setHistoryList(result.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleStartConsultation = async () => {
    if (!selectedDoctor) return;

    try {
      setLoading(true);

      const result = await axios.post("/api/session-chat", {
        note,
        selectedDoctor,
      });

      if (result.data.sessionId) {
                router.push(`/dashboard/doctor-agent/${result.data.sessionId}`);
        setOpen(false);
      }
    } catch (error) {
      console.error("Error starting consultation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorListSuggestion = async () => {
    try {
      setLoading(true);
      const result = await axios.post("/api/suggest-doctors", {
        note,
      });

      setSuggestedDoctors(result.data.doctors);
    } catch (error) {
      console.error("Error fetching doctor suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setNote("");
    setSuggestedDoctors(undefined);
    setSelectedDoctor(undefined);
  };

  const isFreeLimitReached = !hasProPlan && historyList?.length >= 1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-pink-600 hover:bg-pink-700 text-white"
          disabled={isFreeLimitReached}
        >
          <Plus className="w-4 h-4 mr-2" />
          {isFreeLimitReached ? "Upgrade to Pro" : "New Consultation"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {!suggestedDoctors ? "Start New Consultation" : "Suggested Specialists"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {!suggestedDoctors
              ? "Describe your symptoms to get AI-recommended specialists"
              : "Select a specialist to begin your consultation"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {!suggestedDoctors ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  What brings you here today?
                </label>
                <Textarea
                  placeholder="e.g., I have a persistent cough and headache for the past 3 days..."
                  onChange={(e) => setNote(e.target.value)}
                  value={note}
                  className="min-h-[120px] border-pink-200 focus:border-pink-400"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Provide as much detail as possible for better recommendations
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-pink-700 bg-pink-50 p-3 rounded-lg border border-pink-200">
                <Sparkles className="w-4 h-4" />
                <p>AI analyzed your symptoms and recommends these specialists:</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestedDoctors.map((doctor) => (
                  <div key={doctor.id} onClick={() => setSelectedDoctor(doctor)}>
                    <SelectDoctorAgentCard
                      docterAgent={doctor}
                      isSelected={selectedDoctor?.id === doctor.id}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {suggestedDoctors && (
            <Button variant="outline" onClick={handleReset} className="border-pink-300 text-pink-700 hover:bg-pink-50">
              Back
            </Button>
          )}
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          {!suggestedDoctors ? (
            <Button
              disabled={!note || loading}
              onClick={handleDoctorListSuggestion}
              className="bg-pink-600 hover:bg-pink-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get AI Suggestions
                </>
              )}
            </Button>
          ) : (
            <Button
              disabled={!selectedDoctor || loading}
              onClick={handleStartConsultation}
              className="bg-pink-600 hover:bg-pink-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                "Start Consultation"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewSessionDialog;