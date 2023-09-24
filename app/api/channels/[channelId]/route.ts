import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

// const GETPathAlias = "[GET]";
// const POSTPathAlias = "[POST]";
// const patchPathAlias = "[PATCH]";
const DELETEPathAlias = "[DELETE]";

// // get request
// export async function GET(
//   req: Request,
//   { params }: { params: { paramName: string } }
// ) {
//   try {
//     const { userId } = auth();

//     if(!userId) {
//       return new NextResponse("UnAuthenticated", { status: 401 });
//     }

//     return NextResponse.json({});
//   } catch (error) {
//     console.error(GETPathAlias, error);
//   }
// }

// // post request
// export async function POST(
//   req: Request,
//   { params }: { params: { paramName: string } }
// ) {
//   try {
//     const { userId } = auth();
//     const body = await req.json()
//     const {} = body

//     if(!userId) {
//       return new NextResponse("UnAuthenticated", { status: 401 });
//     }

//     return NextResponse.json({});
//   } catch (error) {
//     console.error(POSTPathAlias, error);
//   }
// }

// // update request
// export async function PATCH(
//   req: Request,
//   { params }: { params: { paramName: string } }
// ) {
//   try {
//     const { userId } = auth();

//     if(!userId) {
//       return new NextResponse("UnAuthenticated", { status: 401 });
//     }
//     return NextResponse.json({});
//   } catch (error) {
//     console.error(patchPathAlias, error);
//   }
// }

/**
 * DELETE STORE
 */
export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("UnAuthenticated", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const { channelId } = params;
    const serverId = searchParams.get("serverId");

    if (!serverId || !channelId) {
      return new NextResponse("Server Id or Channel Id is missing ", {
        status: 401,
      });
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
          delete: {
            id: channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error(DELETEPathAlias, error);
  }
}
