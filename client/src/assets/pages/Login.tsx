import React, { useEffect, useRef, useState } from "react";
import { baseUrl } from "../utils/baseUrl";
import { LoinOkResponse, NotOKType, User } from "../../@types";
import { useDispatch, useSelector } from "react-redux";
import { Users, setUser, userLogout } from "../../store";
import {
  Navigate,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { io } from "socket.io-client";

function LoginPage() {
  let dispatch = useDispatch();
  let navigate = useNavigate();

  type state = {
    user: User;
  };

  let LoggedinUser = useSelector((state: state) => {
    return state.user;
  });

  if (LoggedinUser) {
    console.log("LoggedinUser exisit");
  }

  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
  });

  const [erorr, setErorr] = useState("");
  const location = useLocation();

  // 유저가 한번선택했다가 취소하는경우 filelise다시 0됨

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErorr("");
    console.log("I would submit", inputValues);
    if (!inputValues.email.trim() || !inputValues.password.trim()) {
      setErorr("Credentials missing!!");
      return;
    }

    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const body = new URLSearchParams();
    body.append("email", inputValues.email);
    body.append("password", inputValues.password);

    const requestOptions = {
      method: "POST",
      headers,
      body,
    };

    try {
      const response = await fetch(
        `${baseUrl}/api/users/login`,
        requestOptions
      );

      if (response.ok) {
        const result = (await response.json()) as LoinOkResponse;
        //1. check if token is in the response
        if (result.token) {
          localStorage.setItem("token", result.token);
        }
        dispatch(setUser(result.user));

        console.log(" user logge in!", result);
        setInputValues({ email: "", password: "" });

        const from = location?.state?.redirectedFrom?.pathname || "/";
        console.log(from);
        navigate(from);
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

  const removetoken = () => {
    localStorage.removeItem("token");
    dispatch(userLogout(null));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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

        <button type="submit"> Login!</button>
      </form>
      <button onClick={removetoken}> Loggout</button>
      <p>{erorr}</p>
    </div>
  );
}

export default LoginPage;
