import express from "express";
const router = express.Router();
const Review = [
  {
    _id: 1,
    productId: "asdfa",
    productName: "laptop",
    rating: "5",
    reviewBy: "sam",
    reviewedBy_id: "qwersfa2232",
  },
  {
    _id: 2,
    productId: "a",
    productName: "laptop asdf",
    rating: "5",
    reviewBy: "sam",
    reviewedBy_id: "qwersfa2232",
  },
  {
    _id: 3,
    productId: "a",
    productName: "laptop asfdsf",
    rating: "5",
    reviewBy: "sam",
    reviewedBy_id: "qwersfa2232",
  },
];

router.get("/:_id?", (req, res) => {
  const { _id } = req.params;
  const result = _id ? Review.filter((item) => item._id === _id) : Review;
  res.json({
    status: "success",
    message: "review list",
    result,
  });
});

export default router;
