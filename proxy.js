import { NextResponse } from "next/server";

export function proxy(req) {
  const user = 'user'
  console.log(user)
  const url = req.nextUrl.clone();
  if (url.pathname === '/orders' && user !== 'user'){
    url.pathname = '/profile'
    return NextResponse.redirect(url)
  }
  if (url.pathname === '/profile' && user !== 'admin'){
    url.pathname = '/orders'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
};
export const config = {
  matcher: ['/orders' , '/profile']
}