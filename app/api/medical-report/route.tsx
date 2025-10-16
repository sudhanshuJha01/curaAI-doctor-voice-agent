import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/config/groqLLM";
import { db } from "@/config/db";
import { sessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";

const REPORT_GEN_PROMPT = `
You are an AI Medical Voice Agent that just finished a voice conversation with a user. Based on the transcript, generate a structured report with the following fields:

1. sessionId: a unique session identifier
2. agent: the medical specialist name (e.g., "General Physician AI")
3. user: name of the patient or "Anonymous" if not provided
4. timestamp: current date and time in ISO format
5. chiefComplaint: one-sentence summary of the main health concern
6. summary: a 2-3 sentence summary of the conversation, symptoms, and recommendations
7. symptoms: list of symptoms mentioned by the user
8. duration: how long the user has experienced the symptoms
9. severity: mild, moderate, or severe
10. medicationsMentioned: list of any medicines mentioned
11. recommendations: list of AI suggestions (e.g., rest, see a doctor)

Return the result in this JSON format:
{
  "sessionId": "string",
  "agent": "string",
  "user": "string",
  "timestamp": "ISO Date string",
  "chiefComplaint": "string",
  "summary": "string",
  "symptoms": ["symptom1", "symptom2"],
  "duration": "string",
  "severity": "string",
  "medicationsMentioned": ["med1", "med2"],
  "recommendations": ["rec1", "rec2"]
}

Only include valid fields. Respond with nothing else but valid JSON.
`;

export async function POST(req: NextRequest) {

  
  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not set.");
    return NextResponse.json(
      { error: "API key is missing." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { messages, sessionDetail, sessionId } = body;

    if (!messages || messages.length === 0) {
      console.error("❌ Validation failed: No messages");
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    if (!sessionDetail) {
      console.error("❌ Validation failed: No session detail");
      return NextResponse.json(
        { error: "Session detail (doctor info) is missing" },
        { status: 400 }
      );
    }

    if (!sessionId) {
      console.error("❌ Validation failed: No session ID");
      return NextResponse.json(
        { error: "Session ID is missing" },
        { status: 400 }
      );
    }
    

    const formattedConversation = messages
      .map((msg: any) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const user_prompt = `AI Doctor Agent Info: ${JSON.stringify(
      sessionDetail
    )}

Conversation transcript:
${formattedConversation}

Please generate a structured medical report based on this conversation.`;


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
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;

    if (!responseContent) {
      return NextResponse.json(
        { error: "LLM returned an empty response." },
        { status: 500 }
      );
    }


    const cleanedString = responseContent.replace(/```json\n?|```/g, "").trim();
    const jsonResponse = JSON.parse(cleanedString);

    if (!jsonResponse.sessionId) {
      jsonResponse.sessionId = sessionId;
    }


      await db
      .update(sessionChatTable)
      .set({
        report: jsonResponse,
        conversation: messages, 
      })
      .where(eq(sessionChatTable.sessionId, sessionId))
      .returning();


    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Error in medical-report API:", error);
    return NextResponse.json(
      {
        error: "Failed to generate report",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}