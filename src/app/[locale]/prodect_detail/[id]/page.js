import Prodect_detail_component from '../../../components/prodect_detail.jsx';
import { URL } from '../../../data/URL.js';

export default async function Prodect_detail({ params }) {
  const { id } = await params;
  const res = await fetch(`https://${URL}/api/products/` + id, {
    cache: 'no-store',
    credentials: 'include',
  });
  const respons = await res.json();
  return <Prodect_detail_component data={respons} />;
}
