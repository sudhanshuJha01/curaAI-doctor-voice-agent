import Image from "next/image"

const SelectDoctorAgentCard= ({docterAgent }) => {
  return (
    <div className="border-2 border-black hover:border-blue-500">
      <Image src={docterAgent.image} alt={docterAgent.specialist} width={100} height={150}
      className="w-full h-[150px] object-cover"
      />
      <h2>{docterAgent.specialist}</h2>
      <p>{docterAgent.description}</p>
    </div>
  )
}

export default SelectDoctorAgentCard