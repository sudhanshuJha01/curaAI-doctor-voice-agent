import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/config/groqLLM";
import { db } from "@/config/db";
import { sessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm"; 

const REPORT_GEN_PROMPT=`
    You are an Al Medical Voice Agent that just finished a voice conversation with a user. Based on the transcript, generate a structured report with the following fields:
1. sessionld: a unique session identifier
2. agent: the medical specialist name (e.g., "General Physician Al")
3. user: name of the patient or "Anonymous" if not provided
4. timestamp: current date and time in ISO format
5. chiefComplaint: one-sentence summary of the main health concern
6. summary: a 2-3 sentence summary of the conversation, symptoms, and recommendations
7. symptoms: list of symptoms mentioned by the user
8. duration: how long the user has experienced the symptoms
9. severity: mild, moderate, or severe
10. medicationsMentioned: list of any medicines mentioned
11. recommendations: list of Al suggestions (e.g., rest, see a doctor)
Return the result in this JSON format:

"sessionld": "string",
"agent": "string",
"user": "string"
"timestamp": "ISO Date string",
"chiefComplaint": "string",
"summary": "string",
"symptoms": ["symptom1", "symptom2"],
"duration": "string",
"severity": "string",
"medicationsMentioned": ["med1", "med2"],
"recommendations": ["rec1", "rec2"],

Only include valid fields. Respond with nothing else.
`

export async function POST(req:NextResponse){
if (!process.env.GROQ_API_KEY) {
        console.error("GROQ_API_KEY is not set.");
        return new NextResponse("API key is missing.", { status: 500 });
    }

    try {
        const {         messages,
        sessionDetail,
        sessionId} = await req.json();

        const user_prompt = `AI Doctor Agent Info : ${JSON.stringify(sessionDetail)} , conversation : ${messages} `
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: REPORT_GEN_PROMPT,
                },
                {
                    role: "user",
                    content: user_prompt,
                },
            ],
            model: "openai/gpt-oss-20b",
            temperature: 0.2, 
            response_format: { type: "json_object" },
        });

        const responseContent = chatCompletion.choices[0]?.message?.content;

        if (!responseContent) {
            return NextResponse.json({ error: "LLM returned an empty response." }, { status: 500 });
        }

        const cleanedString = responseContent.replace(/```json\n?|```/g, "").trim();

        const jsonResponse = JSON.parse(cleanedString);

        await db.update(sessionChatTable).set({
            report:jsonResponse
        }).where(eq(sessionChatTable.sessionId ,sessionId ))

        return NextResponse.json(jsonResponse);
    
    }
        catch(error){
                return NextResponse.json(error)
        }
}