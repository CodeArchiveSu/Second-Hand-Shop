import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users, userLogout } from "../../store";
import styles from "./PersonalPage.module.css";
import { useNavigate } from "react-router-dom";
import { NotOKType, User, products, state } from "../../@types";
import io from "socket.io-client";
import { getUser } from "../utils/getUser";

// const socket = io("http://localhost:3020");

function PersonalPage() {
  let dispatch = useDispatch();
  const navigate = useNavigate();

  const [products, setProducts] = useState<products[]>([]);
  const [error, setError] = useState("");
  const [LoggedinUser, setLoggedinUser] = useState<User | null>(null);

  // let LoggedinUser = useSelector((state: state) => {
  //   return state.user;
  // });

  // useEffect(() => {
  //   const resultFrom = getUser();
  //   console.log("유저", resultFrom);
  // }, []);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getUser();
        if (result) {
          console.log(result);
          setLoggedinUser(result.user);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        // setError(err);
      }
    };

    fetchUser();
  }, []); // 빈 배열을 넣어 컴포넌트가 처음 렌더링될 때만 실행되도록 합니다.

  const fetchItemsById = async () => {
    try {
      if (LoggedinUser) {
        const id = LoggedinUser.id;
        console.log(id);
        const response = await fetch(
          `http://localhost:3020/api/products/${id}`
        );
        const result = await response.json();
        console.log("resultById", result.Products);
        setProducts(result.Products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchItemsById();
  }, [LoggedinUser]);

  const removetoken = () => {
    localStorage.removeItem("token");
    dispatch(userLogout(null));
    navigate("/login");
  };

  const removeItem = async (itemId: any) => {
    // console.log(itemId);
    const headers = new Headers();

    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();

    urlencoded.append("_id", itemId);

    const requestOptions = {
      method: "POST",
      headers,
      body: urlencoded,
    };

    try {
      const response = await fetch(
        "http://localhost:3020/api/products/delete",
        requestOptions
      );
      if (!response.ok) {
        // Handle non-200 HTTP responses here
        const errorResult = await response.json();
        console.log(errorResult);
      } else {
        const result = await response.json();
        console.log(result);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div>
      {!LoggedinUser && <div>Loading</div>}
      <div className={styles.personalPageBox}>
        <div className={styles.cardsContainer}>
          {LoggedinUser && (
            <div className={styles.profile}>
              <div className={styles.avatar}>
                <img src={LoggedinUser.avatar.url} alt="" />
              </div>
              <div className={styles.profileRight}>
                <div>{LoggedinUser.userDisplayName}</div>
                <div>{LoggedinUser.email}</div>
                <div>{LoggedinUser.postcode}</div>
              </div>
              <button className={styles.LoggedOutBtn} onClick={removetoken}>
                Loggout
              </button>
            </div>
          )}

          {products &&
            products.map((item) => (
              <div className={styles.cards}>
                <div className={styles.cardImages}>
                  <img src={item.images[item.images.length - 1].url} alt="" />
                </div>

                <div className={styles.right}>
                  <div className={styles.title}>{item.title}</div>
                  <div className={styles.likes}>
                    <button
                      onClick={() => {
                        removeItem(item._id);
                      }}
                    >
                      X
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default PersonalPage;
