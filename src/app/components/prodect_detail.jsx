'use client';
import * as React from 'react'
import {useState , useEffect , useCallback } from "react"; 
import {Account , apiFetch} from '../data/FETCH.js'
import {WILAYAS_DATA} from '../data/Wilaya.js'
import {URL} from '../data/URL.js'
import {Use_them} from '../hooks/ThemProvider'

export default function Prodect_detail_component({ data}) {
    const [test , settest] = useState()
    const [open, setOpen] = useState("none");
    const [value, setValue] = useState(1)
    const [Primary, setPrimary] = useState(
        data.primary_image
    );
    const [delivery,setdelivery] = useState({
        status: "Delivered",
        items_register: [
            {
                product: data.id,
                quantity: value
            }
        ],
        deliveries: [
                {
                    delivery_address : {
                        wilaya: "0",
                        baldya : 
                        "0"
                    },
                    delivery_phone: [],
                    first_name : "",
                    last_name : "", 
                }
            ]
        })
    const [info , setinfo] = useState({})
    const [wrong , setwrong] = useState({color:"red", input :""})
    const [order , setorder] = useState ({})
    const [wilaya, setwilaya] = useState("0")
    const [warning , setwarning] = useState({messege:"",display :"none"})
    const [loding , setloding] = useState({type : '' , value : true})
    const {setmessge, setSeverity, setsnack, setCart} = Use_them()
    const [form, setform] = useState({size : 'size3' , color : data.colors[0].color ? data.colors[0].color : data.colors[0].color_name})
    const handleClick = useCallback((msg, sev) => {
        setmessge(msg)
        setSeverity(sev)
        setsnack(true)
    }, [])
    const user_order = async () => {
        try {
            setloding({type : 'warning' , value : true})
            setwarning({...warning , display : "flex"})
            const res = await apiFetch(`http://${URL}:8000/api/orders/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(order),
                }
            );
            console.log(res.status)
            if (!res.ok){
                const errorData = await log.json();
                setloding(false)
                setwarning({messege:errorData.error ? errorData.error + "pless complet your profile" : "pless complet all the importent field",display :"flex"})
                throw new Error(JSON.stringify(errorData));
            }else {
                setwarning({...warning , display : "none"})
            }
            handleClick('تم ارسال الطلب بنجاح شكرا', 'success')
        } catch (error) {
            console.error("Error fetching profile:", error);
            handleClick('فشل في إرسال الطلب أعد المحاولة', 'error')
        }finally{
            setloding(false)
        }
    }
    const hendel_add_car = () => {
        const newItem ={
            id : data.id,
            quantity : value,
            color : form.color,
        }
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")
        let item = JSON.parse(localStorage.getItem("cart"))
        let check = item?.find((i) => i.id == data.id && i.color == form.color);
        if (check) {
            handleClick('العنصر موجود في السلة فعلا', 'warning')
        }else {
            localStorage.setItem(
                "cart",
                JSON.stringify([...cart, newItem])
            )
            setCart(prev => [...prev , newItem])
            item = JSON.parse(localStorage.getItem("cart"))
            let find = item.find((i) => i.id == data.id && i.color == form.color);
            if (find) {
                handleClick('تم إضافة العنصر الى السلة', 'success')
            }else {
                handleClick('فشل في إرسال الطلب أعد المحاولة', 'error')
            }
        }
    }
    const Anonimo_order = async () => {
        console.log(order.first_name)
        if (!delivery.deliveries[0].first_name || delivery.deliveries[0].first_name.length < 3) {
            setwrong({ ...wrong, input: 'first_name' });
            handleClick('أكتب الأسم كاملا من فضلك', 'warning');
        } else if (!delivery.deliveries[0].last_name || delivery.deliveries[0].last_name.length < 3) {
            setwrong({ ...wrong, input: 'last_name' });
            handleClick('أكتب اللقب كاملا من فضلك', 'warning');
        } else if (delivery.deliveries[0].delivery_address?.wilaya === "0" || delivery.deliveries[0].delivery_address?.baldya === "0") {
            setwrong({ ...wrong, input: 'wilaya' });
            handleClick('أدخل مكان الإقامة من فضلك', 'warning');
        } else if (!delivery.deliveries[0].delivery_phone[0] && !/^(05|06|07|02)\d{8}$/.test(delivery.deliveries[0].delivery_phone[0])) {
            setwrong({ ...wrong, input: 'Phone1' });
            handleClick('أدخل هاتف الأول صالح من فضلك', 'warning');
        } else if (delivery.deliveries[0].delivery_phone[1] && !/^(05|06|07|02)\d{8}$/.test(delivery.deliveries[0].delivery_phone[1])
        ) {
            setwrong({ ...wrong, input: 'Phone2' });
            handleClick('أدخل هاتف ثاني صالح من فضلك', 'warning');
        }else {
            setwrong({...wrong , input:''})
            let result = true 
            try {
                setloding({type : 'warning' , value : true})
                setwarning({...warning , display : "flex"})
                const res = await apiFetch(`http://${URL}:8000/api/orders/`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(delivery),
                    }
                );
                console.log(res.status)
                if (!res.ok){
                    const errorData = await res.json();
                    setloding(false)
                    result = false
                    setwarning({messege:errorData.error ? errorData.error : "pless complet all the importent field",display :"flex"})
                    throw new Error(JSON.stringify(errorData));
                }
                handleClick('تم ارسال الطلب بنجاح شكرا', 'success')
            } catch (error) {
                console.error("Error fetching profile:", error);
                handleClick('فشل في إرسال الطلب أعد المحاولة', 'error')
            } finally {
                setloding(false)
                if (result){
                    setwarning({...warning , display : "none"})
                }
            }   
          }
    }
    useEffect(() => {
        const fetchAccount = async () => {
            try {
                setloding({type : "prodect" , value : true})
                const account = await Account();
                setinfo(account.user);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setloding(false);
            }
        };
        fetchAccount();
    }, []);
    console.log(test)
    useEffect(() => {
        document.documentElement.style.setProperty("--display_order", open);
        document.documentElement.style.setProperty(
            "--display_order_animation",
            open === "flex" ? "opacity_2" : null
        );
    }, [open]);

    const scrollSecondary = (direction) => {
        const secondaryContainer = document.querySelector('.Secondary-images');
        if (secondaryContainer) {
            const scrollAmount = 200; // مقدار السكرول بالبكسل
            if (direction === 'left') {
                secondaryContainer.scrollLeft -= scrollAmount;
            } else {
                secondaryContainer.scrollLeft += scrollAmount;
            }
        }
    };
    const hendel_add_btn = () => {
        if (value >= data.stock) {
            setValue(data.stock);
        } else {
            setValue(value + 1)
        }
    }
    const hendel_minus_btn = () => {
        if (value <= 1) {
            setValue(1);
        } else {
            setValue(value - 1);
        }
    }
    // const [star, setStar] = useState({ star_1: "black", star_2: "black", star_3: "black", star_4: "black", star_5: "black" });
    // const [gas_star, set_gas_star] = useState({ star_1: "black", star_2: "black", star_3: "black", star_4: "black", star_5: "black" });
    // const [Rating , setRating] = useState (3);
    // useEffect(() => {
    //     console.log("rendred--------" + Rating)
    //     const newStars = {
    //         star_1: Rating >= 1 ? "yellow" : "black" ,
    //         star_2: Rating >= 2 ? "yellow" : "black" ,
    //         star_3: Rating >= 3 ? "yellow" : "black" ,
    //         star_4: Rating >= 4 ? "yellow" : "black" ,
    //         star_5: Rating >= 5 ? "yellow" : "black" ,
    //     };
    //     setStar(newStars);
    // },[Rating])
    // const hendel_star_btn = (ring) => {
    //     const newStars = {
    //         star_1: ring >= 1 && star.star_1 != "yellow" ? "yellow" : ring > 1 ? "yellow" : "black" ,
    //         star_2: ring >= 2 && star.star_2 != "yellow" ? "yellow" : ring > 2 ? "yellow" : "black" ,
    //         star_3: ring >= 3 && star.star_3 != "yellow" ? "yellow" : ring > 3 ? "yellow" : "black" ,
    //         star_4: ring >= 4 && star.star_4 != "yellow" ? "yellow" : ring > 4 ? "yellow" : "black" ,
    //         star_5: ring >= 5 && star.star_5 != "yellow" ? "yellow" : ring > 5 ? "yellow" : "black" ,
    //     };
    //     setStar(newStars);
    // }
    // const hendel_gas_star_btn = (ring) => {
    //     const newStars = {
    //         star_1: ring >= 1 ? "yellow" : "black" ,
    //         star_2: ring >= 2 ? "yellow" : "black" ,
    //         star_3: ring >= 3 ? "yellow" : "black" ,
    //         star_4: ring >= 4 ? "yellow" : "black" ,
    //         star_5: ring >= 5 ? "yellow" : "black" ,
    //     };
    //     set_gas_star(newStars);
    // }
    return (
        <>
            <main>
                <div className="prodect-detail-container">
                    {loding.type === "" && loding.value ? <div className='loading_contener'><div className="loader"></div></div> : (
                        <>
                            <div className="Picture">
                                <div className="Pictures_Container">
                                    <div className="Primary" >
                                        <img src={Primary} alt="Product Image" />
                                    </div>
                                    <div className="Secondary">
                                        <div className="Secondary-images">
                                            <img onClick={() => setPrimary(data.primary_image)} src={data.primary_image} alt="Product Image" />
                                            {data.secondary_images.map(img => <img onClick={() => setPrimary(img.image)} src={img.image} alt="Product Image" />)}
                                        </div>
                                        <div className="Secondary-scroll-btn-container">
                                            <button className="Secondary-scroll-btn left" onClick={() => scrollSecondary('left')}>
                                                ‹
                                            </button>
                                            <button className="Secondary-scroll-btn right" onClick={() => scrollSecondary('right')}>
                                                ›
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="Detail">
                                <h1>{data.name}</h1>
                                <hr/>
                                <p>{data.price} $</p>
                                {/* <div className="Rating">
                                    <button onClick={()=>hendel_star_btn(1)} onMouseEnter={()=>hendel_gas_star_btn(1)} onMouseLeave={()=>hendel_gas_star_btn(star.star_1 === "black" ? Rating : 0)}>
                                        <span style={{color : star.star_1 === "black" ? gas_star.star_1 : star.star_1}} className="material-symbols-outlined">
                                            star
                                        </span>
                                    </button>
                                    <button onClick={()=>hendel_star_btn(2)} onMouseEnter={()=>hendel_gas_star_btn(2)} onMouseLeave={()=>hendel_gas_star_btn(star.star_1 === "black" ? Rating : 0)}>
                                        <span style={{color : star.star_2 === "black" ? gas_star.star_2 : star.star_2}} className="material-symbols-outlined">
                                            star
                                        </span>
                                    </button>
                                    <button onClick={()=>hendel_star_btn(3)} onMouseEnter={()=>hendel_gas_star_btn(3)} onMouseLeave={()=>hendel_gas_star_btn(star.star_1 === "black" ? Rating : 0)}>
                                        <span style={{color : star.star_3 === "black" ? gas_star.star_3 : star.star_3}} className="material-symbols-outlined">
                                            star
                                        </span>
                                    </button>
                                    <button onClick={()=>hendel_star_btn(4)} onMouseEnter={()=>hendel_gas_star_btn(4)} onMouseLeave={()=>hendel_gas_star_btn(star.star_1 === "black" ? Rating : 0)}>
                                        <span style={{color : star.star_4 === "black" ? gas_star.star_4 : star.star_4}} className="material-symbols-outlined">
                                            star
                                        </span>
                                    </button>
                                    <button onClick={()=>hendel_star_btn(5)} onMouseEnter={()=>hendel_gas_star_btn(5)} onMouseLeave={()=>hendel_gas_star_btn(star.star_1 === "black" ? Rating : 0)}>
                                        <span style={{color : star.star_5 === "black" ? gas_star.star_5 : star.star_5}} className="material-symbols-outlined">
                                            star
                                        </span>
                                    </button>
                                    <p>4.5</p>
                                </div> */}
                                <form onSubmit={event => event.preventDefault()}>
                                    <label>Size :</label>
                                    <select defaultValue="size3" onChange={e => setform ({...form , size : e.target.value})} className="Size_Color">
                                        <option value="size1">Size 1</option>
                                        <option value="size2">Size 2</option>
                                        <option value="size3">Size 3</option>
                                        <option value="size4">Size 4</option>
                                        <option value="size5">Size 5</option>
                                        <option value="size6">Size 6</option>
                                        <option value="size7">Size 7</option>
                                    </select>
                                    <label>Color :</label>
                                    <select onChange={e => setform ({...form , color : e.target.value})}  className="Size_Color">
                                        {data.colors? data.colors.map((color) => <option value={color.color ? color.color : color.color_name}>{color.color ? color.color : color.color_name}</option>): <option value="Color 1">Color  1</option>}
                                    </select>
                                    <label>Quantity :</label>
                                    <div className="Number">
                                        <button type="button" onClick={hendel_add_btn}>
                                            <span className="material-symbols-outlined">
                                                add
                                            </span>
                                        </button>
                                        <input onChange={e => setform ({...form , quantity : e.target.value})}  className="Quantity" type="number" value={value} />
                                        <button type="button" onClick={hendel_minus_btn}>
                                            <span className="material-symbols-outlined">
                                                remove
                                            </span>
                                        </button>
                                    </div>
                                    <div className="Button_Buy">
                                        <button className="Buy" onClick={() => setOpen("flex")}>Buy Now</button>
                                        <button className="Car" onClick={() => {
                                            hendel_add_car()
                                        }}>Add to car
                                            <span className="material-symbols-outlined">
                                                add_shopping_cart
                                            </span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="Info">
                                <hr/>
                                <label>Description :</label>
                                <div style={{whiteSpace:'pre-line'}}>
                                    {data.description}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
            <div className="test" style={{display : open}}>
                <div className="Order_detail" >
                    <div className="Product_detail">
                        <div className="Title">
                            <h1>Product Detail</h1>
                        </div>
                        <img src={data.primary_image} alt="Product Image" />   
                        <div className="detail">
                            <h1>{data.name}</h1>
                            <label>Color : <span>{form.color}</span></label>
                            <label>Size : <span>{form.size}</span></label>
                            <label>Quantity : <span>{value}</span></label>
                            <label>Price : <span>{data.price} $</span></label>
                        </div>
                        <div className="Title">
                            <h1>Delivery information</h1>
                        </div>
                        {info.username === "@Anonimo" ? (
                            <>
                                <div className="detail_delivery">
                                    <form className='delivery' >
                                        <div className='Ferst_Name'>
                                            <label>Ferst Name :</label>
                                            <input
                                            type="text"
                                            value={delivery.deliveries && delivery.deliveries[0]?.first_name ? delivery.deliveries[0].first_name : ""}
                                            onChange={e => {
                                                const newDeliveries = delivery.deliveries ? [...delivery.deliveries] : [{}];
                                                newDeliveries[0] = { 
                                                    ...newDeliveries[0], 
                                                    first_name: e.target.value 
                                                };
                                                setdelivery({ ...delivery, deliveries: newDeliveries });
                                            }}
                                            style={{borderColor : wrong.input === 'first_name' ? wrong.color : 'black'}}
                                            required
                                            />
                                        </div>
                                        <div className='Last_Name' >
                                            <label>Last Name :</label>
                                            <input
                                            type="text"
                                            value={delivery.deliveries && delivery.deliveries[0]?.last_name ? delivery.deliveries[0].last_name : ""}
                                            onChange={e => {
                                                const newDeliveries = delivery.deliveries ? [...delivery.deliveries] : [{}];
                                                newDeliveries[0] = { 
                                                    ...newDeliveries[0], 
                                                    last_name: e.target.value 
                                                };
                                                setdelivery({ ...delivery, deliveries: newDeliveries });
                                            }}
                                            style={{borderColor : wrong.input === 'last_name' ? wrong.color : 'black'}}
                                            required
                                            />
                                        </div>
                                        <div className='wilaya'  required>
                                            <label>Wilaya :</label>
                                            <select
                                            value={wilaya}
                                            onChange={(e) => {
                                                setwilaya(e.target.value)
                                                const newDeliveries = delivery.deliveries ? [...delivery.deliveries] : [{}];
                                                newDeliveries[0] = { 
                                                    ...newDeliveries[0], 
                                                    delivery_address: {
                                                        ...((newDeliveries[0] && newDeliveries[0].delivery_address) || {}),
                                                        wilaya: e.target.value
                                                    }
                                                };
                                                setdelivery({ ...delivery, deliveries: newDeliveries });
                                            }}
                                            style={{borderColor : wrong.input === 'wilaya' ? wrong.color : 'black'}}
                                            >
                                            <option value="0">-- اختر الولاية --</option>
                                            {WILAYAS_DATA.map((w) => (
                                                <option key={w.wilaya_code} value={w.wilaya_name}>
                                                {w.wilaya_code} - {w.wilaya_name}
                                                </option>
                                            ))}
                                            </select>
                                        </div>
                                        <div className='wilaya' required>
                                            <label>Baldya :</label>
                                            <select
                                            value={
                                                (delivery.deliveries &&
                                                    delivery.deliveries[0]?.delivery_address?.baldya
                                                ) || ""
                                            }
                                            disabled={wilaya === "0"}
                                            onChange={e => {
                                                const newDeliveries = delivery.deliveries ? [...delivery.deliveries] : [{}];
                                                newDeliveries[0] = { 
                                                    ...newDeliveries[0], 
                                                    delivery_address: {
                                                        ...((newDeliveries[0] && newDeliveries[0].delivery_address) || {}),
                                                        baldya: e.target.value
                                                    }
                                                };
                                                setdelivery({ ...delivery, deliveries: newDeliveries });
                                            }}
                                            style={{borderColor : wrong.input === 'wilaya' ? wrong.color : 'black'}}
                                            >
                                            <option value="فارغ">-- اختر البلدية --</option>
                                            {wilaya !== "0" &&
                                                WILAYAS_DATA
                                                .find((w) => w.wilaya_name === wilaya)?.communes?.map((commune, idx) => (
                                                    <option key={idx} value={commune.commune_name}>
                                                    {commune.commune_name}
                                                    </option>
                                                ))
                                            }
                                            </select>
                                        </div>
                                        <div className="Phone" required>
                                            <label>Phone 1:</label>
                                            <input 
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            style={{ appearance: "textfield", borderColor : wrong.input === 'Phone1' ? wrong.color : 'black' }}
                                            value={
                                                delivery.deliveries && delivery.deliveries[0]?.delivery_phone &&
                                                Array.isArray(delivery.deliveries[0].delivery_phone) && delivery.deliveries[0].delivery_phone[0]
                                                    ? delivery.deliveries[0].delivery_phone[0]
                                                    : ""
                                            }
                                            onInput={e => {
                                                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            }}
                                            onChange={e => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                const newDeliveries = delivery.deliveries ? [...delivery.deliveries] : [{}];
                                                const phones = (
                                                    newDeliveries[0]?.delivery_phone && Array.isArray(newDeliveries[0].delivery_phone)
                                                    ? [...newDeliveries[0].delivery_phone]
                                                    : ["",""]
                                                );
                                                phones[0] = val;
                                                newDeliveries[0] = {
                                                    ...newDeliveries[0],
                                                    delivery_phone: phones
                                                };
                                                setdelivery({ ...delivery, deliveries: newDeliveries });
                                            }}
                                            maxLength={10}
                                            required
                                            />
                                        </div>
                                        <div className="Phone">
                                            <label>Phone 2:</label>
                                            <input
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            style={{ appearance: "textfield", borderColor : wrong.input === 'Phone2' ? wrong.color : 'black' }}
                                            value={
                                                delivery.deliveries && delivery.deliveries[0]?.delivery_phone &&
                                                Array.isArray(delivery.deliveries[0].delivery_phone) && delivery.deliveries[0].delivery_phone[1]
                                                    ? delivery.deliveries[0].delivery_phone[1]
                                                    : ""
                                            }
                                            onInput={e => {
                                                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            }}
                                            onChange={e => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                const newDeliveries = delivery.deliveries ? [...delivery.deliveries] : [{}];
                                                const phones = (
                                                    newDeliveries[0]?.delivery_phone && Array.isArray(newDeliveries[0].delivery_phone)
                                                    ? [...newDeliveries[0].delivery_phone]
                                                    : ["",""]
                                                );
                                                phones[1] = val;
                                                newDeliveries[0] = {
                                                    ...newDeliveries[0],
                                                    delivery_phone: phones
                                                };
                                                setdelivery({ ...delivery, deliveries: newDeliveries });
                                            }}
                                            maxLength={10}
                                            />
                                        </div>
                                        <div className="Confirmation">
                                            <button type="submit" onClick={(e) => {
                                                e.preventDefault()
                                                Anonimo_order()
                                            }} className="Confirm">Confirm</button>
                                            <button className="Cancel" onClick={() => setOpen("none")} >Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </>
                            ):(
                                <>
                                    <div className="detail">
                                        <p>{info.first_name +" "+ info.last_name}</p>
                                        <label className="Phone">
                                            Phone : <span>
                                                {Array.isArray(info.phone_numbers) && info.phone_numbers.length > 0
                                                    ? info.phone_numbers.filter(Boolean).join(' / ')
                                                    : "/"}
                                            </span>
                                        </label>
                                        <label className="Addres">
                                            Addres : <span>
                                                {info.address_line && info.address_line.wilaya
                                                    ? info.address_line.wilaya + "/" + info.address_line.baldya
                                                    : "/"}
                                            </span>
                                        </label>
                                        <label>payment: <span>On Delivery</span></label>
                                    </div>
                                    <div className="Confirmation">
                                        <button className="Confirm" onClick={() => {
                                            setorder({
                                                status: "Delivered",
                                                items_register: [
                                                        {
                                                                product: data.id,
                                                                quantity: value
                                                        }
                                                    ],
                                            })
                                            user_order()
                                        }}>Confirm</button>
                                        <button className="Cancel" onClick={() => setOpen("none")} >Cancel</button>
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
                <div className='warning_contener'style={{display: warning.display }}>
                    <div className='warning'>
                        {loding.type === "warning" && loding.value ? <div className='loading_contener' style={{height :"50px"}}><div className="loader"></div></div> : (
                            <>
                                <h1>{warning.messege}</h1>
                                <div className='btn'>
                                    <button onClick={() => setwarning({status:"",display :"None"})}>Try again</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}