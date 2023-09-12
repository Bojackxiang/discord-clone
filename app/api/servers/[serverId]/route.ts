import { NextResponse } from "next/server";

// PATCH request
export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    console.log({params})

    return NextResponse.json({});
  } catch (error: any) {
    console.error("api/server/{serverId} ::", error.message);
    return new NextResponse(error.message, { status: 500 });
  }
}