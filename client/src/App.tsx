import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import MainPage from "./assets/pages/MainPage";
import Favorite from "./assets/pages/Favorite";
import Upload from "./assets/pages/Upload";
import Chat from "./assets/pages/Chat";
import PersonalPage from "./assets/pages/PersonalPage";
import Navigation from "./assets/components/Navigation";
import Register from "./assets/pages/Register.js";
import Detail from "./assets/pages/Detail.js";

function App() {
  const [count, setCount] = useState(0);
  const [products, setProducts] = useState<products[]>([]);

  type products = {
    comments: string[];
    date: string;
    description: string;
    latitude: string;
    likes: number;
    longtitude: string;
    price: number;
    title: string;
    userDisplayName: string;
    userId: string;
    _id: string;
    images: string[];
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3020/api/products/all");
      const result = await response.json();
      setProducts(result.allProducts);
      console.log("상품추가됨", products);
    } catch (erorr) {
      console.log(erorr);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <div className="BrandName">⌾</div>
      <Navigation />
      <Routes>
        <Route path="/" element={<MainPage products={products} />} />
        <Route path="/detail/:id" element={<Detail products={products} />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/personalPage" element={<PersonalPage />} />
        <Route path="/Login" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
