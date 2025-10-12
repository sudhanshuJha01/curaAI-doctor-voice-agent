
import { AIDoctorAgents } from "@/shared/list"
import DoctorAgentCard from "./DocterAgentCard"

const DocterAgentList = () => {
  return (
    <div  className="my-3">
        <h1 className='font-bold text-2xl'>AI specialist doctor</h1>
        <div className=" flex gap-5 flex-wrap items-center justify-center p-5">
        { 
            AIDoctorAgents && AIDoctorAgents.map((doctor , index)=>{
                return <div key={doctor.id}>
                    <DoctorAgentCard docterAgent={doctor}/>
                </div>
            })
        } 
        </div>
    </div>
  )
}

export default DocterAgentList