import Home_component from "./components/home";
import { URL } from "./data/URL.js";

export default async function Home() {
  const res = await fetch(`http://${URL}:8000/api/products`, {
    cache: "no-store",
    credentials: "include",
  });
  const respons = await res.json();
  return <Home_component data={respons} />;
}
