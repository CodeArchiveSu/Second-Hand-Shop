import { json } from "express";
import chatRoomModel from "../models/ChatRoom.js";

export const createNewRoom = async (req, res) => {
  console.log(req);

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

    const newChatRoom = new chatRoomModel(req.body);
    await newChatRoom.save();
    res.status(200).json({
      newChatRoom: newChatRoom,
    });
  } catch (error) {
    console.log("fail to create new Chat", error);
    res.status(500).json({
      error: " fail to create new Chat",
    });
  }
};

export const getChatRooms = async (req, res) => {
  console.log(req);
  const userId = req.params.userId;
  try {
    const chatRooms = await chatRoomModel
      .find({ userId: userId })
      .populate("userId")
      .populate("itemId")
      .populate("sellerId");

    res.status(200).json({
      chatRooms: chatRooms,
    });
  } catch (error) {
    res.status(400).json({
      message: "something went wrong",
    });
  }
};
