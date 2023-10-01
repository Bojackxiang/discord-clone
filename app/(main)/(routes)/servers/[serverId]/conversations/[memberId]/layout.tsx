import ChatHeader from '@/components/chat/ChatHeader'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'

const ConversationPageLayout = async ({
  children,
  params
}: {
  children: React.ReactNode,
  params: {
    serverId: string,
    memberId: string
  }
}) => {

  const currentMember = await db.member.findUnique({
    where: {
      id: params.memberId,
    },
    include: {
      profile: true,
    },
  });

  if(!currentMember){
    return redirect('/')
  }

  return (
    <div className='h-full dark:bg-[#31338]'>
      <ChatHeader
        serverId={params.serverId}
        name={currentMember.profile.name}
        type="conversation"
        imageUrl={currentMember.profile.imageUrl}
      />
      {children}
    </div>
  )
}

export default ConversationPageLayout
