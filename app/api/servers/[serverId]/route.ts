import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// PATCH request
export async function PUT(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if(!profile){
      return new NextResponse("401 Unauthenticated", {status: 401})
    }

    const payload = await req.json();
    const {serverId} = params

    const updateResult = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id
      },
      data: {
          name: payload.name,
          imageUrl: payload.imageUrl
      }
    })

    return NextResponse.json({updateResult});
  } catch (error: any) {
    console.error("api/server/{serverId} ::", error.message);
    return new NextResponse(error.message, { status: 500 });
  }
}