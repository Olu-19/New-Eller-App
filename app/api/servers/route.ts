import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "prisma/prisma-client";

export async function POST(
    request: Request
) {
    try {
        const { name, imgUrl } = await request.json();

        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 } );
        }

        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name,
                imgUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        { name: "general", profileId: profile.id }
                    ]
                },
                members: {
                    create: [
                        { profileId: profile.id, role: MemberRole.ADMIN }
                    ]
                }
            }
        });

        return NextResponse.json(server);
    } catch (error: any) {
        console.log(`SERVER_CREATION_ERROR: ${error.message}`);
        return new NextResponse("Internal error", { status: 500 } );
    }
}