import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Logo from "../_components/Logo"; 

export const Navbar = () => {
  const { user } = useUser();
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <Logo width={28} height={28} />

        <h1 className="text-base font-bold md:text-2xl">CureAI</h1>
      </div>
      {!user ? (
      <Link href={'/sign-in'}>
        <Button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
          Login
        </Button></Link>
      ) : (
        <div className="flex items-center gap-5">
          <UserButton />
           <Link href="/dashboard">
             <Button>Dashboard</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};