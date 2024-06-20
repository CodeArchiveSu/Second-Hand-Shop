import React, { useEffect, useRef, useState } from "react";
import styles from "./Upload.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationCrosshairs,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

function Upload() {
  const [location, setLocation] = useState({
    City: "",
    Postcode: "",
  });

  const [uploadImgUrls, setUploadImgUrls] = useState<string[]>([]);

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
    console.log(files);

    //바로보기 로직
    const newUrls = files.map((file) => {
      const reader = new FileReader();
      console.log("유얼에이 처리", reader.readAsDataURL(file as Blob));

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
  //   askForLocationPermission();
  // }, []);

  const handleSubmit = () => {};

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
          <input name="title" />
        </div>
        <div>
          Price
          <input name="price" />
        </div>
        <div>
          Description
          <textarea
            name="description"
            placeholder="Please write about your item..."
            className={styles.textarea}
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
            />

            <input
              type="text"
              placeholder="City"
              name="City"
              value={location.City}
              className={styles.city}
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
}

export default Upload;
