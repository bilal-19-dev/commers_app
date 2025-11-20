"use Clint"
import Link from "next/link"

export default function Order_detail_component (){
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
                <table className="body">
                    <tbody style={{backgroundColor : "white"}}>
                        
                        <tr>
                            <td className="img">
                                <img className="img1" src="/ph.jpg" alt="Product Image" />
                            </td>
                            <td>Smith</td>
                            <td>50</td>
                            <td>Jill</td>
                            <td>Smith</td>
                            <td>50</td>
                        </tr>
                        <tr>
                            <td className="img">
                                <img className="img1" src="/ph.jpg" alt="Product Image" />
                            </td>
                            <td>Smith</td>
                            <td>50</td>
                            <td>Jill</td>
                            <td>Smith</td>
                            <td>50</td>
                        </tr>
                        <tr>
                            <td className="img">
                                <img className="img1" src="/ph.jpg" alt="Product Image" />
                            </td>
                            <td>Smith</td>
                            <td>50</td>
                            <td>Jill</td>
                            <td>Smith</td>
                            <td>50</td>
                        </tr>
                        <tr>
                            <td className="img">
                                <img className="img1" src="/ph.jpg" alt="Product Image" />
                            </td>
                            <td>Smith</td>
                            <td>50</td>
                            <td>Jill</td>
                            <td>Smith</td>
                            <td>50</td>
                        </tr>
                        <tr>
                            <td className="img">
                                <img className="img1" src="/ph.jpg" alt="Product Image" />
                            </td>
                            <td>Smith</td>
                            <td>50</td>
                            <td>Jill</td>
                            <td>Smith</td>
                            <td>50</td>
                        </tr>
                        <tr>
                            <td className="img">
                                <img className="img1" src="/ph.jpg" alt="Product Image" />
                            </td>
                            <td>Smith</td>
                            <td>50</td>
                            <td>Jill</td>
                            <td>Smith</td>
                            <td>50</td>
                        </tr>
                    </tbody>
                </table>
                <table className="fotter">
                    <tfoot>
                        <tr>
                            <td>Prodect Quantity : 20</td>
                            <td>Total Price : 1203 $</td>
                            <td className="btn"><button>Order Again</button></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </main>
    )
}