import { ModeToggle } from "@/components/theme-toggle-btn"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { UserButton } from "@clerk/nextjs"



export default function RootPage() {
  return (
    <main>
      Welcome to the discord, please sign in or sign up
      <UserButton afterSignOutUrl="/"/>
      <ModeToggle/>
    </main>
  )
}
