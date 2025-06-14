// app/api/login/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { userClient } from "@/lib/janus/hermes";

export const runtime = "nodejs";
export async function POST(req: Request) {
  const session = await getSession();
  const body = await req.json();

  const resp = await userClient
    .validatePassword({
      username: body.username,
      password: body.password,
    })
    .catch((error) => {
      console.error("Login error:", error);
    });

  if (resp === undefined || resp === null) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const user = resp.user;

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  session.user = {
    id: user.id,
    username: user.username,
  };

  await session.save();

  return NextResponse.json({ ok: true });
}
