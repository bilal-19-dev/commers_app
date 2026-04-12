"use client";
import { createContext, useContext, useState } from "react";

export const order_info = createContext(null);

export function OrderProvider({ children }) {
  const [order_form, setorder_form] = useState({});
  return (
    <order_info.Provider
      value={{
        order_form,
        setorder_form,
      }}
    >
      {children}
    </order_info.Provider>
  );
}

export const Use_order_info = () => useContext(order_info);
