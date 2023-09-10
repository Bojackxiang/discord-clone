'use client';
import React from 'react'
import { useParams, useRouter } from 'next/navigation';

interface ServerSearchProps {}

export const ServerSearch = ({}: ServerSearchProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <div>ServerSearch</div>
  )
}

