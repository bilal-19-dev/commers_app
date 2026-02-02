"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Account } from "../data/FETCH.js";
export default function Order_component() {
  const [info, setinfo] = useState({});
  const [loding, setloding] = useState(true);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await Account();
        setinfo(orders.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setloding(false);
      }
    };
    fetchOrders();
  }, []);
  return (
    <main>
      <div className="Order_contener">
        <table className="hader">
          <thead>
            <tr>
              <th>Prodect</th>
              <th>Date</th>
              <th>ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Quantity</th>
            </tr>
          </thead>
        </table>
        {loding ? (
          <div className="loading_contener">
            <div className="loader"></div>
          </div>
        ) : (
          <table className="body">
            <tbody style={{ backgroundColor: "white" }}>
              {info && info.length > 0 ? (
                info.map((order, i) => (
                  <Link href={"/order_detail/" + order.id}>
                    <tr key={i} className="clickable-row">
                      <td className="img">
                        {(() => {
                          const images = [];
                          for (const item of order.items) {
                            if (images.length === 3) break;
                            if (!images.includes(item.product.primary_image)) {
                              images.push(item.product.primary_image);
                            }
                          }
                          return images.map((img, i) => (
                            <img
                              key={i}
                              className={"img" + i}
                              src={img}
                              alt="Product Image"
                            />
                          ));
                        })()}
                      </td>
                      <td>{order.order_date.substring(0, 10)}</td>
                      <td>{order.id}</td>
                      <td>{order.total_price}</td>
                      <td>{order.status}</td>
                      <td>{order.items_count}</td>
                    </tr>
                  </Link>
                ))
              ) : (
                <div className="no_data">No Orders Yet</div>
              )}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
