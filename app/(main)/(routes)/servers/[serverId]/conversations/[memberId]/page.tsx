'use client';
import React from 'react'
import { useParams, useRouter } from 'next/navigation';

interface MemberIdPageProps {}

const MemberIdPage = ({}: MemberIdPageProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <div>MemberPage</div>
  )
}

export default MemberIdPage