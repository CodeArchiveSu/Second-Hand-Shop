import express from "express";
const router = express.Router();

const middleware = (req, res, next) => {
  console.log("this is middleware");
  next();
};

router.get("/test", middleware, (request, response) => {
  console.log("this is just controller");
  response.send({
    message: "this is a test route",
  });
});

router.post("/test", (req, res) => {
  res.send({ message: "this is a test Post" });
});

export default router;
