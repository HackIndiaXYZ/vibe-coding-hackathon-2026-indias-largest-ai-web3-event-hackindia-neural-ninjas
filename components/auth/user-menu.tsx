"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

interface UserMenuProps {
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
}

export function UserMenu({ name, email, avatarUrl }: UserMenuProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : email?.[0]?.toUpperCase() ?? "U";

  async function handleSignOut() {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          id="user-menu-trigger"
          className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-accent border border-transparent hover:border-border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={avatarUrl ?? undefined} alt={name ?? "User"} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-sm font-semibold text-foreground line-clamp-1 max-w-[140px]">
              {name ?? "User"}
            </span>
            <span className="text-xs text-muted-foreground line-clamp-1 max-w-[140px]">
              {email}
            </span>
          </div>
          <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-foreground">{name ?? "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          id="menu-profile"
          className="cursor-pointer gap-2"
          onClick={() => router.push("/dashboard/profile")}
        >
          <User className="h-4 w-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          id="menu-settings"
          className="cursor-pointer gap-2"
          onClick={() => router.push("/dashboard/settings")}
        >
          <Settings className="h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          id="menu-logout"
          className="cursor-pointer gap-2 text-destructive focus:text-destructive"
          onClick={handleSignOut}
          disabled={loading}
        >
          <LogOut className="h-4 w-4" />
          {loading ? "Signing out…" : "Sign Out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserMenuSkeleton() {
  return (
    <div className="flex items-center gap-2.5 px-2.5 py-1.5">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="hidden sm:flex flex-col gap-1.5">
        <Skeleton className="h-3 w-28 rounded" />
        <Skeleton className="h-2.5 w-36 rounded" />
      </div>
    </div>
  );
}
