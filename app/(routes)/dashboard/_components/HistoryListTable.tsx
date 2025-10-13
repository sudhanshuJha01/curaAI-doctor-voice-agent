import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import moment from 'moment'

const HistoryListTable = ({historyList}:any) => {
  return (
    <Table>
  <TableCaption>Previous Consultation Report</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">AI Medical Specialist</TableHead>
      <TableHead>Discription</TableHead>
      <TableHead>Date</TableHead>
      <TableHead className="text-right">Action</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {historyList.map((record:any)=>(        
    <TableRow>
      <TableCell className="font-medium">{record.selectedDoctor.specialist}</TableCell>
      <TableCell>{record.notes}</TableCell>
      <TableCell>{ moment(new Date(record.createdOn)).fromNow()}</TableCell>
      <TableCell className="text-right"><Button variant={"link"}>View Report</Button></TableCell>
    </TableRow>
    ))}
  </TableBody>
</Table>
  )
}

export default HistoryListTable