import { Button } from "@/components/ui/button"
import Image from "next/image"

export type DoctorAgentType = {
        id: number,
        specialist: string,
        description: string,
        image: string,
        agentPrompt: string,
        voiceId: string,
        subscriptionRequired: boolean
}

type DoctorPropType = {
    docterAgent:DoctorAgentType
}

const DoctorAgentCard = ({docterAgent}:DoctorPropType) => {
  return (
    <div>
      <Image src={docterAgent.image} alt={docterAgent.specialist} width={200} height={300}
      className="w-full h-[250px] object-cover"
      />
      <h2>{docterAgent.specialist}</h2>
      <p>{docterAgent.description}</p>
      <Button>start  Consult</Button>
    </div>
  )
}

export default DoctorAgentCard