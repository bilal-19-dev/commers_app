import Profile_component from "../components/profile";
import { cookies } from 'next/headers';


export default async function Profile () {
  const cookieStore = await cookies();
  // قراءة الكوكي HttpOnly مباشرة من request.cookies
  const access = cookieStore.get("access")?.value;
  const refresh = cookieStore.get("refresh")?.value;
  let respons = access
  respons = respons.split(".")[1];
  respons = atob(respons);
  respons = respons.replace(/'/g, '"'); 
  respons = JSON.parse(respons);
  return <Profile_component data={respons}/>
}