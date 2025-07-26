import { MenuBar } from "@/components/menu-bar";
import { Navbar } from "@/components/navbar";
import { SessionProvider } from "@/components/providers/session-provider";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await validateRequest();
  if (!session.user) redirect("/sign-in");

  return (
    <SessionProvider value={session}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-7xl p-5 flex w-full grow gap-5">
          <MenuBar className="sticky top-[5.25rem] h-fit hidden sm:block flex-none space-y-3 rounded-2xl bg-card px-3 py-5 lg:px-5 shadow-sm xl:w-60" />
          {children}
        </div>
        <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
      </div>
    </SessionProvider>
  );
}
