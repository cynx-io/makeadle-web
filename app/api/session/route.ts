// // app/api/session/route.ts
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";
//
// export async function POST(req: Request) {
//     const { user } = await req.json();
//
//     cookies().set({
//         name: "janus_token",
//         value: JSON.stringify(user),
//         httpOnly: true,
//         path: "/",
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "lax",
//         maxAge: 60 * 60 * 24, // 1 day
//     });
//
//     return NextResponse.json({ success: true });
// }
