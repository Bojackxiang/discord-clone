import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

import { currentProfile } from "@/lib/current-profile";
import { MemberRole } from "@prisma/client";

// post request
export async function POST(
  req: Request,
  { params }: { params: { paramName: string } }
) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("UnAuthenticated", { status: 401 });
    }

    const createdServer = await db.server.create({
      data: {
        name,
        imageUrl,
        profileId: profile.id,
        inviteCode: uuid(),
        channels: {
          create: [
            {name: 'general', profileId: profile.id}
          ]
        },
        members: {
          create: [
            {profileId: profile.id, role: MemberRole.ADMIN}
          ]
        }
      }
    });

    NextResponse.json({...createdServer});
    return NextResponse.json({});
  } catch (error: any) {
    console.error("api/server::", error.message);
    return new NextResponse(error.message, { status: 500 });
  }
}
