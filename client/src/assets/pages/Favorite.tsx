import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { User, likes, state } from "../../@types";
import styles from "./Favorite.module.css";
import { useNavigate } from "react-router-dom";

export default function Favorite() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<likes[]>([]);

  let LoggedinUser = useSelector((state: state) => {
    return state.user;
  });

  const fetchFavoriteItems = async () => {
    try {
      console.log(LoggedinUser.id);
      const id = LoggedinUser.id;
      const response = await fetch(
        `http://localhost:3020/api/favoriteItems/${id}`
      );
      const result = await response.json();
      console.log("results of fetching FavoriteItems", result);
      console.log(result.favoriteItems);
      setProducts(result.favoriteItems);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFavoriteItems();
  }, [LoggedinUser]);

  return (
    <div className={styles.mainpageContainer}>
      <div className={styles.cardsContainer}>
        {products.length !== 0 ? (
          products.map((item) => (
            <div key={item._id} className={styles.cards}>
              <div className={styles.cardImages}>
                <img
                  src={
                    item.likedItemId.images[item.likedItemId.images.length - 1]
                      .url
                  }
                />
              </div>
              <div className={styles.right}>
                <div className={styles.bottom}>
                  <div>{item?.likedItemId?.title}</div>
                  <div>{item.likedItemId?.price} Euro</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <>Discover your favorite items!</>
        )}
      </div>
    </div>
  );
}
