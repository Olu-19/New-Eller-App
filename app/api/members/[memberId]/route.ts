import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();

    const { searchParams } = new URL(request.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 } );
    }

    if (!serverId) {
      return new NextResponse("Server ID is missing", { status: 400 } );
    }

    if (!params.memberId) {
      return new NextResponse("Member ID is missing", { status: 400 } );
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id
      },
      data: {
        members: {
          deleteMany: {
            profileId: {
              not: profile.id
            }
          }
        }
      },
      include: {
        members: {
          include: {
            profile: true
          },
          orderBy: {
            role: "asc"
          }
        }
      }
    });

    return NextResponse.json(server);
    
  } catch (error: any) {
    console.log(`Failed to perform action DELETE_MEMBER: ${error.message}`);
    return new NextResponse("Internal error", { status: 500 } );
}
}

export async function PATCH(
    request: Request,
    { params }: { params: { memberId: string } }
) {
    try {
        const profile = await currentProfile();

        const { searchParams } = new URL(request.url);

        const { role } = await request.json();

        const serverId = searchParams.get("serverId");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 } );
        }

        if (!serverId) {
            return new NextResponse("Server ID is missing", { status: 400 } );
        }

        if (!params.memberId) {
            return new NextResponse("Member ID is missing", { status: 400 } );
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                },
            }
        });

        return NextResponse.json(server);


    } catch (error: any) {
        console.log(`Failed to perform action MODIFY_ROLE: ${error.message}`);
        return new NextResponse("Internal error", { status: 500 } );
    }
}