import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const user = await currentUser();
    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const userEmail = user.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
        return new NextResponse("User email not found", { status: 400 });
    }

    try {
        const existedUser = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, userEmail));
        
        if (existedUser.length === 0) {
            const newUser = await db
                .insert(usersTable)
                .values({
                    name: user.firstName ?? "", 
                    email: userEmail,
                    credit: 10,
                })
                .returning(); 

            return NextResponse.json(newUser[0]);
        }

        return NextResponse.json(existedUser[0]);

    } catch (error) {
        console.error("Error in POST /api/users:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}