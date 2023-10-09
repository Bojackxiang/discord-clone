import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

const GETPathAlias = "[GET]";
const POSTPathAlias = "[POST]";
const patchPathAlias = "[PATCH]";
const DELETEPathAlias = "[DELETE]";

const MESSAGE_BATCH = 10;

// get request
export async function GET(
  req: Request,
  { params }: { params: { paramName: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("No Profile", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("No Profile", { status: 400 });
    }

    if (!channelId) {
      return new NextResponse("No channelId", { status: 400 });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGE_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;
    if (messages.length === MESSAGE_BATCH) {
      nextCursor = messages[MESSAGE_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.error(GETPathAlias, error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// post request
export async function POST(
  req: Request,
  { params }: { params: { paramName: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const {} = body;

    if (!userId) {
      return new NextResponse("UnAuthenticated", { status: 401 });
    }

    return NextResponse.json({});
  } catch (error) {
    console.error(POSTPathAlias, error);
  }
}

// update request
export async function PATCH(
  req: Request,
  { params }: { params: { paramName: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("UnAuthenticated", { status: 401 });
    }
    return NextResponse.json({});
  } catch (error) {
    console.error(patchPathAlias, error);
  }
}

/**
 * DELETE STORE
 */
export async function DELETE(
  req: Request,
  { params }: { params: { storeid: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("UnAuthenticated", { status: 401 });
    }

    return NextResponse.json({});
  } catch (error) {
    console.error(DELETEPathAlias, error);
  }
}
