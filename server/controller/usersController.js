import userModel from "../models/userModel.js";
import { imageUpload } from "../utils/imageManagment.js";

export const signup = async (req, res) => {
  console.log(req.body);
  console.log("req.file", req.file);

  if (!req.body.email || !req.body.password) {
    res.status(400).json({ error: "Credentials missing" });
    removeTempFile(req.file);
    return;
  }

  try {
    const exsistingUser = await userModel.findOne({ email: req.body.email });
    if (exsistingUser) {
      res.status(500).json({ error: "Email already registered" });
      return;
    }
    const newUser = await userModel.create(req.body);

    if (req.file) {
      const [avatarURL, public_id] = await imageUpload(req.file, "avatars");
      // console.log("이거임", avatarURL);
      newUser.avatar = { url: avatarURL, public_id: public_id }; // newUser.avatar를 객체로 설정
    }

    await newUser.save();
    //커스텀할때
    // const newUser = new userModel(req.body);
    // newUser.userDisplayName = req.body.userDisplayName
    //   ? req.body.userDisplayName
    //   : "Anonymous";
    // await newUser.save();

    const userforFront = {
      _id: newUser._id,
      email: newUser.email,
      userDisplayName: newUser.userDisplayName,
      avatar: newUser.avatar,
    };

    res.status(200).json(userforFront);
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
