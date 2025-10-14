import { AIDoctorAgents } from "@/shared/list";
import DoctorAgentCard from "./DocterAgentCard";
import { Stethoscope } from "lucide-react";

const DocterAgentList = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Stethoscope className="w-5 h-5 text-pink-600" />
        <h2 className="text-2xl font-semibold text-gray-900">
          AI Specialist Doctors
        </h2>
      </div>
      <p className="text-gray-600 mb-6">Choose a specialist for your consultation</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {AIDoctorAgents && AIDoctorAgents.map((doctor) => (
          <DoctorAgentCard key={doctor.id} docterAgent={doctor} />
        ))}
      </div>
    </div>
  );
};

export default DocterAgentList;