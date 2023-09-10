'use client';
import React from 'react'
import { useParams, useRouter } from 'next/navigation';

interface ServerChannelProps {}

export const ServerChannel = ({}: ServerChannelProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <div>ServerChannel</div>
  )
}

