"use client"
import { useState, useEffect, useCallback } from "react"; 
import { useViewportSize } from '../hooks/useDeviceDimensions';
import {URL} from '../data/URL.js'
import {Use_them} from '../hooks/ThemProvider'

export default function Car_component (){
    const [open,setopen] = useState("none")
    const viewportSize = useViewportSize();
    const [items , setItems]= useState() 
    const [value, setValue] = useState()
    const [loding , setloding] = useState(true)
    const [products , setproducts] = useState()
    const {setmessge, setSeverity, setsnack, setCart} = Use_them()
    async function fetchProducts() {
        setloding(true)
        let productsInCart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (!productsInCart || productsInCart.length === 0) {
            setloding(false)
            setItems()
            return
        }
        const ids = []
        for (let item of productsInCart){
            ids.push(item.id)
        }
        try {
            const res = await fetch(
                `http://${URL}:8000/api/products/by-ids/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ids}),
                    cache: "no-store",
                }
            );
            if (!res.ok) {
                handleClick('فشل في إرسال الطلب أعد المحاولة', 'error')
                throw new Error('Failed to fetch products');
            }
            const products = await res.json();
            setproducts(products)
            const itemsList = []
            for (let product of products) {
                for (let color of product.colors) {
                    if (productsInCart?.some(item => item.id === product.id && item.color === color.color)) {
                        itemsList.push({
                            id : product.id,
                            product : product.primary_image ,
                            name : product.name ,
                            color : color.color ,
                            price : product.price ,
                            size : "/" ,
                            stock : color.quantity,
                            quantity : productsInCart.find(item => item.id === product.id && item.color === color.color)?.quantity
                        })
                    }
                }
            }
            setItems(itemsList)
            console.log(itemsList)
            let products_quantity = itemsList?.map((item, i) => ({
                key: i, value: item.quantity
            }))
            setValue(products_quantity)
        } catch (error) {
            console.error("Error fetching products:", error);
        }finally {
            setloding(false)
        }
    }
    function edit_car (i,opperation) {
        const productsInCart = JSON.parse(localStorage.getItem("cart") || "[]");
        let update_car = productsInCart.map((item, x) => {
            if (x === i) {
                if (opperation === "color") {
                    return { ...item, color: items[i].color }; // assuming 'value' holds the selected color
                } else if (opperation === "size") {
                    return { ...item, size: value }; // assuming 'value' holds the selected size
                } else if (opperation === "quantity") {
                    return { ...item, quantity: items[i].quantity }; // for quantity change
                }
            }
            return item;
        });
        localStorage.setItem("cart",JSON.stringify(update_car))
        fetchProducts();
    }
    useEffect(() => {
        fetchProducts();
    }, []);
    const hendel_delet_car = (i) => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]") 
        const index = cart.findIndex(item => item.id == items[i]?.id && item.color == items[i]?.color)
        if (index === -1) handleClick('فشل في إرسال الطلب أعد المحاولة', 'error');
        cart.splice(index,1)
        localStorage.setItem("cart" , JSON.stringify(cart))
        let check = JSON.parse(localStorage.getItem("cart") || "[]")
        check = check.findIndex(item => item.id == items[i]?.id && item.color == items[i]?.color)
        if (check !== -1) {
            handleClick('فشل في إرسال الطلب أعد المحاولة', 'error')
        }else {
            handleClick('تم حذف العنصر من السلة', 'success')
            fetchProducts();
            setCart(cart)
        }
    }
    console.log(value,5555555555)
    const handleClick = useCallback((msg, sev) => {
        setmessge(msg)
        setSeverity(sev)
        setsnack(true)
    }, [])
    document.documentElement.style.setProperty("--display_order", open);
    document.documentElement.style.setProperty("--display_order_animation", open === "flex" ? "opacity_2" : null);
    function hendel_add_btn(i) {
        let updatearr;
        if (items[i].quantity < items[i].stock) {
            updatearr = items.map((item , x) => 
                x === i ? {...item , quantity : item.quantity + 1 } : item
            )
        }else {
            updatearr = items.map((item , x) => 
                x === i ? {...item , quantity : items[i].stock } : item
            )
            handleClick('الكمية غير متوفرة حاليا', 'warning')
        }
        setItems(updatearr)
        edit_car(i)
    }
    function hendel_minus_btn(i) {
        console.log(items[i].quantity)
        let updatearr;
        if (items[i].quantity > 1) {
            updatearr = items.map((item , x) => 
                x === i ? {...item , quantity : item.quantity - 1 } : item
            )
        }else {
            handleClick('من فضلك ادخل كمية صحيحة او احذف المنتج', 'warning')
            return
        }
        setItems(updatearr)
        edit_car(i)
    }

    return (
        <>
            <main>
                {viewportSize.width >= 800 ? (
                    <div className="Car_contener">
                        <table className="hader">
                            <thead>
                                <tr>
                                    <th>Prodect</th>
                                    <th>Name</th> 
                                    <th>Color</th>
                                    <th>Price</th>
                                    <th>Size</th> 
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                        </table>
                        <table className="body">
                            <tbody style={{backgroundColor : "white"}}>
                                {loding ? <div className='loading_contener'><div className="loader"></div></div> : (
                                    <>
                                        {items? items.map((item,i) => (
                                            <tr>
                                                <td className="img">
                                                    <img className="img1" src={item.product} alt="Product Image" />
                                                </td>
                                                <td>{item.name}</td>
                                                <td>
                                                    <select className="Size_Color" onChange={(e) => {
                                                        let updatearr = items.map((item , x) => 
                                                                x === i ? {...item , color : e.target.value } : item
                                                            )
                                                        setItems(updatearr)
                                                        edit_car(i)
                                                    }} defaultValue={item.color}>
                                                        {products?.map((product , i) => {
                                                            if (product.id === item.id) {
                                                                return product.colors.map(color => (
                                                                    <option 
                                                                        value={color.color ? color.color : color.color_name}>
                                                                            {color.color ? color.color : color.color_name}
                                                                    </option>
                                                                ))
                                                            }else {
                                                                return null
                                                            }
                                                        })}
                                                    </select>
                                                </td>
                                                <td>{item.price}</td>
                                                <td>
                                                    <select className="Size_Color">
                                                        <option value="size1">Size 1</option>
                                                        <option value="size2">Size 2</option>
                                                        <option value="size3">Size 3</option>
                                                        <option value="size4">Size 4</option>
                                                        <option value="size5">Size 5</option>
                                                        <option value="size6">Size 6</option>
                                                        <option value="size7">Size 7</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <div className="Number">
                                                        <button type="button" onClick={() => hendel_add_btn(i)}>
                                                            <span className="material-symbols-outlined">
                                                                add
                                                            </span>
                                                        </button>
                                                        <input className="Quantity" onChange={(e) => {
                                                            let updatearr;
                                                            if ( e.target.value < items[i].stock + 1 && e.target.value > 1) {
                                                                updatearr = items.map((item , x) => 
                                                                    x === i ? {...item , quantity : e.target.value } : item
                                                                )
                                                            }else {
                                                                updatearr = items.map((item , x) => 
                                                                    x === i ? {...item , quantity : 1 } : item
                                                                )
                                                                handleClick('الكمية غير متوفرة حاليا', 'warning')
                                                            }
                                                            setItems(updatearr)
                                                        }} type="number" value={items[i].quantity}/>
                                                        <button type="button" onClick={() => hendel_minus_btn(i)}>
                                                            <span className="material-symbols-outlined">
                                                                remove
                                                            </span>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="btn_close" onClick={() => hendel_delet_car(i)}>
                                                    <button>
                                                        <span className="material-symbols-outlined">close</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        
                                        )) : <div className="no_data">No Product yet</div> }
                                    </>
                                )}
                            </tbody>
                        </table>
                        <table className="fotter">
                            <tfoot>
                                <tr>
                                    <td>Prodect Quantity : {items?.reduce((sum,item) => sum + item.quantity,0)}</td>
                                    <td>Total Price : {items?.reduce((sum,item) => sum + Number(item.price)*item.quantity,0).toFixed(2)} $</td>
                                    <td className="btn"><button onClick={() => setopen("flex")}>Order New</button></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                ) : (
                    <div className="Car_contener">
                        <div className="Phon_contener">
                            {items? items.map((item,i) => (
                                <div className="Prodect">
                                    <img className="img1" src={item.product} alt="Product Image" />
                                    <div className="Name_color_price">
                                        <p>{item.name}</p>
                                        <p>{item.price}</p>
                                        <label>Color :</label>
                                        <select className="Size_Color" defaultValue={item.color}>
                                             {products?.map((product , i) => {
                                                if (product.id === item.id) {
                                                    return product.colors.map(color => (
                                                        <option 
                                                            value={color.color ? color.color : color.color_name}>
                                                                {color.color ? color.color : color.color_name}
                                                        </option>
                                                    ))
                                                }else {
                                                    return null
                                                }
                                            })}
                                        </select>
                                    </div>
                                    <div className="Size_quantity">
                                        <div className="btn_close_Phone">
                                            <button onClick={() => hendel_delet_car(i)}>
                                                <span className="material-symbols-outlined">close</span>
                                            </button>
                                        </div>
                                        <label>Size :</label>
                                        <select className="Size_Color">
                                            <option value="size1">Size 1</option>
                                            <option value="size2">Size 2</option>
                                            <option value="size3">Size 3</option>
                                            <option value="size4">Size 4</option>
                                            <option value="size5">Size 5</option>
                                            <option value="size6">Size 6</option>
                                            <option value="size7">Size 7</option>
                                        </select>
                                        <label>Quantity : </label>
                                        <div className="Number">
                                            <button type="button" onClick={() => hendel_add_btn(i)}>
                                                <span className="material-symbols-outlined">
                                                    add
                                                </span>
                                            </button>
                                            <input className="Quantity" type="number" onChange={ () => {
                                                let updatearr;
                                                if ( e.target.value < items[i].stock + 1 && e.target.value > 1) {
                                                    updatearr = items.map((item , x) => 
                                                        x === i ? {...item , quantity : e.target.value } : item
                                                    )
                                                }else {
                                                    updatearr = items.map((item , x) => 
                                                        x === i ? {...item , quantity : 1 } : item
                                                    )
                                                    handleClick('الكمية غير متوفرة حاليا', 'warning')
                                                }
                                                setItems(updatearr)
                                            }} value={items[i]?.quantity} min={1} />
                                            <button type="button" onClick={() => hendel_minus_btn(i)}>
                                                <span className="material-symbols-outlined">
                                                    remove
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )) : <div className="no_data">No Product yet</div> }
                        </div>
                        <table className="fotter">
                            <tfoot>
                                <tr>
                                    <td>Prodect Quantity : {items?.reduce((sum,item) => sum + item.quantity,0)}</td>
                                    <td>Total Price : {items?.reduce((sum,item) => sum + Number(item.price)*item.quantity,0).toFixed(2)} $</td>
                                    <td className="btn" ><button onClick={() => setopen("flex")}>Order New</button></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </main>
            <div className="test" >
                <div className="Order_detail" >
                    <div className="Product_detail">
                        <div className="detail">
                            <p>Bilal toubal</p>
                            <label>Quantity : <span>{items?.reduce((sum,item) => sum + item.quantity,0)}</span></label>
                            <label>Price : <span>{items?.reduce((sum,item) => sum + Number(item.price)*item.quantity,0).toFixed(2)}$</span></label>
                            <label>Eemil : <span>toubalbilal2005@gmail.com</span></label>
                            <label>Phone : <span>+213 0698201514 / +213 0698201514</span></label>
                            <label>Addres : <span>Algire , el hamiz , SNTP</span></label>
                            <label>payment: <span>On Delivery</span></label>
                        </div>
                    </div>
                    <div className="Confirmation">
                        <button className="Confirm">Confirm</button>
                        <button className="Cancel" onClick={() => setopen("none")} >Cancel</button>
                    </div>
            </div>
            </div>
        </>
    )
}