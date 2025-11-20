import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  console.log(body)
  const djangoRes = await fetch("http://192.168.1.192:8000/api/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials : 'include'
  });

  const data = await djangoRes.json();
  console.log(data.access)
  const res = NextResponse.json({ msg: "ok" });

  // ضع الكوكي HttpOnly من الـ JSON مباشرة
  res.cookies.set("access", data.access, {
    httpOnly: true,
    secure: false,   // true فقط في HTTPS
    path: "/",
    sameSite: "Lax",
  });

  res.cookies.set("refresh", data.refresh, {
    httpOnly: true,
    secure: false,
    path: "/",
    sameSite: "Lax",
  });

  return res;
}