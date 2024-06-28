import React, { useEffect, useState } from "react";
import { chatRoom, chatRoomResponse, state } from "../../@types";
import { useSelector } from "react-redux";
import { baseUrl } from "../utils/baseUrl";
import styles from "./Chat.module.css";

function Chat() {
  const [chatRooms, setChatRooms] = useState<chatRoom[]>([]);
  let LoggedinUser = useSelector((state: state) => {
    return state.user;
  });

  const fetchChatRooms = async () => {
    try {
      if (!LoggedinUser) {
        console.log("Login first");
      }

      const response = await fetch(
        `${baseUrl}/api/chatRooms/${LoggedinUser.id}`
      );
      const result = await response.json();
      console.log("chatrooms", result);
      setChatRooms(result.chatRooms);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (LoggedinUser) {
      fetchChatRooms();
    }
  }, [LoggedinUser]);

  return (
    <>
      <div className={styles.chatPageBox}>
        Chat
        <div className={styles.cardsContainer}>
          {chatRooms &&
            chatRooms.map((items) => (
              <div className={styles.cards} key={items._id}>
                <div className={styles.cardImages}>
                  <img src={items.itemId.images[0].url} alt="" />
                </div>
                <div>{items.itemId.title}</div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default Chat;
