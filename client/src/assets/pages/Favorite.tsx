import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { User, likes, state } from "../../@types";

export default function Favorite() {
  const [products, setProducts] = useState<likes[]>([]);

  let LoggedinUser = useSelector((state: state) => {
    return state.user;
  });

  const fetchFavoriteItems = async () => {
    try {
      console.log(LoggedinUser.id);
      const id = LoggedinUser.id;
      const response = await fetch(
        `http://localhost:3020/api/favoriteItems/${id}`
      );
      const result = await response.json();
      console.log("results of fetching FavoriteItems", result);
      console.log(result.favoriteItems);
      setProducts(result.favoriteItems);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (LoggedinUser) {
      fetchFavoriteItems();
    }
  }, [LoggedinUser]);

  return (
    <div>
      <div>items</div>
      {products &&
        products.map((item) => (
          <div key={item._id}>
            <div>{item?.likedItemId?.title}</div>
          </div>
        ))}
    </div>
  );
}
