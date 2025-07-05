import { Metadata } from "next";
import signInImage from "@/public/sign-in.jpg";
import Image from "next/image";
import Link from "next/link";
import { SignIn } from "@/components/forms/sign-in";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInRoute() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] rounded-2xl overflow-hidden bg-card shadow-2xl">
        <div className="md:w-1/2 w-full space-y-8 overflow-y-auto p-10">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">
              Sign in to <span className="text-primary">BugBook</span>
            </h1>
            <p className="text-muted-foreground">
              A place where even <i>you</i> can find a friend.
            </p>
          </div>

          <div className="space-y-5">
            <SignIn />

            <Link
              href="/sign-up"
              className="block text-center hover:underline text-sm"
            >
              Don't have an account yet?
            </Link>
          </div>
        </div>
        <Image
          src={signInImage}
          alt=""
          className="w-1/2 hidden md:block object-cover"
        />
      </div>
    </main>
  );
}
