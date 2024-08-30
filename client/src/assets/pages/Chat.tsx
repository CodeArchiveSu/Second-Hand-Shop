import React, { useEffect, useState } from "react";
import { User, chatRoom, chatRoomResponse, state } from "../../@types";
import { useSelector } from "react-redux";
import { baseUrl } from "../utils/baseUrl";
import styles from "./Chat.module.css";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/getUser";

function Chat() {
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState<chatRoom[]>([]);
  const [LoggedinUser, setLoggedinUser] = useState<User | null>(null);

  // let LoggedinUser = useSelector((state: state) => {
  //   return state.user;
  // });

  // console.log(LoggedinUser);

  const fetchChatRooms = async () => {
    try {
      // if (!LoggedinUser) {
      //   console.log("Login first");
      //   navigate("/login");
      // }
      if (LoggedinUser) {
        const response = await fetch(
          `${baseUrl}/api/chatRooms/${LoggedinUser.id}`
        );
        const result = await response.json();
        console.log("chatrooms", result.chatRooms);
        setChatRooms(result.chatRooms);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, [LoggedinUser]);

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
        // navigate("/login");
        // setError(err);
      }
    };

    fetchUser();
  }, []);

  if (LoggedinUser) {
    console.log("이씀");
  }

  const handleClick = (id: string) => {
    //id를 가지고 있는 챗팅방을 꺼내줘
    navigate(`/request/${id}`);
  };

  return (
    <>
      <div className={styles.chatPageBox}>
        <div className={styles.cardsContainer}>
          {chatRooms.length !== 0 ? (
            chatRooms.map((items) => (
              <div className={styles.cards} key={items._id}>
                <div className={styles.cardImages}>
                  <img
                    src={items.itemId.images[items.itemId.images.length]?.url}
                    alt=""
                  />
                </div>
                <div
                  onClick={() => {
                    handleClick(items._id);
                  }}
                >
                  {items.itemId.title}
                </div>
              </div>
            ))
          ) : (
            <>No chat rooms were found</>
          )}
        </div>
      </div>
    </>
  );
}

export default Chat;
