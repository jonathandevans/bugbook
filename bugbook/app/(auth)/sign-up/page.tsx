import { Metadata } from "next";
import signUpImage from "@/public/sign-up.jpg";
import Image from "next/image";
import Link from "next/link";
import { SignUp } from "@/components/auth/sign-up";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignUpRoute() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] rounded-2xl overflow-hidden bg-card shadow-2xl">
        <div className="md:w-1/2 w-full space-y-8 overflow-y-auto p-10">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">
              Sign up to <span className="text-primary">BugBook</span>
            </h1>
            <p className="text-muted-foreground">
              A place where even <i>you</i> can find a friend.
            </p>
          </div>

          <div className="space-y-5">
            <SignUp />

            <Link
              href="/sign-in"
              className="block text-center hover:underline text-sm"
            >
              Already have an account?
            </Link>
          </div>
        </div>
        <Image
          src={signUpImage}
          alt=""
          className="w-1/2 hidden md:block object-cover"
        />
      </div>
    </main>
  );
}
