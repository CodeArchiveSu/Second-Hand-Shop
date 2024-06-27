import { useSelector } from "react-redux";
import { Users, initialState } from "../store";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { current } from "@reduxjs/toolkit";
import { User } from "../@types";

//   return LoggedinUser ? <Outlet /> : <Navigate to="/Login" />;

const ProtectedRoutes: React.FC = () => {
  let tokenstatus = false;

  const isToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      tokenstatus = true;
    } else {
      tokenstatus = false;
    }
  };

  isToken();

  const currentLocation = useLocation();

  if (tokenstatus) {
    return <Outlet />;
  } else {
    return (
      <Navigate
        to="/Login"
        replace
        state={{ redirectedFrom: currentLocation }}
      />
    );
  }
};

export default ProtectedRoutes;
