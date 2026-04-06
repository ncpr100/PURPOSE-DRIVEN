import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { VisitorFollowUpsClient } from "./_components/visitor-followups-client";

export default async function VisitorFollowUpsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.churchId) redirect("/auth/signin");

  return (
    <VisitorFollowUpsClient
      userRole={session.user.role as string}
      churchId={session.user.churchId as string}
    />
  );
}
