"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Stethoscope, Activity, Clock, AlertCircle, Pill } from "lucide-react";

const ReportListItem = ({ 
  title, 
  children, 
  icon 
}: { 
  title: string; 
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <div className="mb-4">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
    </div>
    <div className="text-sm text-gray-700 pl-6">{children}</div>
  </div>
);

const ViewReportDialog = ({ report }: { report: any }) => {
  if (!report) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-pink-300 text-pink-700 hover:bg-pink-50">
          <FileText className="w-4 h-4 mr-1" />
          View Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            Medical Consultation Report
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            AI-generated summary for session ID: <span className="font-mono text-xs">{report.sessionld}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4 p-4 bg-pink-50 rounded-lg border border-pink-100">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-pink-600" />
              <div>
                <p className="text-xs text-gray-600">AI Specialist</p>
                <p className="font-semibold text-gray-900">{report.agent}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-pink-600" />
              <div>
                <p className="text-xs text-gray-600">Consultation Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(report.timestamp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-pink-100 rounded-lg p-4 bg-white">
            <ReportListItem 
              title="Chief Complaint" 
              icon={<AlertCircle className="w-4 h-4 text-pink-600" />}
            >
              <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-200">
                {report.chiefComplaint}
              </Badge>
            </ReportListItem>

            <ReportListItem 
              title="Consultation Summary" 
              icon={<FileText className="w-4 h-4 text-pink-600" />}
            >
              <p className="leading-relaxed">{report.summary}</p>
            </ReportListItem>

            <ReportListItem 
              title="Reported Symptoms" 
              icon={<Activity className="w-4 h-4 text-pink-600" />}
            >
              <div className="flex flex-wrap gap-2">
                {report.symptoms && report.symptoms.length > 0 ? (
                  report.symptoms.map((symptom: string, index: number) => (
                    <Badge key={index} variant="outline" className="border-pink-300 text-pink-700">
                      {symptom}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No specific symptoms mentioned</p>
                )}
              </div>
            </ReportListItem>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <ReportListItem 
                title="Duration" 
                icon={<Clock className="w-4 h-4 text-pink-600" />}
              >
                <Badge variant="secondary">{report.duration || "Not specified"}</Badge>
              </ReportListItem>

              <ReportListItem 
                title="Severity" 
                icon={<AlertCircle className="w-4 h-4 text-pink-600" />}
              >
                <Badge variant="secondary">{report.severity || "Not specified"}</Badge>
              </ReportListItem>
            </div>

            {report.medicationsMentioned && report.medicationsMentioned.length > 0 && (
              <ReportListItem 
                title="Medications Mentioned" 
                icon={<Pill className="w-4 h-4 text-pink-600" />}
              >
                <ul className="list-disc pl-5 space-y-1">
                  {report.medicationsMentioned.map((med: string, index: number) => (
                    <li key={index}>{med}</li>
                  ))}
                </ul>
              </ReportListItem>
            )}

            <ReportListItem 
              title="AI Recommendations" 
              icon={<Stethoscope className="w-4 h-4 text-pink-600" />}
            >
              <ul className="list-disc pl-5 space-y-2">
                {report.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="leading-relaxed">{rec}</li>
                ))}
              </ul>
            </ReportListItem>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
            <p className="text-xs text-gray-600">
              <strong className="text-rose-700">Disclaimer:</strong> This report is generated by AI and is for informational purposes only. 
              It is not a substitute for professional medical advice, diagnosis, or treatment. 
              Always consult a licensed healthcare provider for medical concerns.
            </p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-50">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReportDialog;