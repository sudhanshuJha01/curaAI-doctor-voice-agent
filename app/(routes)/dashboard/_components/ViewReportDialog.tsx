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

const ReportListItem = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <h3 className="font-semibold text-md text-gray-800 mb-1">{title}</h3>
    <div className="text-sm text-gray-600">{children}</div>
  </div>
);

const ViewReportDialog = ({ report }: { report: any }) => {
        console.log("report in view " , report)
    if (!report) return null;
  return (
    <Dialog>
      <DialogTrigger><Button variant={"link"}>View Report</Button></DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Medical Consultation Report</DialogTitle>
          <DialogDescription>
            AI-generated summary for session: {report.sessionld}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
             <ReportListItem title="AI Agent">
              <p>{report.agent}</p>
             </ReportListItem>
             <ReportListItem title="Date">
                <p>{new Date(report.timestamp).toLocaleDateString()}</p>
             </ReportListItem>
          </div>
          
          <ReportListItem title="Chief Complaint">
            <Badge variant="secondary">{report.chiefComplaint}</Badge>
          </ReportListItem>

          <ReportListItem title="Consultation Summary">
            <p className="leading-relaxed">{report.summary}</p>
          </ReportListItem>

          <ReportListItem title="Mentioned Symptoms">
            <div className="flex flex-wrap gap-2">
              {report.symptoms.length > 0 ? (
                report.symptoms.map((symptom: string, index: number) => (
                  <Badge key={index}>{symptom}</Badge>
                ))
              ) : (
                <p>No specific symptoms mentioned.</p>
              )}
            </div>
          </ReportListItem>

          <ReportListItem title="AI Recommendations">
            <ul className="list-disc pl-5 space-y-1">
              {report.recommendations.map((rec: string, index: number) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </ReportListItem>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Close
                </Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReportDialog;