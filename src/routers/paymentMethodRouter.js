import express from "express";
import {} from "../models/paymentemethods/PaymentMethod.model.js";

const router = express.Router();
router.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    res.json({
      status: "success",
      message: "Payment method got hit successfully",
    });
  } catch (error) {
    next(error);
  }
});
router.patch("/", async (req, res, next) => {
  try {
    console.log(req.body);
    res.json({
      status: "success",
      message: "Payment method-update  got hit successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    console.log(req.body);
    res.json({
      status: "success",
      message: "The payment method has been fetched",
    });
  } catch (error) {
    next(error);
  }
});
router.delete("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    console.log(_id);
    res.json({
      status: "success",
      message: "The payment method has been deleted",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
