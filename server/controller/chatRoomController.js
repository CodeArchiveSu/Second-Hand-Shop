import { json } from "express";
import chatRoomModel from "../models/ChatRoom.js";
import chatDetailModel from "../models/chatDetailModel.js";

export const createNewRoom = async (req, res) => {
  console.log(req.body);
  try {
    if (!req.body.itemId || !req.body.sellerId) {
      res.status(400).json({
        message: "credentials required!",
      });
    }

    if (!req.body.userId) {
      res.status(400).json({
        message: "Login first!",
      });
    }

    const filter = { itemId: req.body.itemId, userId: req.body.userId };
    // const { itemId, userId } = req.body;
    const existing = await chatRoomModel.findOne(filter);

    if (!existing) {
      const newChatRoom = new chatRoomModel(req.body);
      await newChatRoom.save();
      res.status(200).json({
        newChatRoom: newChatRoom,
      });
    }

    if (existing) {
      //컬렉선에 찾아서
      console.log("existing", existing);
      res.status(401).json({
        chatRoomId: existing._id,
      });
    }
  } catch (error) {
    console.log("fail to create new Chat", error);
    res.status(500).json({
      error: " fail to create new Chat",
    });
  }
};

export const getChatRooms = async (req, res) => {
  // console.log(req);
  const userId = req.params.userId;
  try {
    const chatRooms = await chatRoomModel
      .find({
        $or: [{ userId: userId }, { sellerId: userId }],
      })
      .populate("userId")
      .populate("itemId")
      .populate("sellerId")
      .populate("messages");

    res.status(200).json({
      Number: chatRooms.length,
      chatRooms: chatRooms,
    });
  } catch (error) {
    res.status(400).json({
      message: "something went wrong",
    });
  }
};

export const chatRequest = async (req, res) => {
  // console.log(req);
  const chatId = req.params.chatId;
  try {
    const chatRequest = await chatRoomModel
      .find({ _id: chatId })
      .populate("userId")
      .populate("itemId")
      .populate("sellerId")
      .populate("messages");

    res.status(200).json({
      Number: chatRequest.length,
      chatRequst: chatRequest,
    });
  } catch (error) {
    res.status(400).json({
      message: "something went wrong",
    });
  }
};

//register and then update
export const sendMessage = async (req, res) => {
  try {
    const newMessage = new chatDetailModel(req.body);
    await newMessage.save();
    res.status(200).json(newMessage);
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

//updateMessage
export const updateMessage = async (req, res) => {
  console.log("update Message::::", req.body);
  try {
    const addNewMessage = await chatRoomModel.findByIdAndUpdate(
      req.body._id,
      {
        $push: { messages: req.body.messages },
      },
      { new: true }
    );
    res.status(200).json(addNewMessage);
  } catch (error) {
    console.log(error);
  }
};
