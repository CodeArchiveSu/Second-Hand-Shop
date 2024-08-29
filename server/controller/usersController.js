import { json } from "express";
import userModel from "../models/userModel.js";
import { imageUpload } from "../utils/imageManagment.js";
import { encryptPassword, verifyPassword } from "../utils/passwordServices.js";
import { removeTempFile } from "../utils/tempFileManagement.js";
import { generateToken } from "../utils/tokenServices.js";
import ProductModel from "../models/productModel.js";

export const signup = async (req, res) => {
  console.log(req.body);
  console.log("req.file", req.file);

  //1. custom validatioin goes here

  if (!req.body.email || !req.body.password) {
    res.status(400).json({ error: "Credentials missing" });
    removeTempFile(req.file);
    return;
  }

  // 2. check if email is already exists

  try {
    const exsistingUser = await userModel.findOne({ email: req.body.email });
    if (exsistingUser) {
      res.status(500).json({ error: "Email already registered" });
      return;
    }

    if (!exsistingUser) {
      const encryptedPassword = await encryptPassword(req.body.password);
      console.log("encryptedPassword", encryptedPassword);

      if (!encryptedPassword) {
        console.log("error encrypting Password");
        res.status(401).json({
          message: 'error encrypting Password"',
        });
        return;
      }

      if (encryptedPassword) {
        const newUser = new userModel(req.body);
        newUser.password = encryptedPassword;

        if (req.file) {
          const [avatarURL, public_id] = await imageUpload(req.file, "avatars");
          newUser.avatar = { url: avatarURL, public_id: public_id }; // newUser.avatar를 객체로 설정
        }

        await newUser.save();
        //커스텀할때
        // const newUser = new userModel(req.body);
        // newUser.userDisplayName = req.body.rDisplayName
        //   ? req.body.userDisplayName
        //   : "Anonymous";
        // await newUser.save();

        const userforFront = {
          id: newUser._id,
          email: newUser.email,
          userDisplayName: newUser.userDisplayName,
          postcode: newUser.postcode,
          avatar: newUser.avatar,
        };
        res.status(200).json(userforFront);
      }
    }

    // const newUser = await userModel.create(req.body);
  } catch (error) {
    console.log(error.code);
    if (error.code == 1100) {
      res.status(500).json({ error: "Email already registered" });
      return;
    }
    res.status(500).json({ error: "Server Erorr" });
  } finally {
    removeTempFile(req.file);
  }
};

//populate

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).populate("items");
    res.status(200).json({
      number: users.length,
      users: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Sserver Erorr" });
  }
};

export const updateUser = async (req, res) => {
  try {
    //  const userToUpdate  = awaita userModel.findOne({email : })
    // const userToUpdate = await userModel.findById(req.body.id);
    // userToUpdate.userDisplayName = req.body.userDisplayName;
    // await userToUpdate.save();

    const updateUser = await userModel
      .findByIdAndUpdate(
        req.body._id,
        {
          ...req.body,
        },
        { new: true }
      )
      .select("-password");

    res.status(200).json(updateUser);
    // console.log(req.body.userDisplayName);
    // console.log(userToUpdate);
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  console.log("login", req.body);
  try {
    const exsistingUser = await userModel.findOne({ email: req.body.email });
    if (!exsistingUser) {
      res.status(401).json({
        message: "email not registered",
      });
    }

    if (exsistingUser) {
      const isPasswordCorrect = await verifyPassword(
        req.body.password,
        exsistingUser.password
      );
      console.log(isPasswordCorrect);

      const token = generateToken(exsistingUser._id);
      if (!token) {
        console.log("token went wrong");
        res.status(401).json({
          message: "problem generating token, Cannot login user",
        });
        return;
      }

      if (token) {
        // req.session.loggedIn = true;
        // req.session.user = {
        //   id: exsistingUser._id,
        //   email: exsistingUser.email,
        //   userDisplayName: exsistingUser.userDisplayName,
        //   avatar: exsistingUser.avatar,
        // };

        res.status(200).json({
          message: "Login successful",
          user: {
            id: exsistingUser._id,
            email: exsistingUser.email,
            userDisplayName: exsistingUser.userDisplayName,
            avatar: exsistingUser.avatar,
          },
          token,
        });
      }
    }
  } catch (erorr) {
    console.log(erorr);
    res.status(401).json({
      message: "something went wrong during login",
    });
  }
};

export const getUserProfile = async (req, res) => {
  console.log("user Profile function");
  console.log("user informaiton", req.user);

  if (req.user) {
    // req.session.loggedIn = true;
    // req.session.user = {
    //   id: req.user._id,
    //   email: req.user.email,
    //   userDisplayName: req.user.userDisplayName,
    //   avatar: req.user.avatar,
    // };

    res.status(200).json({
      message: "user profile information",
      user: {
        id: req.user._id,
        email: req.user.email,
        userDisplayName: req.user.userDisplayName,
        postcode: req.user.postcode,
        avatar: req.user.avatar,
      },
    });
  }
  if (!req.user) {
    res.status(401).json({
      message: "failed to get user Profile",
    });
  }
};
