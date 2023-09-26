'use client';
import React from 'react'
import { useParams, useRouter } from 'next/navigation';

interface ChannelIdPageProps {}

const ChannelIdPage = ({}: ChannelIdPageProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <div>channel detail ChannelIdPages</div>
  )
}

export default ChannelIdPage