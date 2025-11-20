import Home_component from "./components/home";

export default async function Home() {
  const paylod = {
    username : "Anonimo" ,
    password: "@A.123456"
  };
  await fetch('http://192.168.1.192:3000/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paylod),
    cache: "no-store"
  });
  const res = await fetch(
    'http://192.168.1.192:8000/api/products' ,
    {
      cache : "no-store",
      credentials : "include"
    }
  );
  const respons = await res.json();
  return <Home_component data={respons} />;
}
