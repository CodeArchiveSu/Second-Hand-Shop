import React, { useEffect, useState } from "react";
import styles from "./MainPage.module.css";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";
import { products } from "../../@types";

function MainPage({ products }: { products: products[] }) {
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    navigate(`/detail/${id}`);
  };

  return (
    <>
      <div className={styles.mainpageContainer}>
        <div className={styles.cardsContainer}>
          {products.map((item, index) => {
            return (
              <div key={item._id} className={styles.cards}>
                <div className={styles.cardImages}>
                  <img src={item.images[0]} />
                </div>
                <div className={styles.right}>
                  <div onClick={() => handleClick(item._id)}>{item.title}</div>
                  <div className={styles.bottom}>
                    <div className={styles.likes}>
                      <button>♡</button>
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
