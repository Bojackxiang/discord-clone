import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

export const useChatSocket = (props: ChatSocketProps) => {
  const { addKey, updateKey, queryKey } = props;

  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: any) => {
              if (item.id === message.id) {
                return message;
              }

              return item;
            }),
          };
        });

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        // check if valid old data
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        queryClient.setQueryData([queryKey], (oldData: any) => {
          const newData = oldData.pages.map((page: any) => {
            return {
              ...page,
              items: [message, ...page.items],
            };
          });

          return {
            ...oldData,
            pages: newData,
          };
        });
      });
    });

    socket.on(queryKey, (message: MessageWithMemberWithProfile) => {
      console.log("Listening in query key", message);
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
      socket.off(queryKey);
    };
  }, [socket, addKey, updateKey, queryKey]);
};
