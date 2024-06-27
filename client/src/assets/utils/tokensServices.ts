import { faSlack } from "@fortawesome/free-brands-svg-icons";

export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return true;
  } else {
    return false;
  }
};

export const getToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return token;
  }
  if (!token) {
    console.log("no token stored");
    return null;
  }
};
