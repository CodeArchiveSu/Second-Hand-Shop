import React, { useEffect, useRef, useState } from "react";
import styles from "./Upload.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationCrosshairs,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { baseUrl } from "../utils/baseUrl";
import { NotOKType, User, products } from "../../@types";
import { initialState } from "../../store";
import { useSelector } from "react-redux";

type state = {
  user: User;
};

type UploadProps = {
  products: products[];
  setProducts: React.Dispatch<React.SetStateAction<products[]>>;
};

const Upload: React.FC<UploadProps> = ({ products, setProducts }) => {
  let LoggedinUser = useSelector((state: state) => {
    return state.user;
  });

  // console.log("LoggedinUser in upload", LoggedinUser);

  const [location, setLocation] = useState({
    City: "",
    Postcode: "",
  });

  const [inputValues, setInputValues] = useState({
    title: "",
    price: "",
  });

  const [textValues, setTextValues] = useState({
    description: "",
  });

  const [uploadImgUrls, setUploadImgUrls] = useState<string[]>([]);

  const imageFiles = useRef<File[]>([]);

  function askForLocationPermission() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          processLocation(position.coords.latitude, position.coords.longitude);
        },
        function (error) {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  // Function to process location data
  function processLocation(latitude: any, longitude: any) {
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

    fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("User Location:", data);
        setLocation({ City: `${data.city}`, Postcode: `${data.postcode}` });
      })
      .catch((error) => console.error("Error fetching location:", error));
  }

  const onchangeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files as any);
    console.log("files", files);

    if (e.target.files) {
      imageFiles.current = [
        ...imageFiles.current,
        ...Array.from(e.target.files),
      ];
    }

    //바로보기 로직
    const newUrls = files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file as Blob);

      return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    });

    Promise.all(newUrls)
      .then((results) => {
        setUploadImgUrls((prevUrls) => [...prevUrls, ...results] as string[]);
      })
      .catch((error) => console.error("Error reading files:", error));
  };

  // useEffect(() => {
  //   console.log(uploadImgUrls);
  // }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
    setLocation((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTextValues((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const [erorr, setErorr] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErorr("");
    if (
      !inputValues.price.trim() ||
      !inputValues.title.trim() ||
      !textValues.description.trim() ||
      !location.City ||
      !location.Postcode
    ) {
      setErorr("Credentials missing!!");
      return;
    }

    const headers = new Headers();

    const body = new FormData();
    body.append("title", inputValues.title);
    body.append("price", inputValues.price);
    body.append("userId", LoggedinUser.id);
    body.append("city", location.City);
    body.append("postcode", location.Postcode);
    body.append("description", textValues.description);
    // body.append("category", "food");
    console.log(imageFiles.current);
    if (imageFiles.current && imageFiles.current.length > 0) {
      for (let i = 0; i < imageFiles.current.length; i++) {
        body.append("images", imageFiles.current[i]);
      }
      // body.append("images", uploadImgUrls[0], "[PROXY]");
      // body.append("images", fileInput.files[0], "[PROXY]");
    }

    const requestOptions = {
      method: "POST",
      headers,
      body,
    };

    try {
      const response = await fetch(
        `${baseUrl}/api/products/upload`,
        requestOptions
      );
      if (response.ok) {
        const result = (await response.json()) as products;
        console.log("new product!", result);
        setInputValues({ title: "", price: "" });
        setLocation({ City: "", Postcode: "" });
        setTextValues({ description: "" });
        setUploadImgUrls([]);

        setProducts((prevPoducts) => [...prevPoducts, result]);
      }
      if (!response.ok) {
        const result = (await response.json()) as NotOKType;
        console.log("something went wrong", result);
        setErorr(result.erorr);
      }
    } catch (error) {
      console.log(erorr);
      const { message } = error as Error;
      setErorr(message);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <form className={styles.uploadForm} onSubmit={handleSubmit}>
        <div className={styles.imageBox}>
          <label htmlFor="file-upload" className={styles.customLabel}>
            {uploadImgUrls.length}/10
          </label>

          <input
            type="file"
            id="file-upload"
            className={styles.file}
            onChange={onchangeImageUpload}
            multiple
            max="10"
            accept="image/*"
          />
          {uploadImgUrls &&
            uploadImgUrls
              .slice()
              .reverse()
              .map((item, index) => (
                <div className={styles.uploadimage} key={index}>
                  <img src={item}></img>
                </div>
              ))}
        </div>

        <div>
          Title
          <input
            name="title"
            onChange={handleChange}
            value={inputValues.title}
          />
        </div>
        <div>
          Price
          <input
            name="price"
            onChange={handleChange}
            value={inputValues.price}
          />
        </div>
        <div>
          Description
          <textarea
            name="description"
            placeholder="Please write about your item..."
            className={styles.textarea}
            value={textValues.description}
            onChange={handleDescriptionChange}
          ></textarea>
        </div>
        <div>
          Location
          <div className={styles.location}>
            <input
              type="text"
              placeholder="Postcode"
              name="Postcode"
              value={location.Postcode}
              className={styles.Postcode}
              onChange={handleChange}
            />

            <input
              type="text"
              placeholder="City"
              name="City"
              value={location.City}
              className={styles.city}
              onChange={handleChange}
            />

            <div
              onClick={askForLocationPermission}
              className={styles.getLocation}
            >
              <FontAwesomeIcon
                icon={faLocationCrosshairs}
                size="sm"
                className={styles.icon}
              />
            </div>
          </div>
        </div>
        <button style={{ marginTop: "3vh" }}> Upload!</button>
      </form>
    </div>
  );
};

export default Upload;
