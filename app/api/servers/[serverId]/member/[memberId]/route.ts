import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { memberId: string; serverId: string } }
) {
  try {
    const { serverId, memberId } = params;
    const profile = await currentProfile();
    const { role } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id, // Only the owner can change the role
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                // 这边说的是，update 的时候，这个 profileId 不能是当前的 profileId
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[MEMBERS_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string; serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const { serverId, memberId } = params;

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id, // Only the owner can change the role
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profileId: {
              // 这边说的是，delete 的时候，这个 profileId 不能是当前的 profileId
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    // return err
    console.error("[MEMBERS_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
