import { v2 as cloudinary } from "cloudinary";

export const imageUpload = async (file, folder) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
    });
    console.log(result);
    return [result.secure_url, result.public_id]; //public_id 추가하기
  } catch (e) {
    console.log(e);
  }
};

export const deleteImage = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    console.log(result);
    return result;
  } catch (e) {
    console.log(e);
  }
};

// 이미지삭제
