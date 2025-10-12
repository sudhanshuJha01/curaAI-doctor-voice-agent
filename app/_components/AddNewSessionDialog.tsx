"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import axios from "axios"
import { DoctorAgentType } from "./DocterAgentCard"
import { Loader2 } from "lucide-react"
import SelectDoctorAgentCard from './SelectDoctorAgentCard'
import { useRouter } from "next/navigation"

const AddNewSessionDialog = () => {
    const [note, setNote] = useState<string>(''); 
    const [loading, setLoading] = useState(false);
    const [suggestedDoctors, setSuggestedDoctors] = useState<DoctorAgentType[]>();
    const [selectedDoctor , setSelectedDoctor] = useState<DoctorAgentType>()

    const router = useRouter()
    const handleStartConsultation =async ()=>{
        setLoading(true)
        console.log("front note " , note)
        const result  = await axios.post('/api/session-chat',{
            note,
            selectedDoctor
        })

        console.log("result " , result.data)
        if(result.data.sessionId){
            console.log("result sessionId" , result.data.sessionId)
            router.push(`/dashboard/doctor-agent/${result.data.sessionId}`)
        }
        setLoading(false)
    }

    const handleDoctorListSuggestion = async () => {
        setLoading(true);
        try {
            const result = await axios.post('/api/suggest-doctors', {
                note
            });
            
            console.log("Data received from API:", result.data);

            setSuggestedDoctors(result.data.doctors);

        } catch (error) {
            console.error("Error fetching doctor suggestions:", error);
        }
        setLoading(false);
    };

    return (
        <Dialog>
            <DialogTrigger><Button>Consult with Doctor</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
            
                    <DialogTitle>{!suggestedDoctors ? 'Add Basic Detail' : 'Suggested Specialists'}</DialogTitle>
                    <DialogDescription asChild>
                        <div>
                    
                            {!suggestedDoctors ? (
                                <>
                                    <h2 className="mt-4 mb-2">Add Symptoms or any other detail</h2>
                                    <Textarea placeholder="e.g., 'I have a persistent cough and a headache...'" onChange={(e) => setNote(e.target.value)} />
                                </>
                            ) : (
                                <div className="mt-4">
                                    <p className="mb-2">Based on your notes, we suggest the following specialists:</p>
                                    <div className="list-disc pl-5 space-y-2">
                                        {suggestedDoctors.map((doctor) => (
                                            <div onClick={()=>setSelectedDoctor(doctor)}>
                                                <SelectDoctorAgentCard docterAgent={doctor} key={doctor.id}
                                            />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    {!suggestedDoctors ? (
                        <Button disabled={!note || loading} onClick={handleDoctorListSuggestion}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {loading ? 'Analyzing...' : 'Get Suggestions'}
                        </Button>
                    ) : (
                        <Button onClick={handleStartConsultation}>Start the Consultation</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default AddNewSessionDialog;