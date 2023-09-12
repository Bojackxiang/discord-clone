import { v4 as uuidV4} from 'uuid'
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { db } from '@/lib/db';

// PATCH request
export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const {serverId} = params;
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if(!params.serverId){
      return new NextResponse('No server Id', { status: 401 });
    }

    const updateResult = await db.server.update({
      where: {
        id: serverId, 
        profileId: profile.id
      },
      data: {
        inviteCode: uuidV4()
      }
    })

    return NextResponse.json(updateResult);
  } catch (error: any) {
    console.error("api/server/{serverId} ::", error.message);
    return new NextResponse(error.message, { status: 500 });
  }
}
