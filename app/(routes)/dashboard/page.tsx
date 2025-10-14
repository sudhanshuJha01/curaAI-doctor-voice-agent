import HistoryList from "./_components/HistoryList";
import DocterAgentList from "@/app/(routes)/dashboard/_components/DocterAgentList";
import AddNewSessionDialog from "@/app/(routes)/dashboard/_components/AddNewSessionDialog";
import { Activity, Clock } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                My Dashboard
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Activity className="w-4 h-4 text-pink-600" />
                Manage your medical consultations and history
              </p>
            </div>
            <AddNewSessionDialog />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-pink-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Recent Consultations
            </h2>
          </div>
          <HistoryList limit={3} />
        </div>

        <div className="mb-8">
          <DocterAgentList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;