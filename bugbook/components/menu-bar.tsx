import Link from "next/link";
import { Button } from "./ui/button";
import { Bell, Bookmark, Home, Send } from "lucide-react";
import { NotificationsButton } from "./notifications-button";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";

interface MenuBarProps {
  className?: string;
}

export async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();
  if (!user) return null;

  const unreadCount = await db.notification.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  });

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home className="size-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      <NotificationsButton initialState={{ unreadCount }} />

      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark className="size-4" />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
}
