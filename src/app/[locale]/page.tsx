import Home_component from '../components/home';
import { URL } from '../data/URL.js';

export default async function Home() {
  const res = await fetch(`http://${URL}/api/products`, {
    cache: 'no-store',
    credentials: 'include',
  });
  if (!res.ok) {
    return <Home_component data={[]} />;
  }
  const respons = await res.json();
  return <Home_component data={Array.isArray(respons) ? respons : []} />;
}
