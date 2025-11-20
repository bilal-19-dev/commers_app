'use client';
import {useState , useEffect} from "react"; 

export default function Prodect_detail_component({ data }) {
    const [open, setOpen] = useState("none");
    const [form, setform] = useState({size : 'size3' , color : 'Color 2' , quantity : '1'})
    const primaryImage = data.images.find(img => img.TypeIs === "Primary");
    const secondaryImage = data.images.filter(img => img.TypeIs === "Secondary");
    const [Primary, setPrimary] = useState(
        primaryImage.image !== undefined
            ? primaryImage.image
            : "/ph.jpg"
    );

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
    const [value, setValue] = useState(1)
    const hendel_add_btn = () => {
        setValue(value + 1)
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
                    <div className="Picture">
                        <div className="Pictures_Container">
                            <div className="Primary" >
                                <img src={Primary} alt="Product Image" />
                            </div>
                            <div className="Secondary">
                                <div className="Secondary-images">
                                    <img onClick={() => setPrimary(primaryImage.image !== undefined? primaryImage.image: "/ph.jpg")} src={primaryImage.image !== undefined? primaryImage.image: "/ph.jpg"} alt="Product Image" />
                                    {secondaryImage.map(img => <img onClick={() => setPrimary(img.image)} src={img.image} alt="Product Image" />)}
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
                            <select defaultValue="Color 2" onChange={e => setform ({...form , color : e.target.value})}  className="Size_Color">
                                <option value="Color 1">Color  1</option>
                                <option value="Color 2">Color  2</option>
                                <option value="Color 3">Color  3</option>
                                <option value="Color 4">Color  4</option>
                                <option value="Color 5">Color  5</option>
                                <option value="Color 6">Color  6</option>
                                <option value="Color 7">Color  7</option>
                            </select>
                            <label>Quantity :</label>
                            <div className="Number">
                                <button type="button" onClick={hendel_add_btn}>
                                    <span className="material-symbols-outlined">
                                        add
                                    </span>
                                </button>
                                <input onChange={e => setform ({...form , quantity : e.target.value})}  className="Quantity" type="number" value={value} min={1} />
                                <button type="button" onClick={hendel_minus_btn}>
                                    <span className="material-symbols-outlined">
                                        remove
                                    </span>
                                </button>
                            </div>
                            <div className="Button_Buy">
                                <button className="Buy" onClick={() => setOpen("flex")}>Buy Now</button>
                                <button className="Car">Add to car
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
                </div>
            </main>
            <div className="test" >
                <div className="Order_detail" >
                    <div className="Product_detail">
                        <div className="Title">
                            <h1>Product Detail</h1>
                        </div>
                        <img src={primaryImage.image !== undefined? primaryImage.image: "/ph.jpg"} alt="Product Image" />   
                        <div className="detail">
                            <h1>{data.name}</h1>
                            <label>Color : <span>{form.color}</span></label>
                            <label>Size : <span>{form.size}</span></label>
                            <label>Quantity : <span>{form.quantity}</span></label>
                            <label>Price : <span>{data.price} $</span></label>
                        </div>
                        <div className="Title">
                            <h1>Delivery information</h1>
                        </div>
                        <div className="detail">
                            <p>Bilal toubal</p>
                            <label>Eemil : <span>toubalbilal2005@gmail.com</span></label>
                            <label className="Phone">Phone : <span>+213 0698201514 / +213 0698201514</span></label>
                            <label className="Addres">Addres : <span>Algire , el hamiz , SNTP</span></label>
                            <label>payment: <span>On Delivery</span></label>
                        </div>
                    </div>
                    <div className="Confirmation">
                        <button className="Confirm">Confirm</button>
                        <button className="Cancel" onClick={() => setOpen("none")} >Cancel</button>
                    </div>
                </div>
            </div>
        </>
    );
}