"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ViewReportDialog from "./ViewReportDialog";
import ClientOnlyTimestamp from "./ClientOnlyTimestamp"; 

const HistoryListTable = ({ historyList }: { historyList: any[] }) => {
  if (!historyList || historyList.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No consultation history found.
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>A list of your previous consultations.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">AI Medical Specialist</TableHead>
          <TableHead>Chief Complaint / Notes</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {historyList.map((record: any) => (
          <TableRow key={record.sessionId}>
            <TableCell className="font-medium">
              {record.selectedDoctor.specialist}
            </TableCell>
            <TableCell>{record.notes}</TableCell>
            <TableCell>

              <ClientOnlyTimestamp date={record.createdOn} />
            </TableCell>
            <TableCell className="text-right">
              <ViewReportDialog report={record.report} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default HistoryListTable;