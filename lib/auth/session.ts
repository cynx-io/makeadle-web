// lib/auth/session.ts
import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string, // 32+ chars required
  cookieName: "token",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export type SessionData = {
  user?: {
    id: number;
    username: string;
  };
};

export async function getSession() {
  const cookieStore = await cookies();
  return await getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function setSession(sessionData: SessionData) {
  const session = await getSession();
  session.user = sessionData.user;
  await session.save();
}
