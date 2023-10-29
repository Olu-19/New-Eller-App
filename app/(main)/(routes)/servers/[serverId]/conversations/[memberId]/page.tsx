import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { getOrCreateConversation } from "@/lib/conversation";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import { MediaRoom } from "@/components/media-room";

interface MemberIdPageProps {
  params: {
    serverId: string;
    memberId: string;
    channelId: string;
  };
  searchParams: {
    video?: boolean;
    audio?: boolean;
  }
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const othermember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-[100vh]">
      <ChatHeader
        channel={channel!}
        serverId={params.serverId}
        name={othermember.profile.name}
        type="conversation"
        imgUrl={othermember.profile.imgUrl}
      />
      {searchParams.video && (
        <MediaRoom
          chatId={conversation.id}
          video={true}
          audio={true}
        />
      )}
      {searchParams.audio && (
        <MediaRoom
          chatId={conversation.id}
          video={false}
          audio={true}
        />
      )}
      {!searchParams.video && !searchParams.audio && (
        <>
          <ChatMessage
            type="conversation"
            chatId={conversation.id}
            member={currentMember}
            name={othermember.profile.name}
            apiUrl="/api/direct-messages"
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
            paramKey="conversationId"
            paramValue={conversation.id}
          />
          <ChatInput
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
            type="conversation"
            name={othermember.profile.name}
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
