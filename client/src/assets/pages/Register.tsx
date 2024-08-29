import React, { useRef, useState } from "react";
import { baseUrl } from "../utils/baseUrl";
import { NotOKType, User } from "../../@types";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
    userDisplayName: "",
    postcode: "",
  });

  const [display, setDisplay] = useState("");

  const [fileName, setFileName] = useState("Select a profile picture");

  const [erorr, setErorr] = useState("");
  const selectedFile = useRef<File | null>(null);
  // 유저가 한번선택했다가 취소하는경우 filelise다시 0됨

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      selectedFile.current = e.target.files[0];
      setFileName(file.name);
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
    body.append("postcode", inputValues.postcode);
    if (selectedFile.current) {
      body.append("avatar", selectedFile.current);
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
        setInputValues({
          email: "",
          password: "",
          userDisplayName: "",
          postcode: "",
        });
        setTimeout(() => {
          navigate("/login");
        }, 1000);

        setDisplay("show");
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
        <input
          name="postcode"
          value={inputValues.postcode}
          placeholder="Postcode"
          onChange={handleChange}
        />
        {/* <input type="file" onChange={handleFileChange} /> */}
        <div className="file-input-wrapper">
          <label className="file-label">
            <input
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }} // Hide the default file input
            />

            {fileName == "" ? <div>select a profile picture</div> : fileName}
          </label>
          {/* <span>{fileName}</span> */}
        </div>
        <button className="accountBtn" type="submit">
          {" "}
          SIGN UP
        </button>
      </form>

      <div className={"modal hide" + display}>Successfully Registered !</div>
    </div>
  );
}

export default LoginPage;
