import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navigation.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

function Navigation() {
  let navigate = useNavigate();
  return (
    <div className={styles.navigationContaioner}>
      {/* <FontAwesomeIcon icon={faSearch} size="xs" /> */}
      <div
        onClick={() => {
          navigate("/");
        }}
      >
        Home
      </div>
      <div
        onClick={() => {
          navigate("/favorite");
        }}
      >
        {/* <FontAwesomeIcon icon={regularHeart} /> */}
        Favorite
      </div>
      <div
        onClick={() => {
          navigate("/upload");
        }}
      >
        Upload
      </div>
      <div
        onClick={() => {
          navigate("/chat");
        }}
      >
        Messages
      </div>
      <div
        onClick={() => {
          navigate("/personalPage");
        }}
      >
        My Page
      </div>
    </div>
  );
}

export default Navigation;
