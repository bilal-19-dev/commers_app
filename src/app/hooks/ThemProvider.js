"use client";
import { createContext, useContext, useState, useEffect } from "react";

export const them = createContext(null);

export function ThemProvider({ children }) {
  const [message, setmessge] = useState("This is a dynamic message!");
  const [severity, setSeverity] = useState("success");
  const [snack, setsnack] = useState(false);
  const [cart, setCart] = useState([]);
  const [loged, setloged] = useState();
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  return (
    <them.Provider
      value={{
        message,
        setmessge,
        severity,
        setSeverity,
        snack,
        setsnack,
        cart,
        setCart,
        loged,
        setloged,
      }}
    >
      {children}
    </them.Provider>
  );
}

export const Use_them = () => useContext(them);
