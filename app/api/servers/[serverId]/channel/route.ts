import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

const POSTPathAlias = "[POST]";

// get request

// post request
export async function POST(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const { serverId } = params;
    const profile = await currentProfile();
    const payload = await req.json();

    if (!profile) {
      return new Response("Unauthorized", { status: 401 });
    }

    const serverUnderProfileId = await db.profile.findUnique({
      where: {
        id: profile.id,
      },
      select: {
        servers: {
          where: {
            id: serverId,
          },
        },
      },
    });

    // only one server with profile id and server id should be found in this case
    if (
      !serverUnderProfileId ||
      !serverUnderProfileId.servers ||
      serverUnderProfileId.servers.length !== 1
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    // update the channel with the server id
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name: payload.name,
            type: payload.type,
          },
        },
      },
    });

    return NextResponse.json(server, { status: 201 });
  } catch (error) {
    console.error(POSTPathAlias, error);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const { serverId } = params;
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get("channelId");
    const payload = await req.json();

    // check serverId
    if (!serverId) {
      return new NextResponse("NOT AUTHENTICATED", { status: 401 });
    }

    // check serverId
    if (!profile) {
      return new NextResponse("NOT AUTHENTICATED", { status: 401 });
    }

    // check serverId
    if (!channelId) {
      return new NextResponse("Channel Id is required", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name: payload.name, 
              type: payload.type, 
            },
          },
        },
      },
    });

    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.error(POSTPathAlias, error);
  }
}
