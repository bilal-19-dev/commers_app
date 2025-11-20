"use client"
import { createContext , useContext , useState } from "react";

export const login = createContext()

export function Login_info ({children}) {
    const [value , setdata] = useState ({
        username : "" ,
        password : ""
    })
    const send_user = (info) => setdata(info)
    return (
        <>
            <login.Provider value={{value , send_user}}>
                {children}
            </login.Provider>
        </>
    )
}

export const Use_Login = () => useContext(login)