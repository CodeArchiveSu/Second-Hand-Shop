import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import MainPage from "./assets/pages/MainPage";
import Favorite from "./assets/pages/Favorite";
import Upload from "./assets/pages/Upload";
import Chat from "./assets/pages/Chat";
import PersonalPage from "./assets/pages/PersonalPage";
import Navigation from "./assets/components/Navigation";
import Register from "./assets/pages/Register.js";
import Detail from "./assets/pages/Detail.js";
import { User, products, userProfile } from "./@types/index.js";
import Login from "./assets/pages/Login.js";
import { getToken, isLoggedIn } from "./assets/utils/tokensServices.js";
import { useDispatch, useSelector } from "react-redux";
import { Users, setNewProducts, setUser, setUserLoginStatus } from "./store.js";
import ProtectedRoutes from "./assets/ProtectedRoutes.js";
import ChatRequest from "./assets/pages/ChatRequest.js";
import { io } from "socket.io-client";
import ProductUpdate from "./assets/pages/ProductUpdate.js";
type state = {
  user: User;
};

function App() {
  let dispatch = useDispatch();
  const navigate = useNavigate();

  const [products, setProducts] = useState<products[]>([]);

  let LoggedinUser = useSelector((state: state) => {
    return state.user;
  });

  console.log(LoggedinUser);
  // const [user, setUser] = useState<userProfile | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `http://localhost:3020/api/products/getItem/${LoggedinUser.postcode}`
      );
      const result = await response.json();
      console.log(result);
      setProducts(result.ItemsFromSameCode);
      dispatch(setNewProducts(result.ItemsFromSameCode));
    } catch (erorr) {
      console.log(erorr);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const isLoggedInorNot = isLoggedIn();
    if (isLoggedInorNot) {
      console.log("LoggedIn");
    } else {
      console.log("LoggedOut");
    }
  }, []);

  const getUser = async () => {
    const token = getToken();
    if (!token) {
      console.log("login first");
      dispatch(setUser(null));
      return;
    }

    if (token) {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      try {
        const response = await fetch(
          "http://localhost:3020/api/users/profile",
          requestOptions
        );
        if (!response.ok && response.status == 401) {
          console.log("token invalid login again");
          navigate("/login");
          return;
        }
        if (response.ok) {
          const result = await response.json();
          console.log("Profile result", result);
          dispatch(setUser(result.user));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <div className="BrandName">⌾</div>
      <Navigation />
      <Routes>
        <Route path="/" element={<MainPage products={products} />} />
        <Route path="/detail/:id" element={<Detail products={products} />} />

        <Route element={<ProtectedRoutes />}>
          <Route
            path="/upload"
            element={<Upload products={products} setProducts={setProducts} />}
          />
          <Route path="/personalPage" element={<PersonalPage />} />
          <Route path="/favorite" element={<Favorite />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/request/:id" element={<ChatRequest />} />
        </Route>
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route
          path="/updateProduct/:id"
          element={
            <ProductUpdate products={products} setProducts={setProducts} />
          }
        />

        <Route path="*" element={<div>Huch, diese Seite gibt es nicht </div>} />
      </Routes>
    </>
  );
}

export default App;
