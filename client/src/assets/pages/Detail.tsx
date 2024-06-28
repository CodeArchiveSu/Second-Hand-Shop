import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NotOKType, chatRoom, products, state } from "../../@types";
import styles from "./Detail.module.css";
import { useSelector } from "react-redux";
import { compose } from "@reduxjs/toolkit";
import { baseUrl } from "../utils/baseUrl";

type QuizParams = {
  id: string;
};

function Detail({ products }: { products: products[] }) {
  let { id } = useParams<QuizParams>();
  const eventId = id;
  console.log(eventId);

  const filteredItem = products.find((item, index) => {
    return item._id === id;
  });

  let LoggedinUser = useSelector((state: state) => {
    return state.user;
  });

  let navigate = useNavigate();

  const creatNewChatRoom = async () => {
    const headers = new Headers();

    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const body = new URLSearchParams();
    body.append("itemId", `${filteredItem?._id}`);
    body.append("userId", `${LoggedinUser?.id}`);
    body.append("sellerId", `${filteredItem?.userId}`);

    const requestOptions = {
      method: "POST",
      headers,
      body,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${baseUrl}/api/chatRooms/newRoom`,
        requestOptions as any
      );
      if (response.ok) {
        const result = (await response.json()) as chatRoom;
        console.log(`newChatRomm!`, result);
        navigate("/chat");
      }
      if (!response.ok) {
        const result = (await response.json()) as NotOKType;
        console.log("something went wrong", result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(filteredItem);

  return (
    <>
      <div>{filteredItem?.title}</div>
      <div>
        <button onClick={creatNewChatRoom}>Send message</button>
      </div>
      <div>
        {filteredItem &&
          filteredItem.images.map((item, index) => (
            <div className={styles.itemImages}>
              <img src={item.url}></img>
            </div>
          ))}
      </div>
      <div>{filteredItem?.createdAt}</div>
      <div>{filteredItem?.price}</div>
    </>
  );
}

export default Detail;
