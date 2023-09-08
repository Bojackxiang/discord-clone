'use client';

import React from 'react'
import { useParams, useRouter } from 'next/navigation';
import { ActionTooltip } from '../ActionToolTop';
import { Plus } from 'lucide-react';


interface NavActionProps {}

const NavAction = ({}: NavActionProps) => {

  return (
    <div>
      <ActionTooltip
        side="right"
        align="center"
        label="Add a server"
      >
        <button
          onClick={() => {}}
          className="group flex items-center"
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Plus
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}

export default NavAction