import React, { useRef, useState } from "react";
import { baseUrl } from "../utils/baseUrl";
import { NotOKType, User } from "../../@types";

function LoginPage() {
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
    userDisplayName: "",
  });

  const [erorr, setErorr] = useState("");
  const selectedFile = useRef<File | null>(null);
  // 유저가 한번선택했다가 취소하는경우 filelise다시 0됨

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    if (e.target.files && e.target.files.length > 0) {
      selectedFile.current = e.target.files[0];
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErorr("");
    console.log("I would submit", inputValues);
    if (!inputValues.email.trim() || !inputValues.password.trim()) {
      setErorr("Credentials missing!!");
      return;
    }

    const headers = new Headers();
    // headers.append("Content-Type", "application/x-www-form-urlencoded");

    const body = new FormData();
    body.append("email", inputValues.email);
    body.append("password", inputValues.password);
    body.append("userDisplayName", inputValues.userDisplayName);
    if (selectedFile.current) {
      body.append("avatar", selectedFile.current, "[PROXY]");
    }

    const requestOptions = {
      method: "POST",
      headers,
      body,
    };

    try {
      const response = await fetch(
        `${baseUrl}/api/users/signup`,
        requestOptions
      );
      if (response.ok) {
        const result = (await response.json()) as User;
        console.log("new user!", result);
        setInputValues({ email: "", password: "", userDisplayName: "" });
      }
      if (!response.ok) {
        const result = (await response.json()) as NotOKType;
        console.log("something went wrong", result);
        setErorr(result.erorr);
      }
    } catch (error) {
      console.log(erorr);
      const { message } = error as Error;
      setErorr(message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  return (
    <div className="loginPage">
      <form className="loginForm" onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          value={inputValues.email}
          type="email"
          name="email"
          placeholder="Enter your email..."
        />
        <input
          type="password"
          name="password"
          value={inputValues.password}
          placeholder="Enter your password..."
          onChange={handleChange}
        />
        <input
          name="userDisplayName"
          value={inputValues.userDisplayName}
          placeholder="Chosse a username"
          onChange={handleChange}
        />
        <input type="file" onChange={handleFileChange} />
        <button className="accountBtn" type="submit">
          {" "}
          sign up!
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
