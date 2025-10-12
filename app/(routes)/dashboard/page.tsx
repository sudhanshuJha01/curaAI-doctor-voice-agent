import HistoryList from "./_components/HistoryList"
import { Button } from "@/components/ui/button"
import DocterAgentList from "@/app/_components/DocterAgentList"
import AddNewSessionDialog from "@/app/_components/AddNewSessionDialog"
const Dashboard = () => {
  return (

    <div className="p-4">
        <div className="flex item-center  justify-between">
        <h2>My Dashboard</h2>
        <AddNewSessionDialog/>
        </div>
        <HistoryList/>
        <DocterAgentList/>
    </div>
  )
}

export default Dashboard