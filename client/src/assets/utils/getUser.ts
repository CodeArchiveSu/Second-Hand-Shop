// import { useNavigate } from "react-router-dom";
import { getToken } from "./tokensServices";
// const navigate = useNavigate();

export const getUser = async () => {
  const token = getToken();
  if (!token) {
    console.log("login first");
    //   dispatch(setUser(null));
    return;
  }

  if (token) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    try {
      const response = await fetch(
        "http://localhost:3020/api/users/profile",
        requestOptions
      );
      if (!response.ok && response.status == 401) {
        console.log("token invalid login again");
        // navigate("/login");
        return;
      }
      if (response.ok) {
        const result = await response.json();
        console.log("Profile result", result);
        return result;
        //   dispatch(setUser(result.user));
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }
};
