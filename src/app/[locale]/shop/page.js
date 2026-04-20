import Shop_commponent from '../../components/shop.jsx';
import { URL } from '../../data/URL.js';

export default async function Shop() {
  const res = await fetch(`https://${URL}/api/products`, {
    cache: 'no-store',
    credentials: 'include',
  });
  if (!res.ok) {
    return <Shop_commponent data={[]} />;
  }
  const respons = await res.json();
  return <Shop_commponent data={Array.isArray(respons) ? respons : []} />;
}
