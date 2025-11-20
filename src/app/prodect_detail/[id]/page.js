import Prodect_detail_component from "../../components/prodect_detail";

export default async function Prodect_detail ({params}) {
  const {id} = await params
    const res = await fetch(
        'http://192.168.1.192:8000/api/products/' + id ,
        {
          cache : "no-store",
          credentials : "include"
        }
    );
    const respons = await res.json();
    return <Prodect_detail_component data={respons}/>
  }