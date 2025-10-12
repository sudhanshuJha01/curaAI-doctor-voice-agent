import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { sessionChatTable } from "@/config/schema";
import { v4 as uuidv4 } from 'uuid';
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req:NextRequest){
    //@ts-ignore
    const {note , selectedDoctor} = await req.json()
    console.log("note" , note)
    try {
        const user = await currentUser()
        const sessionId=uuidv4();
        const result = await db.insert(sessionChatTable).values({
            sessionId:sessionId,
            createdBy:user?.primaryEmailAddress?.emailAddress,
            notes:note,
            selectedDoctor:selectedDoctor,
            createdOn:(new Date).toString() 
        }).returning()
        return NextResponse.json(result)
    } catch (error) {
            return NextResponse.json(error)
    }
}