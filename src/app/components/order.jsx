'use client';
import Link from "next/link"

export default function Order_component () {
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
                <table className="body">
                    <tbody style={{backgroundColor : "white"}}>
                        <Link href="/order_detail">
                            <tr>
                                <td className="img">
                                    <img className="img1" src="/ph.jpg" alt="Product Image" />
                                    <img className="img2" src="/ph.jpg" alt="Product Image" />
                                    <img className="img3" src="/ph.jpg" alt="Product Image" />
                                </td>
                                <td>Smith</td>
                                <td>50</td>
                                <td>Jill</td>
                                <td>Smith</td>
                                <td>50</td>
                            </tr>
                        </Link>
                        <Link href="/order_detail">
                            <tr>
                                <td className="img">
                                    <img className="img1" src="/ph.jpg" alt="Product Image" />
                                    <img className="img2" src="/ph.jpg" alt="Product Image" />
                                    <img className="img3" src="/ph.jpg" alt="Product Image" />
                                </td>
                                <td>Smith</td>
                                <td>50</td>
                                <td>Jill</td>
                                <td>Smith</td>
                                <td>50</td>
                            </tr>
                        </Link>
                        <Link href="/order_detail">
                            <tr>
                                <td className="img">
                                    <img className="img1" src="/ph.jpg" alt="Product Image" />
                                    <img className="img2" src="/ph.jpg" alt="Product Image" />
                                    <img className="img3" src="/ph.jpg" alt="Product Image" />
                                </td>
                                <td>Smith</td>
                                <td>50</td>
                                <td>Jill</td>
                                <td>Smith</td>
                                <td>50</td>
                            </tr>
                        </Link>
                        <Link href="/order_detail">
                            <tr>
                                <td className="img">
                                    <img className="img1" src="/ph.jpg" alt="Product Image" />
                                    <img className="img2" src="/ph.jpg" alt="Product Image" />
                                    <img className="img3" src="/ph.jpg" alt="Product Image" />
                                </td>
                                <td>Smith</td>
                                <td>50</td>
                                <td>Jill</td>
                                <td>Smith</td>
                                <td>50</td>
                            </tr>
                        </Link>
                        <Link href="/order_detail">
                            <tr>
                                <td className="img">
                                    <img className="img1" src="/ph.jpg" alt="Product Image" />
                                    <img className="img2" src="/ph.jpg" alt="Product Image" />
                                    <img className="img3" src="/ph.jpg" alt="Product Image" />
                                </td>
                                <td>Smith</td>
                                <td>50</td>
                                <td>Jill</td>
                                <td>Smith</td>
                                <td>50</td>
                            </tr>
                        </Link>
                        <Link href="/order_detail">
                            <tr>
                                <td className="img">
                                    <img className="img1" src="/ph.jpg" alt="Product Image" />
                                    <img className="img2" src="/ph.jpg" alt="Product Image" />
                                    <img className="img3" src="/ph.jpg" alt="Product Image" />
                                </td>
                                <td>Smith</td>
                                <td>50</td>
                                <td>Jill</td>
                                <td>Smith</td>
                                <td>50</td>
                            </tr>
                        </Link>
                        <Link href="/order_detail">
                            <tr>
                                <td className="img">
                                    <img className="img1" src="/ph.jpg" alt="Product Image" />
                                    <img className="img2" src="/ph.jpg" alt="Product Image" />
                                    <img className="img3" src="/ph.jpg" alt="Product Image" />
                                </td>
                                <td>Smith</td>
                                <td>50</td>
                                <td>Jill</td>
                                <td>Smith</td>
                                <td>50</td>
                            </tr>
                        </Link>
                    </tbody>
                </table>
                
            </div> 
        </main>
    )
} 