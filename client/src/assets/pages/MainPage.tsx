import React, { useEffect, useState } from "react";
import styles from "./MainPage.module.css";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";
import { User, likes, products } from "../../@types";
import { useSelector } from "react-redux";
import { isHtmlElement } from "react-router-dom/dist/dom";

function MainPage({ products }: { products: products[] }) {
  const navigate = useNavigate();

  type state = {
    user: User;
  };

  let LoggedinUser = useSelector((state: state) => {
    return state.user;
  });

  const [favoriteProducts, setFavoriteProducts] = useState<likes[]>([]);
  const [reload, setRelaod] = useState(false);

  //여기 아이템이랑

  const handleClick = (id: string) => {
    navigate(`/detail/${id}`);
  };

  const fetchFavoriteItems = async () => {
    try {
      const id = LoggedinUser.id;
      const response = await fetch(
        `http://localhost:3020/api/favoriteItems/${id}`
      );
      const result = await response.json();
      console.log("favoriteItems", result.favoriteItems);
      setFavoriteProducts(result.favoriteItems);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (LoggedinUser) {
      fetchFavoriteItems();
    }
  }, [LoggedinUser, reload]);

  const isFavorite = (productId: string) => {
    return favoriteProducts.some(
      (product) => product.likedItemId?._id === productId
    );
  };

  const handlelike = async (구멍: string, 두번째구멍: string) => {
    //만약에  fav에 이미 있는 아이템이면, 삭제

    setRelaod((prev) => !prev);
    // console.log(prev)
    const alreadyLiked = favoriteProducts.find((item, index) => {
      return item.likedItemId._id === 구멍;
    });

    if (alreadyLiked) {
      console.log("alreadliked");

      const headers = new Headers();
      headers.append("Content-Type", "application/x-www-form-urlencoded");

      const body = new URLSearchParams();
      body.append("_id", 구멍);
      body.append("userId", 두번째구멍);

      const requestOptions = {
        method: "POST",
        headers,
        body,
      };

      try {
        const response = await fetch(
          `http://localhost:3020/api/favoriteItems/unlike?_id=${구멍}&userId=${두번째구멍}`,
          requestOptions
        );
        if (response.ok) {
          const result = await response.json();
          console.log("removing this item", result);
          setRelaod((prev) => !prev);
          console.log(reload);
        }
        if (!response.ok) {
          console.log("something went wrong");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      const headers = new Headers();
      headers.append("Content-Type", "application/x-www-form-urlencoded");
      const body = new URLSearchParams();
      body.append("likedItemId", 구멍);
      body.append("userId", 두번째구멍);
      const requestOptions = {
        method: "POST",
        headers,
        body,
      };
      try {
        const response = await fetch(
          "http://localhost:3020/api/products/like",
          requestOptions
        );
        if (response.ok) {
          const result = await response.json();
          console.log("likedItem", result);
          setRelaod((prev) => !prev);
          console.log(reload);
        }
        if (!response.ok) {
          console.log("something went wrong");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // const isFavorite = (productId: string) => {
  //   return favoriteProducts.some((product) => product._id === productId);
  // };

  return (
    <>
      <div className={styles.mainpageContainer}>
        <div className={styles.cardsContainer}>
          {products.length !== 0 ? (
            products.map((item, index) => {
              return (
                <div key={item._id} className={styles.cards}>
                  <div className={styles.cardImages}>
                    <img src={item.images[0].url} />
                  </div>
                  <div className={styles.right}>
                    <div onClick={() => handleClick(item._id)}>
                      {item.title}
                    </div>
                    <div className={styles.bottom}>
                      <div className={styles.likes}>
                        <button
                          onClick={() => {
                            handlelike(item._id, LoggedinUser.id);
                          }}
                        >
                          {isFavorite(item._id) ? "❤️" : "♡"}
                        </button>
                      </div>
                      <div>{item.price} Euro</div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div>Looks Like It’s a Ghost Town</div>
          )}
        </div>
      </div>
    </>
  );
}

export default MainPage;
