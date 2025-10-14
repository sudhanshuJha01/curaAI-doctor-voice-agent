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
import { Stethoscope } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HistoryListTableProps {
  historyList: any[];
  limit?: number;
}

const HistoryListTable = ({ historyList, limit }: HistoryListTableProps) => {
  if (!historyList || historyList.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No consultation history found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption className="text-gray-500 pb-4">
          Your recent medical consultations with CureAI
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-pink-50 hover:bg-pink-50">
            <TableHead className="font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-pink-600" />
                AI Medical Specialist
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700">Chief Complaint</TableHead>
            <TableHead className="font-semibold text-gray-700">Date</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyList.map((record: any, index: number) => (
            <TableRow 
              key={record.sessionId} 
              className="hover:bg-pink-50 transition-colors"
            >
              <TableCell className="font-medium text-gray-900">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  {record.selectedDoctor.specialist}
                </div>
              </TableCell>
              <TableCell className="text-gray-700">
                <div className="max-w-md truncate">
                  {record.notes || 'No notes provided'}
                </div>
              </TableCell>
              <TableCell className="text-gray-600">
                <ClientOnlyTimestamp date={record.createdOn} />
              </TableCell>
              <TableCell className="text-right">
                <ViewReportDialog report={record.report} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {limit && (
        <div className="p-4 border-t border-pink-100 text-center">
          <Link href="/dashboard/history">
            <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-50">
              View All History
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HistoryListTable;