import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/config/groqLLM";
import { AIDoctorAgents } from "@/shared/list";

export async function POST(req: NextRequest) {
    if (!process.env.GROQ_API_KEY) {
        console.error("GROQ_API_KEY is not set.");
        return new NextResponse("API key is missing.", { status: 500 });
    }

    try {
        const { note } = await req.json();

        if (!note) {
            return NextResponse.json({ error: "Note/Symptom is required." }, { status: 400 });
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an expert medical assistant. Given a list of available doctors and their specialties, your task is to recommend the most suitable ones based on a user's symptoms. The list of doctors is: ${JSON.stringify(AIDoctorAgents)}. You must only respond with a JSON object. Do not add any conversational text or markdown formatting.`,
                },
                {
                    role: "user",
                    content: `Based on my symptoms: "${note}", please suggest the best doctors from the provided list. Your response must be a JSON object containing a key "doctors" which is an array of doctor objects, ordered from most to least relevant and also add a key regionOfSelection in which give the region you selected this doctor for the given symptom. If the query is not related to medicine or health, respond with a JSON object containing a key "error" with a polite refusal message.`,
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

        return NextResponse.json(jsonResponse);


    } catch (error) {
        console.error("Error in /api/suggest-doctors:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return NextResponse.json({ error: "Failed to get suggestions.", details: errorMessage }, { status: 500 });
    }
}