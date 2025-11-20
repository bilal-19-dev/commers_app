"use client"
import { useState  } from "react"


export default function Profile_component ({data}) {
    const [input, setinput] = useState(data?.phone_numbers?.length || 1)
    const [open, setopen] = useState("none");
    const hendel_number_click = (action) => {
        let number = input;
        
        if (action === "add" && input < 3) {
            number = input + 1;
        } else if (action === "remove" && input > 1) {
            number = input - 1;
        }
        
        setinput(number);
    }
    return (
        <main>
            <div className="profile_contener">
                <div className="contener" style={{display : open}}>
                    <div className="Btn_close">
                        <button
                            onClick={() => {
                                setopen("none");
                            }}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div className="edit_img">
                        <img src={"http://192.168.1.192:8000/" + data.image}></img>
                    </div>
                    <label>Full Name :</label>
                    <input type="text" value={`${data.first_name} ${data.last_name}`} readOnly />
                    <label>Email :</label>
                    <input type="email" value={data.email ? data.email : "@gmail.com"} readOnly />
                    <label>Phone Number :</label>
                    {[...Array(input)].map((_, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", margin :"2px" }}>
                            <input
                                type="text"
                                value={data.phone_numbers[i] || ""}
                                readOnly
                                placeholder={`رقم الهاتف ${i + 1}`}
                            />
                            {input > 1 && (
                                <button className="remove" onClick={() => hendel_number_click("remove")}>
                                    <span className="material-symbols-outlined">
                                        remove
                                    </span>
                                </button>
                            )}
                        </div>
                    ))}
                    <button 
                        className="add" 
                        onClick={() => hendel_number_click("add")}
                        disabled={input >= 3}
                        style={{ opacity: input >= 3 ? 0.5 : 1 }}
                    >
                        <span className="material-symbols-outlined">
                            add
                        </span>
                    </button>
                    <label>Wilaya :</label>
                    <input type="text" value={data.address_line.Wilaya ? data.address_line.Wilaya : null}/>
                    <label>Baldya</label>
                    <input type="text" value={data.address_line.Baldya ? data.address_line.Baldya : null}/>
                    <label>Stret</label>
                    <input type="text" value={data.address_line.Stret ? data.address_line.Stret : null}/>
                </div>
                <div className="info">
                    <div className="img">
                        <img src={"http://192.168.1.192:8000/" + data.image}></img>
                        <div>
                            <h1>{data.first_name} {data.last_name}</h1>
                            <p className="status">status : <span>Active</span></p>
                            <p className="user_name">@{data.username}</p>
                        </div>
                    </div>
                    <div className="edit">
                        <button 
                            onClick={() => {
                                setopen("initial");
                            }}
                        >Edit...
                            <span className="material-symbols-outlined">
                            edit
                            </span>
                        </button>
                    </div>
                </div>
                <div className="detail">
                    <label>Email :</label>
                    <p>{data.email ? data.email : "@gmail.com"}</p>
                    <label>Phone Number :</label>
                    {Array.isArray(data.phone_numbers) && data.phone_numbers.length > 0
                        ? data.phone_numbers.map((number, i) => (
                            <p key={i}>{number}</p>
                        ))
                        : <p>No Phone Numbers</p>}
                    <label>Address</label>
                    <p>
                        {(data.address_line.Wilaya && data.address_line.Baldya && data.address_line.Stret)
                            ? `${data.address_line.Wilaya}, ${data.address_line.Baldya}, ${data.address_line.Stret}`
                            : "No Address"}
                    </p>
                </div>
            </div>
        </main>
    )
}