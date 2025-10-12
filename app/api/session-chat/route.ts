import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { sessionChatTable } from "@/config/schema";
import { v4 as uuidv4 } from 'uuid';
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm"; 


export async function POST(req: NextRequest) {
    try {
        const { note, selectedDoctor } = await req.json();
        const user = await currentUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const sessionId = uuidv4();
        const result = await db.insert(sessionChatTable).values({
            sessionId: sessionId,
            createdBy: user.primaryEmailAddress?.emailAddress,
            notes: note,
            selectedDoctor: selectedDoctor,
            createdOn: new Date().toISOString() 
        }).returning();
        
        return NextResponse.json(result[0]); 
    } catch (error) {
        console.error("Error in POST /api/session-chat:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


export async function GET(req: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
        }

        const result = await db.select()
            .from(sessionChatTable)
            .where(eq(sessionChatTable.sessionId, sessionId));

        if (result.length === 0) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        return NextResponse.json(result[0]);

    } catch (error) {

        console.error("Error in GET /api/session-chat:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
