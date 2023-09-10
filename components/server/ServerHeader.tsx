'use client';
import React from 'react'
import { useParams, useRouter } from 'next/navigation';

interface ServerHeaderProps {}

export const ServerHeader = ({}: ServerHeaderProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <div>ServerHeader</div>
  )
}

