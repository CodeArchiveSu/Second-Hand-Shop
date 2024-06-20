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

  console.log(filteredItem);

  return <div>Detail</div>;
}

export default Detail;
