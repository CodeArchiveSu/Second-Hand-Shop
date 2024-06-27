import React from "react";
import { useParams } from "react-router-dom";
import { products } from "../../@types";

type QuizParams = {
  id: string;
};

function Detail({ products }: { products: products[] }) {
  let { id } = useParams<QuizParams>();
  const eventId = id;
  console.log(eventId);

  const filteredItem = products.find((item, index) => {
    return item._id === id;
  });

  return (
    <>
      <div>{filteredItem?.title}</div>
      <div>
        {filteredItem &&
          filteredItem.images.map((item, index) => (
            <div className="item-images">
              <img src={item.url}></img>
            </div>
          ))}
      </div>
      <div>{filteredItem?.createdAt}</div>
      <div>{filteredItem?.price}</div>
    </>
  );
}

export default Detail;
