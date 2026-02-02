"use client";
import { useState, useEffect, useCallback } from "react";
import { useViewportSize } from "../hooks/useDeviceDimensions";
import { Account, apiFetch } from "../data/FETCH.js";
import { WILAYAS_DATA } from "../data/Wilaya.js";
import { URL } from "../data/URL.js";
import { Use_them } from "../hooks/ThemProvider";

export default function Car_component() {
  const [open, setopen] = useState("none");
  const viewportSize = useViewportSize();
  const [items, setItems] = useState();
  const [value, setValue] = useState();
  const [loding, setloding] = useState(true);
  const [products, setproducts] = useState();
  const { setmessge, setSeverity, setsnack, setCart } = Use_them();
  const [warning, setwarning] = useState({ messege: "", display: "none" });
  const [wilaya, setwilaya] = useState("0");
  const [wrong, setwrong] = useState({ color: "red", input: "" });
  const [order, setorder] = useState({});
  const [delivery, setdelivery] = useState({
    items: [
      {
        product: "",
        quantity: "",
      },
    ],
    deliveries: [
      {
        delivery_address: {
          wilaya: "0",
          baldya: "0",
        },
        delivery_phone: [],
        first_name: "",
        last_name: "",
      },
    ],
  });
  const [info, setinfo] = useState({});
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setloding({ type: "prodect", value: true });
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
  async function fetchProducts(lod) {
    if (!lod) setloding(true);
    let productsInCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!productsInCart || productsInCart.length === 0) {
      setloding(false);
      setItems();
      return;
    }
    const ids = [];
    for (let item of productsInCart) {
      ids.push(item.id);
    }
    try {
      const res = await fetch(`http://${URL}:8000/api/products/by-ids/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
        cache: "no-store",
      });
      if (!res.ok) {
        handleClick("فشل في إرسال الطلب أعد المحاولة", "error");
        throw new Error("Failed to fetch products");
      }
      const products = await res.json();
      setproducts(products);
      let itemsList = [];
      for (let product of products) {
        for (let color of product.colors) {
          if (
            productsInCart?.some((item) =>
              item.id === product.id && item.color === color.color
                ? color.color
                : color.color_name
            )
          ) {
            itemsList.push({
              id: product.id,
              product: product.primary_image,
              name: product.name,
              color: color.color ? color.color : color.color_name,
              price: product.price,
              size: "/",
              stock: color.quantity,
              quantity: productsInCart.find((item) =>
                item.id === product.id && item.color === color.color
                  ? color.color
                  : color.color_name
              )?.quantity,
            });
          }
        }
      }
      const clean_items_list = itemsList.filter((item) =>
        productsInCart.some(
          (pro) => pro.id === item.id && pro.color === item.color
        )
      );
      setItems(clean_items_list);
      let products_quantity = clean_items_list?.map((item, i) => ({
        key: i,
        value: item.quantity,
      }));
      setValue(products_quantity);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setloding(false);
    }
  }
  const user_order = async () => {
    try {
      setloding({ type: "warning", value: true });
      setwarning({ ...warning, display: "flex" });
      console.log(order);
      const res = await apiFetch(`http://${URL}:8000/api/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });
      console.log(res.status);
      if (!res.ok) {
        const errorData = await res.json();
        setloding(false);
        setwarning({
          messege: errorData.error
            ? errorData.error
            : "something went wrong please try again",
          display: "flex",
        });
        throw new Error(JSON.stringify(errorData));
      } else {
        setwarning({ ...warning, display: "none" });
      }
      handleClick("تم ارسال الطلب بنجاح شكرا", "success");
      localStorage.setItem("cart", JSON.stringify([]));
      setCart([]);
      fetchProducts(true);
      setopen("none");
    } catch (error) {
      console.error("Error fetching profile:", error);
      handleClick("فشل في إرسال الطلب أعد المحاولة", "error");
    } finally {
      setloding(false);
    }
  };
  const Anonimo_order = async () => {
    console.log(order.first_name);
    if (
      !delivery.deliveries[0].first_name ||
      delivery.deliveries[0].first_name.length < 3
    ) {
      setwrong({ ...wrong, input: "first_name" });
      handleClick("أكتب الأسم كاملا من فضلك", "warning");
    } else if (
      !delivery.deliveries[0].last_name ||
      delivery.deliveries[0].last_name.length < 3
    ) {
      setwrong({ ...wrong, input: "last_name" });
      handleClick("أكتب اللقب كاملا من فضلك", "warning");
    } else if (
      delivery.deliveries[0].delivery_address?.wilaya === "0" ||
      delivery.deliveries[0].delivery_address?.baldya === "0"
    ) {
      setwrong({ ...wrong, input: "wilaya" });
      handleClick("أدخل مكان الإقامة من فضلك", "warning");
    } else if (
      !delivery.deliveries[0].delivery_phone[0] ||
      !/^(05|06|07|02)\d{8}$/.test(delivery.deliveries[0].delivery_phone[0])
    ) {
      setwrong({ ...wrong, input: "Phone1" });
      handleClick("أدخل هاتف الأول صالح من فضلك", "warning");
    } else if (
      delivery.deliveries[0].delivery_phone[1] &&
      !/^(05|06|07|02)\d{8}$/.test(delivery.deliveries[0].delivery_phone[1])
    ) {
      setwrong({ ...wrong, input: "Phone2" });
      handleClick("أدخل هاتف ثاني صالح من فضلك", "warning");
    } else {
      setwrong({ ...wrong, input: "" });
      let result = true;
      try {
        setloding({ type: "warning", value: true });
        setwarning({ ...warning, display: "flex" });
        const res = await apiFetch(`http://${URL}:8000/api/orders/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(delivery),
        });
        console.log(res.status);
        if (!res.ok) {
          const errorData = await res.json();
          setloding(false);
          result = false;
          setwarning({
            messege: errorData.error
              ? errorData.error
              : "pless complet all the importent field",
            display: "flex",
          });
          throw new Error(JSON.stringify(errorData));
        }
        handleClick("تم ارسال الطلب بنجاح شكرا", "success");
        localStorage.setItem("cart", JSON.stringify([]));
        setCart([]);
        fetchProducts(true);
        setopen("none");
      } catch (error) {
        console.error("Error fetching profile:", error);
        handleClick("فشل في إرسال الطلب أعد المحاولة", "error");
      } finally {
        setloding(false);
        if (result) {
          setwarning({ ...warning, display: "none" });
        }
      }
    }
  };
  function edit_car(i, opperation, input) {
    const productsInCart = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log(input);
    let check;
    console.log(check);
    let update_car = productsInCart.map((item, x) => {
      if (x === i) {
        if (opperation === "color") {
          check = productsInCart?.findIndex(
            (product) =>
              product.id === productsInCart[i].id && product.color === input
          );
          if (check !== -1) {
            handleClick("العنصر موجود في السلة فعلا", "warning");
            productsInCart.splice(check, 1);
            setCart(productsInCart);
            window.location.reload();
          }
          return { ...item, color: input }; // assuming 'value' holds the selected color
        } else if (opperation === "size") {
          return { ...item, size: input }; // assuming 'value' holds the selected size
        } else if (opperation === "quantity") {
          return { ...item, quantity: input }; // for quantity change
        }
      }
      return item;
    });
    localStorage.setItem("cart", JSON.stringify(update_car));
  }
  useEffect(() => {
    fetchProducts();
  }, []);
  const hendel_delet_car = (i) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const index = cart.findIndex(
      (item) => item.id == items[i]?.id && item.color == items[i]?.color
    );
    if (index === -1) handleClick("فشل في إرسال الطلب أعد المحاولة", "error");
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    let check = JSON.parse(localStorage.getItem("cart") || "[]");
    check = check.findIndex(
      (item) => item.id == items[i]?.id && item.color == items[i]?.color
    );
    if (check !== -1) {
      handleClick("فشل في إرسال الطلب أعد المحاولة", "error");
    } else {
      handleClick("تم حذف العنصر من السلة", "success");
      fetchProducts(true);
      setCart(cart);
    }
  };
  console.log(value, 5555555555);
  const handleClick = useCallback((msg, sev) => {
    setmessge(msg);
    setSeverity(sev);
    setsnack(true);
  }, []);
  useEffect(() => {
    document.documentElement.style.setProperty("--display_order", open);
    document.documentElement.style.setProperty(
      "--display_order_animation",
      open === "flex" ? "opacity_2" : null
    );
  }, [open]);
  function hendel_add_btn(i) {
    let updatearr;
    if (items[i].quantity < items[i].stock) {
      updatearr = items.map((item, x) => {
        if (x === i) {
          edit_car(i, "quantity", item.quantity + 1);
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
    } else {
      updatearr = items.map((item, x) =>
        x === i ? { ...item, quantity: items[i].quantity } : item
      );
      handleClick("الكمية غير متوفرة حاليا", "warning");
    }
    setItems(updatearr);
  }
  function hendel_minus_btn(i) {
    console.log(items[i].quantity);
    let updatearr;
    if (items[i].quantity > 1) {
      updatearr = items.map((item, x) => {
        if (x === i) {
          edit_car(i, "quantity", item.quantity - 1);
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
    } else {
      handleClick("من فضلك ادخل كمية صحيحة او احذف المنتج", "warning");
      return;
    }
    setItems(updatearr);
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
              <tbody style={{ backgroundColor: "white" }}>
                {loding ? (
                  <div className="loading_contener">
                    <div className="loader"></div>
                  </div>
                ) : (
                  <>
                    {items ? (
                      items.map((item, i) => (
                        <tr>
                          <td className="img">
                            <img
                              className="img1"
                              src={item.product}
                              alt="Product Image"
                            />
                          </td>
                          <td>{item.name}</td>
                          <td>
                            <select
                              className="Size_Color"
                              onChange={(e) => {
                                edit_car(i, "color", e.target.value);
                                setItems(
                                  items.map((item, x) =>
                                    x === i
                                      ? { ...item, color: e.target.value }
                                      : item
                                  )
                                );
                              }}
                              defaultValue={item.color}
                            >
                              {products?.map((product, i) => {
                                if (product.id === item.id) {
                                  return product.colors.map((color) => (
                                    <option
                                      value={
                                        color.color
                                          ? color.color
                                          : color.color_name
                                      }
                                    >
                                      {color.color
                                        ? color.color
                                        : color.color_name}
                                    </option>
                                  ));
                                } else {
                                  return null;
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
                              <button
                                type="button"
                                onClick={() => hendel_add_btn(i)}
                              >
                                <span className="material-symbols-outlined">
                                  add
                                </span>
                              </button>
                              <input
                                className="Quantity"
                                onChange={(e) => {
                                  let updatearr;
                                  if (
                                    e.target.value < items[i].stock + 1 &&
                                    e.target.value > 1
                                  ) {
                                    updatearr = items.map((item, x) =>
                                      x === i
                                        ? { ...item, quantity: e.target.value }
                                        : item
                                    );
                                    edit_car(i, "quantity", e.target.value);
                                  } else {
                                    fetchProducts(true);
                                    if (e.target.value < 1) {
                                      handleClick(
                                        "من فضلك أدخل الكمية",
                                        "warning"
                                      );
                                    } else {
                                      handleClick(
                                        "الكمية غير متوفرة حاليا",
                                        "warning"
                                      );
                                    }
                                  }
                                  setItems(updatearr);
                                }}
                                type="number"
                                value={items[i].quantity}
                              />
                              <button
                                type="button"
                                onClick={() => hendel_minus_btn(i)}
                              >
                                <span className="material-symbols-outlined">
                                  remove
                                </span>
                              </button>
                            </div>
                          </td>
                          <td
                            className="btn_close"
                            onClick={() => hendel_delet_car(i)}
                          >
                            <button>
                              <span className="material-symbols-outlined">
                                close
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <div className="no_data">No Product yet</div>
                    )}
                  </>
                )}
              </tbody>
            </table>
            <table className="fotter">
              <tfoot>
                <tr>
                  <td>
                    Prodect Quantity :{" "}
                    {items?.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td>
                    Total Price :{" "}
                    {items
                      ?.reduce(
                        (sum, item) => sum + Number(item.price) * item.quantity,
                        0
                      )
                      .toFixed(2)}{" "}
                    $
                  </td>
                  <td className="btn">
                    <button
                      onClick={() => {
                        setopen("flex");
                        setorder({
                          items: [
                            ...items.map((item) => ({
                              product: item.id,
                              quantity: item.quantity,
                              color: item.color,
                            })),
                          ],
                        });
                        setdelivery({
                          ...delivery,
                          items: [
                            ...items.map((item) => ({
                              product: item.id,
                              quantity: item.quantity,
                              color: item.color,
                            })),
                          ],
                        });
                      }}
                    >
                      Order New
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="Car_contener">
            <div className="Phon_contener">
              {items ? (
                items.map((item, i) => (
                  <div className="Prodect">
                    <img
                      className="img1"
                      src={item.product}
                      alt="Product Image"
                    />
                    <div className="Name_color_price">
                      <p>{item.name}</p>
                      <p>{item.price}</p>
                      <label>Color :</label>
                      <select
                        className="Size_Color"
                        onChange={(e) => edit_car(i, "color", e.target.value)}
                        defaultValue={item.color}
                      >
                        {products?.map((product, i) => {
                          if (product.id === item.id) {
                            return product.colors.map((color) => (
                              <option
                                value={
                                  color.color ? color.color : color.color_name
                                }
                              >
                                {color.color ? color.color : color.color_name}
                              </option>
                            ));
                          } else {
                            return null;
                          }
                        })}
                      </select>
                    </div>
                    <div className="Size_quantity">
                      <div className="btn_close_Phone">
                        <button onClick={() => hendel_delet_car(i)}>
                          <span className="material-symbols-outlined">
                            close
                          </span>
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
                          <span className="material-symbols-outlined">add</span>
                        </button>
                        <input
                          className="Quantity"
                          type="number"
                          onChange={(e) => {
                            let updatearr;
                            if (
                              e.target.value < items[i].stock + 1 &&
                              e.target.value > 1
                            ) {
                              updatearr = items.map((item, x) =>
                                x === i
                                  ? { ...item, quantity: e.target.value }
                                  : item
                              );
                              edit_car(i, "quantity", e.target.value);
                            } else {
                              fetchProducts(true);
                              handleClick("الكمية غير متوفرة حاليا", "warning");
                            }
                            setItems(updatearr);
                          }}
                          value={items[i]?.quantity}
                          min={1}
                        />
                        <button
                          type="button"
                          onClick={() => hendel_minus_btn(i)}
                        >
                          <span className="material-symbols-outlined">
                            remove
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no_data">No Product yet</div>
              )}
            </div>
            <table className="fotter">
              <tfoot>
                <tr>
                  <td>
                    Prodect Quantity :{" "}
                    {items?.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td>
                    Total Price :{" "}
                    {items
                      ?.reduce(
                        (sum, item) => sum + Number(item.price) * item.quantity,
                        0
                      )
                      .toFixed(2)}{" "}
                    $
                  </td>
                  <td className="btn">
                    <button
                      onClick={() => {
                        setopen("flex");
                        setorder({
                          items: [
                            ...items.map((item) => ({
                              product: item.id,
                              quantity: item.quantity,
                              color: item.color,
                            })),
                          ],
                        });
                        setdelivery({
                          ...delivery,
                          items: [
                            ...items.map((item) => ({
                              product: item.id,
                              quantity: item.quantity,
                              color: item.color,
                            })),
                          ],
                        });
                      }}
                    >
                      Order New
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </main>
      <div className="test" style={{ display: open }}>
        <div className="Order_detail">
          <div className="Product_detail">
            <div className="detail">
              {info.username === "@Anonimo" ? (
                <>
                  <label>
                    Quantity :{" "}
                    <span>
                      {items?.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </label>
                  <label>
                    Price :{" "}
                    <span>
                      {items
                        ?.reduce(
                          (sum, item) =>
                            sum + Number(item.price) * item.quantity,
                          0
                        )
                        .toFixed(2)}
                      $
                    </span>
                  </label>
                  <label>
                    payment: <span>On Delivery</span>
                  </label>
                  <div className="detail_delivery">
                    <form className="delivery">
                      <div className="Ferst_Name_order">
                        <label>Ferst Name :</label>
                        <input
                          type="text"
                          value={
                            delivery.deliveries &&
                            delivery.deliveries[0]?.first_name
                              ? delivery.deliveries[0].first_name
                              : ""
                          }
                          onChange={(e) => {
                            const newDeliveries = delivery.deliveries
                              ? [...delivery.deliveries]
                              : [{}];
                            newDeliveries[0] = {
                              ...newDeliveries[0],
                              first_name: e.target.value,
                            };
                            setdelivery({
                              ...delivery,
                              deliveries: newDeliveries,
                            });
                          }}
                          style={{
                            borderColor:
                              wrong.input === "first_name"
                                ? wrong.color
                                : "black",
                          }}
                          required
                        />
                      </div>
                      <div className="Last_Name_order">
                        <label>Last Name :</label>
                        <input
                          type="text"
                          value={
                            delivery.deliveries &&
                            delivery.deliveries[0]?.last_name
                              ? delivery.deliveries[0].last_name
                              : ""
                          }
                          onChange={(e) => {
                            const newDeliveries = delivery.deliveries
                              ? [...delivery.deliveries]
                              : [{}];
                            newDeliveries[0] = {
                              ...newDeliveries[0],
                              last_name: e.target.value,
                            };
                            setdelivery({
                              ...delivery,
                              deliveries: newDeliveries,
                            });
                          }}
                          style={{
                            borderColor:
                              wrong.input === "last_name"
                                ? wrong.color
                                : "black",
                          }}
                          required
                        />
                      </div>
                      <div className="wilaya_order" required>
                        <label>Wilaya :</label>
                        <select
                          value={wilaya}
                          onChange={(e) => {
                            setwilaya(e.target.value);
                            const newDeliveries = delivery.deliveries
                              ? [...delivery.deliveries]
                              : [{}];
                            newDeliveries[0] = {
                              ...newDeliveries[0],
                              delivery_address: {
                                ...((newDeliveries[0] &&
                                  newDeliveries[0].delivery_address) ||
                                  {}),
                                wilaya: e.target.value,
                              },
                            };
                            setdelivery({
                              ...delivery,
                              deliveries: newDeliveries,
                            });
                          }}
                          style={{
                            borderColor:
                              wrong.input === "wilaya" ? wrong.color : "black",
                          }}
                        >
                          <option value="0">-- اختر الولاية --</option>
                          {WILAYAS_DATA.map((w) => (
                            <option key={w.wilaya_code} value={w.wilaya_name}>
                              {w.wilaya_code} - {w.wilaya_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="wilaya_order" required>
                        <label>Baldya :</label>
                        <select
                          value={
                            (delivery.deliveries &&
                              delivery.deliveries[0]?.delivery_address
                                ?.baldya) ||
                            ""
                          }
                          disabled={wilaya === "0"}
                          onChange={(e) => {
                            const newDeliveries = delivery.deliveries
                              ? [...delivery.deliveries]
                              : [{}];
                            newDeliveries[0] = {
                              ...newDeliveries[0],
                              delivery_address: {
                                ...((newDeliveries[0] &&
                                  newDeliveries[0].delivery_address) ||
                                  {}),
                                baldya: e.target.value,
                              },
                            };
                            setdelivery({
                              ...delivery,
                              deliveries: newDeliveries,
                            });
                          }}
                          style={{
                            borderColor:
                              wrong.input === "wilaya" ? wrong.color : "black",
                          }}
                        >
                          <option value="فارغ">-- اختر البلدية --</option>
                          {wilaya !== "0" &&
                            WILAYAS_DATA.find(
                              (w) => w.wilaya_name === wilaya
                            )?.communes?.map((commune, idx) => (
                              <option key={idx} value={commune.commune_name}>
                                {commune.commune_name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="Phone" required>
                        <label>Phone 1:</label>
                        <input
                          inputMode="numeric"
                          pattern="[0-9]*"
                          style={{
                            appearance: "textfield",
                            borderColor:
                              wrong.input === "Phone1" ? wrong.color : "black",
                          }}
                          value={
                            delivery.deliveries &&
                            delivery.deliveries[0]?.delivery_phone &&
                            Array.isArray(
                              delivery.deliveries[0].delivery_phone
                            ) &&
                            delivery.deliveries[0].delivery_phone[0]
                              ? delivery.deliveries[0].delivery_phone[0]
                              : ""
                          }
                          onInput={(e) => {
                            e.target.value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10);
                          }}
                          onChange={(e) => {
                            const val = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10);
                            const newDeliveries = delivery.deliveries
                              ? [...delivery.deliveries]
                              : [{}];
                            const phones =
                              newDeliveries[0]?.delivery_phone &&
                              Array.isArray(newDeliveries[0].delivery_phone)
                                ? [...newDeliveries[0].delivery_phone]
                                : ["", ""];
                            phones[0] = val;
                            newDeliveries[0] = {
                              ...newDeliveries[0],
                              delivery_phone: phones,
                            };
                            setdelivery({
                              ...delivery,
                              deliveries: newDeliveries,
                            });
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
                          style={{
                            appearance: "textfield",
                            borderColor:
                              wrong.input === "Phone2" ? wrong.color : "black",
                          }}
                          value={
                            delivery.deliveries &&
                            delivery.deliveries[0]?.delivery_phone &&
                            Array.isArray(
                              delivery.deliveries[0].delivery_phone
                            ) &&
                            delivery.deliveries[0].delivery_phone[1]
                              ? delivery.deliveries[0].delivery_phone[1]
                              : ""
                          }
                          onInput={(e) => {
                            e.target.value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10);
                          }}
                          onChange={(e) => {
                            const val = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10);
                            const newDeliveries = delivery.deliveries
                              ? [...delivery.deliveries]
                              : [{}];
                            const phones =
                              newDeliveries[0]?.delivery_phone &&
                              Array.isArray(newDeliveries[0].delivery_phone)
                                ? [...newDeliveries[0].delivery_phone]
                                : ["", ""];
                            phones[1] = val;
                            newDeliveries[0] = {
                              ...newDeliveries[0],
                              delivery_phone: phones,
                            };
                            setdelivery({
                              ...delivery,
                              deliveries: newDeliveries,
                            });
                          }}
                          maxLength={10}
                        />
                      </div>
                      <div className="Confirmation">
                        <button
                          type="submit"
                          onClick={(e) => {
                            e.preventDefault();
                            Anonimo_order();
                          }}
                          className="Confirm"
                        >
                          Confirm
                        </button>
                        <button
                          className="Cancel"
                          onClick={() => setopen("none")}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <>
                  <p>{info.first_name + " " + info.last_name}</p>
                  <label>
                    Quantity :{" "}
                    <span>
                      {items?.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </label>
                  <label>
                    Price :{" "}
                    <span>
                      {items
                        ?.reduce(
                          (sum, item) =>
                            sum + Number(item.price) * item.quantity,
                          0
                        )
                        .toFixed(2)}
                      $
                    </span>
                  </label>
                  <div className="detail">
                    <label className="Phone">
                      Phone :{" "}
                      <span>
                        {Array.isArray(info.phone_numbers) &&
                        info.phone_numbers.length > 0
                          ? info.phone_numbers.filter(Boolean).join(" / ")
                          : "/"}
                      </span>
                    </label>
                    <label className="Addres">
                      Addres :{" "}
                      <span>
                        {info.address_line && info.address_line.wilaya
                          ? info.address_line.wilaya +
                            "/" +
                            info.address_line.baldya
                          : "/"}
                      </span>
                    </label>
                    <label>
                      payment: <span>On Delivery</span>
                    </label>
                  </div>
                  <div className="Confirmation">
                    <button
                      className="Confirm"
                      onClick={() => {
                        user_order();
                      }}
                    >
                      Confirm
                    </button>
                    <button className="Cancel" onClick={() => setopen("none")}>
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="warning_contener" style={{ display: warning.display }}>
          <div className="warning">
            {loding.type === "warning" && loding.value ? (
              <div className="loading_contener" style={{ height: "50px" }}>
                <div className="loader"></div>
              </div>
            ) : (
              <>
                <h1>{warning.messege}</h1>
                <div className="btn">
                  <button
                    onClick={() => setwarning({ status: "", display: "None" })}
                  >
                    Try again
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
