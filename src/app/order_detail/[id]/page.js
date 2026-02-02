import Order_detail_component from "../../components/order_detail";

export default async function Order_detail({ params }) {
  const { id } = await params;
  return <Order_detail_component id={id} />;
}
