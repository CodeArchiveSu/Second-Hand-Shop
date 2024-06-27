import React, { useEffect, useState } from "react";
import styles from "./MainPage.module.css";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";
import { User, products } from "../../@types";
import { useSelector } from "react-redux";

function MainPage({ products }: { products: products[] }) {
  const navigate = useNavigate();
  type state = {
    user: User;
  };

  let LoggedinUser = useSelector((state: state) => {
    return state.user;
  });

  const handleClick = (id: string) => {
    navigate(`/detail/${id}`);
  };

  const handlelike = async (구멍: string, 두번째구멍: string) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const body = new URLSearchParams();
    body.append("likedItemId", 구멍);
    body.append("userId", 두번째구멍);

    const requestOptions = {
      method: "POST",
      headers,
      body,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "http://localhost:3020/api/products/like",
        requestOptions as any
      );
      const result = await response.json();
      console.log("likedItem", result);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(products);

  return (
    <>
      <div className={styles.mainpageContainer}>
        <div className={styles.cardsContainer}>
          {products.map((item, index) => {
            return (
              <div key={item._id} className={styles.cards}>
                <div className={styles.cardImages}>
                  <img src={item.images[0].url} />
                </div>
                <div className={styles.right}>
                  <div onClick={() => handleClick(item._id)}>{item.title}</div>
                  <div className={styles.bottom}>
                    <div className={styles.likes}>
                      <button
                        onClick={() => {
                          handlelike(item._id, LoggedinUser.id);
                        }}
                      >
                        ♡
                      </button>
                      <div>{item.likes}</div>
                    </div>
                    <div>{item.price} Euro</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default MainPage;
