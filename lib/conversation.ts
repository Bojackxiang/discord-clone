import { debug } from "console";
import { db } from "./db";

export const findConversation = async (
  userOneId: string,
  userTwoId: string
) => {
  try {
    const conversation = await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId: userOneId }, { memberTwoId: userTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
    debug("::findConversation::conversation found");
    return conversation;
  } catch (error: any) {
    console.error("::findConversation::", error.message);
    return null;
  }
};

export const createConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    const conversation = await db.conversation.create({
      data: {
        memberOneId: memberOneId,
        memberTwoId: memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
    debug("::createConversation::conversation created");
    return conversation;
  } catch (error: any) {
    console.error("::createConversation::", error.message);
    return null;
  }
};

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    let conversation =
      (await findConversation(memberOneId, memberTwoId)) ||
      (await findConversation(memberTwoId, memberOneId));

    if (!conversation) {
      conversation = await createConversation(memberOneId, memberTwoId);
    }

    return conversation;
  } catch (error: any) {
    console.error("::getOrCreateConversation::", error.message);
    return null;
  }
};
