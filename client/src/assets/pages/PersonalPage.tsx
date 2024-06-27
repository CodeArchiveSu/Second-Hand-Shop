import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users, initialState, userLogout } from "../../store";
import styles from "./PersonalPage.module.css";
import { useNavigate } from "react-router-dom";
import { User, products } from "../../@types";
import io from "socket.io-client";

type state = {
  user: User;
};

// const socket = io("http://localhost:3020");

function PersonalPage() {
  let dispatch = useDispatch();
  const navigate = useNavigate();

  let LoggedinUser = useSelector((state: state) => {
    return state.user;
  });

  console.log("LoggedinUser in personal PAge", LoggedinUser);

  const [products, setProducts] = useState<products[]>([]);

  const fetchItemsById = async () => {
    try {
      const id = LoggedinUser.id;
      console.log(id);
      const response = await fetch(`http://localhost:3020/api/products/${id}`);
      const result = await response.json();
      console.log("resultById", result.Products);
      setProducts(result.Products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (LoggedinUser) {
      fetchItemsById();
    }

    // socket.on("productDeleted", (deletedProduct) => {
    //   setProducts((prevProducts) =>
    //     prevProducts.filter((product) => product._id !== deletedProduct._id)
    //   );
    // });

    // return () => {
    //   socket.off("productDeleted");
    // };
  }, [LoggedinUser]);

  const removetoken = () => {
    localStorage.removeItem("token");
    dispatch(userLogout(null));
    navigate("/login");
  };

  const removeItem = (itemId: any) => {
    // console.log(itemId);
    const headers = new Headers();

    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();

    urlencoded.append("_id", itemId);

    const requestOptions = {
      method: "POST",
      headers,
      body: urlencoded,
      redirect: "follow",
    };

    fetch("http://localhost:3020/api/products/delete", requestOptions as any)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      {!LoggedinUser && <div>Loading</div>}
      <div className={styles.personalPageBox}>
        <div className={styles.cardsContainer}>
          {LoggedinUser && (
            <>
              <img src={LoggedinUser.avatar} alt="" />
              <div>{LoggedinUser.userDisplayName}</div>
              <div>{LoggedinUser.email}</div>
            </>
          )}

          {products &&
            products.map((item) => (
              <div className={styles.cards}>
                <div className={styles.title}>{item.title}</div>
                <div className={styles.cardImages}>
                  <img src={item.images[0].url} alt="" />
                  <button
                    onClick={() => {
                      removeItem(item._id);
                    }}
                  >
                    X
                  </button>
                </div>

                <div>{item.title}</div>
              </div>
            ))}
          <button onClick={removetoken}>Loggout</button>
        </div>
      </div>
    </div>
  );
}

export default PersonalPage;
