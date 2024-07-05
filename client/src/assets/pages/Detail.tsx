import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  NotOKType,
  chatRoom,
  chatRoomResponse,
  newchatRoomResponse,
  products,
  state,
} from "../../@types";
import styles from "./Detail.module.css";
import { useSelector } from "react-redux";
import { compose } from "@reduxjs/toolkit";
import { baseUrl } from "../utils/baseUrl";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/scrollbar";

// import required modules
import { Scrollbar } from "swiper/modules";

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

  console.log(filteredItem);

  let LoggedinUser = useSelector((state: state) => {
    return state.user;
  });

  const [ChatroomId, setChatroomId] = useState<string | null>(null);

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
        const result = (await response.json()) as newchatRoomResponse;
        console.log(`newChatRomm!`, result);
        setChatroomId(result.newChatRoom._id);
      }

      if (!response.ok) {
        const result = (await response.json()) as NotOKType;
        console.log("something went wrong", result.chatRoomId);
        setChatroomId(result.chatRoomId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (ChatroomId) {
      console.log(ChatroomId);
      navigate(`/request/${ChatroomId}`);
    }
  }, [ChatroomId, navigate]);

  // console.log(filteredItem);

  const isSeller = filteredItem?.userId == LoggedinUser.id;

  const editHandler = (productId: string) => {
    console.log(productId);
    navigate(`/updateProduct/${productId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="detailPage">
      <div className="detailBox">
        <div>{filteredItem?.title}</div>
        <div>
          <Swiper
            scrollbar={{
              hide: true,
            }}
            modules={[Scrollbar]}
            className="mySwiper"
          >
            {filteredItem &&
              filteredItem.images.map((item, index) => (
                <div className={styles.itemImages}>
                  {/* <img src={item.url}></img> */}
                  <SwiperSlide>
                    {" "}
                    <img src={item.url}></img>
                  </SwiperSlide>
                </div>
              ))}
          </Swiper>
        </div>
        <div>{formatDate("2024-06-28T09:48:00.185Z")}</div>
        <div>{filteredItem?.price} Euro</div>
        <div>
          {isSeller ? (
            <button
              className="detailBtn"
              onClick={() => {
                editHandler(filteredItem._id);
              }}
            >
              Edit
            </button>
          ) : (
            <button
              className="detailBtn"
              onClick={() => {
                creatNewChatRoom();
              }}
            >
              Send message
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Detail;
