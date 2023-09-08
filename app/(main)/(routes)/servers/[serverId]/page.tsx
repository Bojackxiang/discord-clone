'use client';
import React from 'react'
import { useParams, useRouter } from 'next/navigation';

interface ServerProps {}

const Server = ({}: ServerProps) => {
  const {params} = useParams();
  console.log('params: ', params);
  const router = useRouter();

  return (
    <div>server id</div>
  )
}

export default Server