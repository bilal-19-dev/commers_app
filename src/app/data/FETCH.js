"use client"
import {URL} from './URL.js'

export async function apiFetch(url, options = {}) {
    let res = await fetch(url, {
      ...options,
      credentials: "include",
      cache: "no-store" 
    });
    
    if (res.status === 401) {
      const refreshRes = await fetch(
        `http://${URL}:8000/api/token/refresh`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!refreshRes.ok) {
        router.push('/');
        throw new Error("Session expired");
      }
  
      
      res = await fetch(url, {
        ...options,
        credentials: "include",
        cache: "no-store"
      });
    } 
    return res;
}

export async function Account() {
    try {
        const res = await apiFetch(`http://${URL}:8000/api/account/me/`);
        console.log(res.status)
        if (!res.ok){
            const errorData = await log.json();
            console.log("Response from /api/auth:", errorData.error , login);
            throw new Error(JSON.stringify(errorData));
        }
        const response = await res.json();
        return response
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
}