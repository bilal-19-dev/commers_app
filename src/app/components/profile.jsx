"use client";
import { useState, useEffect, useCallback } from "react";
import { WILAYAS_DATA } from "../data/Wilaya.js";
import { URL } from "../data/URL.js";
import { Account } from "../data/FETCH.js";
import { Use_them } from "../hooks/ThemProvider";
export default function Profile_component({ data }) {
  const [loding, setloding] = useState({
    value: true,
    hight: "356px",
    width: "247.5px",
  });
  const { setmessge, setSeverity, setsnack } = Use_them();
  const [info, setinfo] = useState({});
  const handleClick = useCallback((msg, sev) => {
    setmessge(msg);
    setSeverity(sev);
    setsnack(true);
  }, []);
  useEffect(() => {
    const fetchaccount = async () => {
      try {
        setloding({ value: true, hight: "356px", width: "247.5px" });
        const account = await Account();
        setinfo(account.user);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setloding({ value: false, hight: "356px", width: "247.5px" });
      }
    };
    fetchaccount();
  }, []);
  const [input, setinput] = useState(
    (info.address_line && info?.phone_numbers?.length) || 1
  );
  const [open, setopen] = useState("none");
  const [wilaya, setwilaya] = useState(
    info.address_line && info?.address_line?.wilaya !== "0"
      ? WILAYAS_DATA.find((w) => w.wilaya_name === info.address_line.wilaya)
          ?.wilaya_code
      : "0"
  );
  const [form, setform] = useState({
    first_name: "",
    last_name: "",
    phone_numbers: [],
    username: "",
    email: "",
    address_line: {},
  });
  const [wrong, setwrong] = useState({ color: "red", input: "" });
  const hendel_number_click = (action) => {
    let number = input;

    if (action === "add" && input < 3) {
      number = input + 1;
    } else if (action === "remove" && input > 1) {
      number = input - 1;
    }

    setinput(number);
  };
  const hendel_click = async () => {
    const from_data = new FormData();
    // Validate first name if changed
    if (form.first_name !== info.first_name) {
      if (form.first_name.trim().length < 3) {
        setwrong({ ...wrong, input: "first_name" });
        return;
      } else {
        from_data.append("first_name", form.first_name.trim());
      }
    }

    // Validate last name if changed
    if (form.last_name !== info.last_name) {
      if (form.last_name.trim().length < 3) {
        setwrong({ ...wrong, input: "last_name" });
        return;
      } else {
        from_data.append("last_name", form.last_name.trim());
      }
    }

    // Validate username if changed
    if (form.username !== info.username) {
      if (form.username.trim().length < 3 && !form.username.startsWith("@")) {
        setwrong({ ...wrong, input: "username" });
        return;
      } else {
        from_info.append("username", form.username.trim());
      }
    }

    // Validate email if changed
    if (form.email !== info.email) {
      if (
        !form.email.endsWith("@gmail.com") ||
        !form.email.includes(".") ||
        form.email.trim().length < 6
      ) {
        setwrong({ ...wrong, input: "email" });
        return;
      } else {
        from_info.append("email", form.email.trim());
      }
    }

    // Validate phone numbers if changed
    if (
      form.phone_numbers &&
      form.phone_numbers.length > 0 &&
      JSON.stringify(form.phone_numbers) !== JSON.stringify(info.phone_numbers)
    ) {
      const valid = form.phone_numbers.every(
        (p, idx) => p && /^(05|06|07|02)\d{8}$/.test(p)
      );
      if (!valid) {
        setwrong({ ...wrong, input: "phone_numbers" });
        return;
      }
      from_data.append("phone_numbers", JSON.stringify(form.phone_numbers));
    }

    // Validate address_line if changed
    if (
      form.address_line &&
      JSON.stringify(form.address_line) !== JSON.stringify(info.address_line)
    ) {
      if (
        !form.address_line.wilaya ||
        form.address_line.wilaya === "0" ||
        !form.address_line.baldya ||
        form.address_line.baldya === ""
      ) {
        setwrong({ ...wrong, input: "address_line" });
        return;
      }
      from_data.append("address_line", JSON.stringify(form.address_line));
    }
    if (form.image) {
      from_data.append("image", form.image);
    }
    console.log([...from_data.entries()]);
    try {
      const res = await fetch(`http://${URL}:8000/api/account/${info.id}/`, {
        method: "PATCH",
        body: from_data,
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
      handleClick("تم تحديث الملف الشخصي", "success");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main>
      <div className="profile_contener">
        {loding.value === true ? (
          <div className="loading_contener">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <div className="contener" style={{ display: open }}>
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
                <div className="img">
                  <img
                    src={
                      form.image
                        ? window.URL.createObjectURL(form.image)
                        : info.image
                    }
                  ></img>
                </div>
                <div className="input">
                  <label htmlFor="file_input">
                    <span className="material-symbols-outlined">edit</span>
                  </label>
                  <input
                    id="file_input"
                    type="file"
                    name="image"
                    accept=".jpg, .jpeg, .png, .gif, .bmp, .tiff, .tif, .webp, .ico, .ppm, .pgm, .pbm, .eps"
                    onChange={(e) =>
                      setform({ ...form, image: e.target.files[0] })
                    }
                  />
                </div>
              </div>
              <div className="Name">
                <div>
                  <label>First Name :</label>
                  <input
                    type="text"
                    value={form.first_name}
                    placeholder={info.first_name}
                    onChange={(e) =>
                      setform({ ...form, first_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Last Name :</label>
                  <input
                    type="text"
                    value={form.last_name}
                    placeholder={info.last_name}
                    onChange={(e) =>
                      setform({ ...form, last_name: e.target.value })
                    }
                  />
                </div>
              </div>
              <label>Username :</label>
              <input
                type="text"
                value={form.username}
                placeholder={info.username}
                onChange={(e) => setform({ ...form, username: e.target.value })}
              />
              <label>Email :</label>
              <input
                type="email"
                value={form.email}
                placeholder={info.email}
                onChange={(e) => setform({ ...form, email: e.target.value })}
              />
              <label>Phone Number :</label>
              {[...Array(input)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "2px",
                  }}
                >
                  <input
                    type="text"
                    value={
                      form.phone_numbers[i] !== undefined
                        ? form.phone_numbers[i]
                        : ""
                    }
                    placeholder={
                      info.phone_numbers && info.phone_numbers[i]
                        ? info.phone_numbers[i]
                        : `رقم الهاتف ${i + 1}`
                    }
                    onChange={(e) => {
                      const newNumbers = form.phone_numbers.slice();
                      newNumbers[i] = e.target.value;
                      setform({ ...form, phone_numbers: newNumbers });
                    }}
                  />
                  {input > 1 && (
                    <button
                      type="button"
                      className="remove"
                      onClick={() => hendel_number_click("remove")}
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="add"
                onClick={() => hendel_number_click("add")}
                disabled={input >= 3}
                style={{ opacity: input >= 3 ? 0.5 : 1 }}
              >
                <span className="material-symbols-outlined">add</span>
              </button>
              <div className="wilaya">
                <label>Wilaya :</label>
                <select
                  value={
                    wilaya !== undefined && wilaya !== null
                      ? wilaya
                      : info.address_line.wilaya_code || "0"
                  }
                  onChange={(e) => {
                    setwilaya(e.target.value);
                    setform({
                      ...form,
                      address_line: {
                        ...form.address_line,
                        wilaya:
                          WILAYAS_DATA.find(
                            (w) => w.wilaya_code === e.target.value
                          )?.wilaya_name || "0",
                        baldya: "",
                      },
                    });
                  }}
                >
                  <option value="0">
                    {info.address_line && info.address_line.wilaya
                      ? `${info.address_line.wilaya_code || ""} - ${
                          info.address_line.wilaya
                        }`
                      : "-- اختر الولاية --"}
                  </option>
                  {WILAYAS_DATA.map((w) => (
                    <option key={w.wilaya_code} value={w.wilaya_code}>
                      {w.wilaya_code} - {w.wilaya_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="wilaya">
                <label>Baldya :</label>
                <select
                  value={
                    form.address_line.baldya !== undefined
                      ? form.address_line.baldya
                      : ""
                  }
                  disabled={wilaya === "0"}
                  onChange={(e) =>
                    setform({
                      ...form,
                      address_line: {
                        ...form.address_line,
                        wilaya:
                          WILAYAS_DATA.find((w) => w.wilaya_code === wilaya)
                            ?.wilaya_name || "",
                        baldya: e.target.value,
                      },
                    })
                  }
                >
                  <option value="">
                    {data.address_line && data.address_line.baldya
                      ? data.address_line.baldya
                      : "-- اختر البلدية --"}
                  </option>
                  {wilaya !== "0" &&
                    WILAYAS_DATA.find(
                      (w) => w.wilaya_code === wilaya
                    )?.communes?.map((commune, idx) => (
                      <option key={idx} value={commune.commune_name}>
                        {commune.commune_name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="btn">
                <button
                  type="button"
                  onClick={() => {
                    hendel_click();
                    setopen("none");
                    window.location.reload();
                  }}
                >
                  {" "}
                  Send{" "}
                </button>
              </div>
            </div>
            <div className="info">
              <div className="img">
                <img src={info.image}></img>
                <div>
                  <h1>
                    {info.first_name} {info.last_name}
                  </h1>
                  {info.checked ? (
                    <p className="status">
                      status : <span>Active</span>
                    </p>
                  ) : (
                    <p className="status">
                      status :{" "}
                      <span style={{ backgroundColor: "red" }}>Disactive</span>
                    </p>
                  )}
                  <p className="user_name">{info.username}</p>
                </div>
              </div>
              <div className="edit">
                {info.username !== "@Anonimo" ? (
                  <button
                    onClick={() => {
                      setopen("initial");
                      setform({
                        first_name: info.first_name || "",
                        last_name: info.last_name || "",
                        phone_numbers: Array.isArray(info.phone_numbers)
                          ? info.phone_numbers.slice()
                          : [],
                        username: info.username || "",
                        email: info.email || "",
                        address_line: {
                          wilaya: info.address_line?.wilaya || "0",
                          baldya: info.address_line?.baldya || "",
                        },
                      });
                      setwilaya(
                        info.address_line.wilaya !== "0"
                          ? WILAYAS_DATA.find(
                              (w) => w.wilaya_name === info.address_line.wilaya
                            )?.wilaya_code || "0"
                          : "0"
                      );
                      setinput(
                        Array.isArray(info.phone_numbers)
                          ? info.phone_numbers.length
                          : 1
                      );
                    }}
                  >
                    Edit...
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="detail">
              <label>Email :</label>
              <p>{info.email ? info.email : "@gmail.com"}</p>
              <label>Phone Number :</label>
              {Array.isArray(info.phone_numbers) &&
              info.phone_numbers.length > 0 ? (
                info.phone_numbers.map((number, i) => <p key={i}>{number}</p>)
              ) : (
                <p>No Phone Numbers</p>
              )}
              <label>Address</label>
              <p>
                {info.address_line.wilaya && info.address_line.baldya
                  ? `${info.address_line.wilaya} / ${info.address_line.baldya}`
                  : "No Address"}
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
