"use client"
import { useState } from "react"; 
import { useViewportSize } from '../hooks/useDeviceDimensions';

export default function Car_component (){
    const [open,setopen] = useState("none")
    document.documentElement.style.setProperty("--display_order", open);
    document.documentElement.style.setProperty("--display_order_animation", open === "flex" ? "opacity_2" : null);
    const [value, setValue] = useState(1)
    const viewportSize = useViewportSize();
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
                                <tr>
                                    <td className="img">
                                        <img className="img1" src="/ph.jpg" alt="Product Image" />
                                    </td>
                                    <td>Smith</td>
                                    <td>
                                        <select className="Size_Color">
                                            <option value="Color 1">Color  1</option>
                                            <option value="Color 2">Color  2</option>
                                            <option value="Color 3">Color  3</option>
                                            <option value="Color 4">Color  4</option>
                                            <option value="Color 5">Color  5</option>
                                            <option value="Color 6">Color  6</option>
                                            <option value="Color 7">Color  7</option>
                                        </select>
                                    </td>
                                    <td>50</td>
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
                                            <button type="button" onClick={hendel_add_btn}>
                                                <span className="material-symbols-outlined">
                                                    add
                                                </span>
                                            </button>
                                            <input className="Quantity" type="number" value={value} min={1} />
                                            <button type="button" onClick={hendel_minus_btn}>
                                                <span className="material-symbols-outlined">
                                                    remove
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="img">
                                        <img className="img1" src="/ph.jpg" alt="Product Image" />
                                    </td>
                                    <td>Smith</td>
                                    <td>
                                        <select className="Size_Color">
                                            <option value="Color 1">Color  1</option>
                                            <option value="Color 2">Color  2</option>
                                            <option value="Color 3">Color  3</option>
                                            <option value="Color 4">Color  4</option>
                                            <option value="Color 5">Color  5</option>
                                            <option value="Color 6">Color  6</option>
                                            <option value="Color 7">Color  7</option>
                                        </select>
                                    </td>
                                    <td>50</td>
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
                                            <button type="button" onClick={hendel_add_btn}>
                                                <span className="material-symbols-outlined">
                                                    add
                                                </span>
                                            </button>
                                            <input className="Quantity" type="number" value={value} min={1} />
                                            <button type="button" onClick={hendel_minus_btn}>
                                                <span className="material-symbols-outlined">
                                                    remove
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="img">
                                        <img className="img1" src="/ph.jpg" alt="Product Image" />
                                    </td>
                                    <td>Smith</td>
                                    <td>
                                        <select className="Size_Color">
                                            <option value="Color 1">Color  1</option>
                                            <option value="Color 2">Color  2</option>
                                            <option value="Color 3">Color  3</option>
                                            <option value="Color 4">Color  4</option>
                                            <option value="Color 5">Color  5</option>
                                            <option value="Color 6">Color  6</option>
                                            <option value="Color 7">Color  7</option>
                                        </select>
                                    </td>
                                    <td>50</td>
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
                                            <button type="button" onClick={hendel_add_btn}>
                                                <span className="material-symbols-outlined">
                                                    add
                                                </span>
                                            </button>
                                            <input className="Quantity" type="number" value={value} min={1} />
                                            <button type="button" onClick={hendel_minus_btn}>
                                                <span className="material-symbols-outlined">
                                                    remove
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="img">
                                        <img className="img1" src="/ph.jpg" alt="Product Image" />
                                    </td>
                                    <td>Smith</td>
                                    <td>
                                        <select className="Size_Color">
                                            <option value="Color 1">Color  1</option>
                                            <option value="Color 2">Color  2</option>
                                            <option value="Color 3">Color  3</option>
                                            <option value="Color 4">Color  4</option>
                                            <option value="Color 5">Color  5</option>
                                            <option value="Color 6">Color  6</option>
                                            <option value="Color 7">Color  7</option>
                                        </select>
                                    </td>
                                    <td>50</td>
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
                                            <button type="button" onClick={hendel_add_btn}>
                                                <span className="material-symbols-outlined">
                                                    add
                                                </span>
                                            </button>
                                            <input className="Quantity" type="number" value={value} min={1} />
                                            <button type="button" onClick={hendel_minus_btn}>
                                                <span className="material-symbols-outlined">
                                                    remove
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="img">
                                        <img className="img1" src="/ph.jpg" alt="Product Image" />
                                    </td>
                                    <td>Smith</td>
                                    <td>
                                        <select className="Size_Color">
                                            <option value="Color 1">Color  1</option>
                                            <option value="Color 2">Color  2</option>
                                            <option value="Color 3">Color  3</option>
                                            <option value="Color 4">Color  4</option>
                                            <option value="Color 5">Color  5</option>
                                            <option value="Color 6">Color  6</option>
                                            <option value="Color 7">Color  7</option>
                                        </select>
                                    </td>
                                    <td>50</td>
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
                                            <button type="button" onClick={hendel_add_btn}>
                                                <span className="material-symbols-outlined">
                                                    add
                                                </span>
                                            </button>
                                            <input className="Quantity" type="number" value={value} min={1} />
                                            <button type="button" onClick={hendel_minus_btn}>
                                                <span className="material-symbols-outlined">
                                                    remove
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="img">
                                        <img className="img1" src="/ph.jpg" alt="Product Image" />
                                    </td>
                                    <td>Smith</td>
                                    <td>
                                        <select className="Size_Color">
                                            <option value="Color 1">Color  1</option>
                                            <option value="Color 2">Color  2</option>
                                            <option value="Color 3">Color  3</option>
                                            <option value="Color 4">Color  4</option>
                                            <option value="Color 5">Color  5</option>
                                            <option value="Color 6">Color  6</option>
                                            <option value="Color 7">Color  7</option>
                                        </select>
                                    </td>
                                    <td>50</td>
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
                                            <button type="button" onClick={hendel_add_btn}>
                                                <span className="material-symbols-outlined">
                                                    add
                                                </span>
                                            </button>
                                            <input className="Quantity" type="number" value={value} min={1} />
                                            <button type="button" onClick={hendel_minus_btn}>
                                                <span className="material-symbols-outlined">
                                                    remove
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="fotter">
                            <tfoot>
                                <tr>
                                    <td>Prodect Quantity : 20</td>
                                    <td>Total Price : 1203 $</td>
                                    <td className="btn"><button onClick={() => setopen("flex")}>Order New</button></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                ) : (
                    <div className="Car_contener">
                        <div className="Phon_contener">
                            <div className="Prodect">
                                <img className="img1" src="/ph.jpg" alt="Product Image" />
                                <div className="Name_color_price">
                                    <p>prodect</p>
                                    <p>100</p>
                                    <label>Color :</label>
                                    <select className="Size_Color">
                                        <option value="Color 1">Color  1</option>
                                        <option value="Color 2">Color  2</option>
                                        <option value="Color 3">Color  3</option>
                                        <option value="Color 4">Color  4</option>
                                        <option value="Color 5">Color  5</option>
                                        <option value="Color 6">Color  6</option>
                                        <option value="Color 7">Color  7</option>
                                    </select>
                                </div>
                                <div className="Size_quantity">
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
                                        <button type="button" onClick={hendel_add_btn}>
                                            <span className="material-symbols-outlined">
                                                add
                                            </span>
                                        </button>
                                        <input className="Quantity" type="number" value={value} min={1} />
                                        <button type="button" onClick={hendel_minus_btn}>
                                            <span className="material-symbols-outlined">
                                                remove
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="Prodect">
                                <img className="img1" src="/ph.jpg" alt="Product Image" />
                                <div className="Name_color_price">
                                    <p>prodect</p>
                                    <p>100</p>
                                    <label>Color :</label>
                                    <select className="Size_Color">
                                        <option value="Color 1">Color  1</option>
                                        <option value="Color 2">Color  2</option>
                                        <option value="Color 3">Color  3</option>
                                        <option value="Color 4">Color  4</option>
                                        <option value="Color 5">Color  5</option>
                                        <option value="Color 6">Color  6</option>
                                        <option value="Color 7">Color  7</option>
                                    </select>
                                </div>
                                <div className="Size_quantity">
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
                                        <button type="button" onClick={hendel_add_btn}>
                                            <span className="material-symbols-outlined">
                                                add
                                            </span>
                                        </button>
                                        <input className="Quantity" type="number" value={value} min={1} />
                                        <button type="button" onClick={hendel_minus_btn}>
                                            <span className="material-symbols-outlined">
                                                remove
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="Prodect">
                                <img className="img1" src="/ph.jpg" alt="Product Image" />
                                <div className="Name_color_price">
                                    <p>prodect</p>
                                    <p>100</p>
                                    <label>Color :</label>
                                    <select className="Size_Color">
                                        <option value="Color 1">Color  1</option>
                                        <option value="Color 2">Color  2</option>
                                        <option value="Color 3">Color  3</option>
                                        <option value="Color 4">Color  4</option>
                                        <option value="Color 5">Color  5</option>
                                        <option value="Color 6">Color  6</option>
                                        <option value="Color 7">Color  7</option>
                                    </select>
                                </div>
                                <div className="Size_quantity">
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
                                        <button type="button" onClick={hendel_add_btn}>
                                            <span className="material-symbols-outlined">
                                                add
                                            </span>
                                        </button>
                                        <input className="Quantity" type="number" value={value} min={1} />
                                        <button type="button" onClick={hendel_minus_btn}>
                                            <span className="material-symbols-outlined">
                                                remove
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="Prodect">
                                <img className="img1" src="/ph.jpg" alt="Product Image" />
                                <div className="Name_color_price">
                                    <p>prodect</p>
                                    <p>100</p>
                                    <label>Color :</label>
                                    <select className="Size_Color">
                                        <option value="Color 1">Color  1</option>
                                        <option value="Color 2">Color  2</option>
                                        <option value="Color 3">Color  3</option>
                                        <option value="Color 4">Color  4</option>
                                        <option value="Color 5">Color  5</option>
                                        <option value="Color 6">Color  6</option>
                                        <option value="Color 7">Color  7</option>
                                    </select>
                                </div>
                                <div className="Size_quantity">
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
                                        <button type="button" onClick={hendel_add_btn}>
                                            <span className="material-symbols-outlined">
                                                add
                                            </span>
                                        </button>
                                        <input className="Quantity" type="number" value={value} min={1} />
                                        <button type="button" onClick={hendel_minus_btn}>
                                            <span className="material-symbols-outlined">
                                                remove
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="Prodect">
                                <img className="img1" src="/ph.jpg" alt="Product Image" />
                                <div className="Name_color_price">
                                    <p>prodect</p>
                                    <p>100</p>
                                    <label>Color :</label>
                                    <select className="Size_Color">
                                        <option value="Color 1">Color  1</option>
                                        <option value="Color 2">Color  2</option>
                                        <option value="Color 3">Color  3</option>
                                        <option value="Color 4">Color  4</option>
                                        <option value="Color 5">Color  5</option>
                                        <option value="Color 6">Color  6</option>
                                        <option value="Color 7">Color  7</option>
                                    </select>
                                </div>
                                <div className="Size_quantity">
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
                                        <button type="button" onClick={hendel_add_btn}>
                                            <span className="material-symbols-outlined">
                                                add
                                            </span>
                                        </button>
                                        <input className="Quantity" type="number" value={value} min={1} />
                                        <button type="button" onClick={hendel_minus_btn}>
                                            <span className="material-symbols-outlined">
                                                remove
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="Prodect">
                                <img className="img1" src="/ph.jpg" alt="Product Image" />
                                <div className="Name_color_price">
                                    <p>prodect</p>
                                    <p>100</p>
                                    <label>Color :</label>
                                    <select className="Size_Color">
                                        <option value="Color 1">Color  1</option>
                                        <option value="Color 2">Color  2</option>
                                        <option value="Color 3">Color  3</option>
                                        <option value="Color 4">Color  4</option>
                                        <option value="Color 5">Color  5</option>
                                        <option value="Color 6">Color  6</option>
                                        <option value="Color 7">Color  7</option>
                                    </select>
                                </div>
                                <div className="Size_quantity">
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
                                        <button type="button" onClick={hendel_add_btn}>
                                            <span className="material-symbols-outlined">
                                                add
                                            </span>
                                        </button>
                                        <input className="Quantity" type="number" value={value} min={1} />
                                        <button type="button" onClick={hendel_minus_btn}>
                                            <span className="material-symbols-outlined">
                                                remove
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="Prodect">
                                <img className="img1" src="/ph.jpg" alt="Product Image" />
                                <div className="Name_color_price">
                                    <p>prodect</p>
                                    <p>100</p>
                                    <label>Color :</label>
                                    <select className="Size_Color">
                                        <option value="Color 1">Color  1</option>
                                        <option value="Color 2">Color  2</option>
                                        <option value="Color 3">Color  3</option>
                                        <option value="Color 4">Color  4</option>
                                        <option value="Color 5">Color  5</option>
                                        <option value="Color 6">Color  6</option>
                                        <option value="Color 7">Color  7</option>
                                    </select>
                                </div>
                                <div className="Size_quantity">
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
                                        <button type="button" onClick={hendel_add_btn}>
                                            <span className="material-symbols-outlined">
                                                add
                                            </span>
                                        </button>
                                        <input className="Quantity" type="number" value={value} min={1} />
                                        <button type="button" onClick={hendel_minus_btn}>
                                            <span className="material-symbols-outlined">
                                                remove
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="Prodect">
                                <img className="img1" src="/ph.jpg" alt="Product Image" />
                                <div className="Name_color_price">
                                    <p>prodect</p>
                                    <p>100</p>
                                    <label>Color :</label>
                                    <select className="Size_Color">
                                        <option value="Color 1">Color  1</option>
                                        <option value="Color 2">Color  2</option>
                                        <option value="Color 3">Color  3</option>
                                        <option value="Color 4">Color  4</option>
                                        <option value="Color 5">Color  5</option>
                                        <option value="Color 6">Color  6</option>
                                        <option value="Color 7">Color  7</option>
                                    </select>
                                </div>
                                <div className="Size_quantity">
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
                                        <button type="button" onClick={hendel_add_btn}>
                                            <span className="material-symbols-outlined">
                                                add
                                            </span>
                                        </button>
                                        <input className="Quantity" type="number" value={value} min={1} />
                                        <button type="button" onClick={hendel_minus_btn}>
                                            <span className="material-symbols-outlined">
                                                remove
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <table className="fotter">
                            <tfoot>
                                <tr>
                                    <td>Prodect Quantity : 20</td>
                                    <td>Total Price : 1203 $</td>
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
                            <label>Quantity : <span>50</span></label>
                            <label>Price : <span>500$</span></label>
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