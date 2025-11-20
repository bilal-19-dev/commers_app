import Profile_component from "../components/profile";
import { cookies } from 'next/headers';


export default async function Profile () {
  // frome here
  let paylod = {
    username : "Anonimo" ,
    password : "@A.123456"
  }
  const cookieStore = await cookies();
  const res = await fetch('http://192.168.1.192:3000//api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paylod),
    cache: "no-store"
  });

  // الرد من Route Handler (يمكن أن يحتوي بيانات أخرى إذا أردت)
  const responseData = await res.json();

  console.log("Response from /api/auth:", responseData);
  // to here

  // قراءة الكوكي HttpOnly مباشرة من request.cookies
  const access = cookieStore.get("access")?.value;
  const refresh = cookieStore.get("refresh")?.value;

  console.log("Access Token (from cookie):", access);
  console.log("Refresh Token (from cookie):", refresh);
  // let respons = access
  // respons = respons.split(".")[1];
  // respons = atob(respons);
  // respons = respons.replace(/'/g, '"'); 
  // respons = JSON.parse(respons);
  // return <Profile_component data={respons}/>
}