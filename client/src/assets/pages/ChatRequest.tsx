import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../utils/baseUrl";
import { NotOKType, User, messageSent, products, state } from "../../@types";
import { useSelector } from "react-redux";
import { Socket, io } from "socket.io-client";
import styles from "./ChatRequest.module.css";

type responseOK = {
  chatRequst: ChatRequest[];
};

type ChatRequest = {
  _id: string;
  sellerId: chatUser;
  itemId: products;
  userId: chatUser;
  messages: message[];
};

type message = {
  updatedAt: string;
  message: string;
  chatUserId: string;
  chatUserName: string;
};

type chatUser = {
  email: string;
  userDisplayName: string;
  avatar: string;
  _id: string;
};

function ChatRequest() {
  let { id } = useParams();
  const eventId = id;
  //   console.log(eventId);

  let LoggedinUser = useSelector((state: state) => {
    return state.user;
  });

  const [request, setRequest] = useState<chatUser>();
  const [seller, setSeller] = useState<chatUser>();
  const [item, setItem] = useState<products>();
  const [chatRoomId, setChatRoomId] = useState<string>();
  const [messageValue, setMessageValue] = useState<string>();
  const [messageId, setMessageId] = useState<string>();
  const [messageSent, setMessageSent] = useState(false);
  const [messages, setMessages] = useState<message[]>([]);
  const [LoggedinMessages, setLoggedinMessages] = useState<message[]>([]);
  const [answerMessages, setanswerMessages] = useState<message[]>([]);

  // const socketRef = useRef<Socket | null>(null);
  // console.log("aInfinite loop???");
  const socket = io("http://localhost:3020");
  console.log("socket>>>>", socket);

  useEffect(() => {
    console.log("USEFFECT 1 run");
    // socket.current = io("http://localhost:3020");
    // if (!socketRef.current) {
    //   socketRef.current = io("http://localhost:3020");
    // }

    // console.log(socketRef.current);

    if (chatRoomId) {
      console.log("askingjoing");
      socket.emit("ask-join", chatRoomId);
      console.log("socket:::", socket);
    }

    if (socket) {
      socket.removeListener("message-broadcast");
      socket.on("message-broadcast", (data) => {
        console.log("실행중", data);
        setMessages((prevMessages) => {
          return [...prevMessages, data];
        });
        console.log(messages);
      });
    }

    return () => {
      if (socket) {
        socket.off("ask-join").off();
        socket.off("message-broadcast").off();
        socket.close();
        // socket = null;
      }
    };
    // }, [chatRoomId, messageSent]);
  }, [socket]);
  // }, []);

  // useEffect(() => {
  //   if (socketRef.current) {
  //     console.log("실행전");
  //     socketRef.current.on("message-broadcast", (data) => {
  //       console.log("실행중", data);
  //       setMessages((prevMessages) => {
  //         return [...prevMessages, data];
  //       });
  //     });
  //     console.log("끝");
  //   }
  //   return () => {
  //     if (socketRef.current) {
  //       socketRef.current.off("message-broadcast");
  //       console.log("어프");
  //     }
  //   };
  // }, [messageSent]);

  // useEffect(() => {
  //   if (chatRoomId) {
  //     // socket.emit("ask-join", chatRoomId);
  //     console.log(socket);
  //   }
  // }, [chatRoomId, socket]);

  const emitMessage = () => {
    if (socket) {
      socket.emit("message-send", {
        chatUserId: `${LoggedinUser.id}`,
        chatUserName: `${LoggedinUser.userDisplayName}`,
        message: `${messageValue}`,
        room: `${chatRoomId}`,
      });

      return () => {
        if (socket) {
          socket.close();
        }
      };
    }
  };

  const requstDetail = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/chatRooms/request/${eventId}`
      );
      const result = (await response.json()) as responseOK;
      // console.log(result);
      setRequest(result.chatRequst[0].userId);
      setSeller(result.chatRequst[0].sellerId);
      setItem(result.chatRequst[0].itemId);
      setChatRoomId(result.chatRequst[0]._id);
      setMessages(result.chatRequst[0].messages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("UseEffect 2 run");
    requstDetail();
    // }, [eventId]);
  }, []);

  //input value set
  const saveMessageValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageValue(e.target.value);
  };

  const sendMessage = async () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const body = new URLSearchParams();
    body.append("message", `${messageValue}`);
    body.append("chatUserId", `${LoggedinUser.id}`);
    body.append("chatUserName", `${LoggedinUser.userDisplayName}`);

    const requestOptions = {
      method: "POST",
      headers,
      body,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "http://localhost:3020/api/chatRooms/sendMessage",
        requestOptions as any
      );
      if (response.ok) {
        const result = (await response.json()) as messageSent;
        console.log("new message!", result);
        setMessageValue("");
        setMessageId(result._id);

        setMessageSent((prevState) => !prevState); // Toggle state to trigger useEffect
      }
      if (!response.ok) {
        const result = (await response.json()) as NotOKType;
        console.log("something went wrong", result);
        setMessageSent(false);
      }
    } catch (error) {
      console.log(error);
      setMessageSent(false);
    }
  };

  const updateMessage = async () => {
    if (messageId) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      const urlencoded = new URLSearchParams();
      urlencoded.append("itemId", `${item?._id}`);
      urlencoded.append("userId", `${request?._id}`);
      urlencoded.append("sellerId", `${seller?._id}`);
      urlencoded.append("messages", `${messageId}`);
      urlencoded.append("_id", `${chatRoomId}`);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
      };

      try {
        const response = await fetch(
          "http://localhost:3020/api/chatRooms/updateMessage",
          requestOptions as any
        );

        if (response.ok) {
          const result = await response.json();
          console.log("new updated message!", result);
        }
        if (!response.ok) {
          const result = (await response.json()) as NotOKType;
          console.log("something went wrong", result);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    updateMessage();
  }, [messageSent]);
  // }, []);

  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // messages가 변경될 때마다 자동으로 스크롤

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.chatBox}>
      {/* <div>{seller?.userDisplayName} :HI</div>
      <div>{request?.userDisplayName} : HI</div> */}
      <div className={styles.messageBox}>
        {messages &&
          messages.map((item, index) => (
            <div
              className={`${styles.messageContainer} ${
                item.chatUserId === LoggedinUser.id ? styles.right : styles.left
              }`}
              key={index}
            >
              <div>
                <div className={styles.message}>{item.message}</div>
                <div>{item.chatUserName}</div>
              </div>
            </div>
          ))}
        <div ref={messageEndRef} /> {/* Empty div to scroll into view */}
      </div>

      <div className={styles.chatBottom}>
        <input
          value={messageValue}
          onChange={(e) => {
            saveMessageValue(e);
          }}
        ></input>
        <button
          className="accountBtn"
          onClick={() => {
            sendMessage();
            emitMessage();
            scrollToBottom();
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}

export default ChatRequest;
