"use client"
import Link from "next/link"
import { useState , useEffect  } from "react"
import {Account} from '../data/FETCH.js'
export default function Order_detail_component ({id}){
    const [info , setinfo] = useState({})
    const [loding , setloding] = useState(true)
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const orders = await Account();
                setinfo(orders.orders.find(order => order.id == id));
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
            <div className="Order_detail_contener">
                <table className="hader">
                    <thead>
                        <tr>
                            <th>Prodect</th>
                            <th>Name</th> 
                            <th>Price</th>
                            <th>Color</th>
                            <th>Size</th> 
                            <th>Quantity</th>
                        </tr>
                    </thead>
                </table>
                {loding ? <div className='loading_contener'><div className="loader"></div></div> : (
                    <>
                        <table className="body">
                            <tbody style={{backgroundColor : "white"}}>
                                {info.items.map((item , i) => (
                                        <tr key={i}>
                                            <td className="img">
                                                <img className="img1" src={item.product.primary_image} alt="Product Image" />
                                            </td>
                                            <td>{item.product.name}</td>
                                            <td>{item.product.price}</td>
                                            <td>{item.product.color ? item.color : "/"}</td>
                                            <td>{item.product.size ? item.size : "/"}</td>
                                            <td>{item.quantity}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <table className="fotter">
                            <tfoot>
                                <tr>
                                    <td>Prodect Quantity : {info.items_count}</td>
                                    <td>Total Price : {info.total_price} DA</td>
                                    <td className="btn"><button>Order Again</button></td>
                                </tr>
                            </tfoot>
                        </table>
                    </>
                )}
            </div>
        </main>
    )
}