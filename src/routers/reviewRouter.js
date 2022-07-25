import express from "express";
const router = express.Router();
const reviews = [
  {
    _id: "0",
    productId: "asdf",
    productName: "asdf",
    rating: "5",
    reviewedBy: "krishna",
    reviewedById: "12k",
  },
  {
    _id: "1",
    productId: "asdf",
    productName: "asdf",
    rating: "5",
    reviewedBy: "krishna",
    reviewedById: "12k",
  },
  {
    _id: "2",
    productId: "asdf",
    productName: "asdf",
    rating: "5",
    reviewedBy: "krishna",
    reviewedById: "12k",
  },
];

router.get("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const result = _id ? reviews.filter((item) => item._id === _id) : reviews;

    res.json({
      status: "success",
      message: "review list",
      result,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
