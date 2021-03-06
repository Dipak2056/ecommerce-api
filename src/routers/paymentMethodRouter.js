import express from "express";
import { newPaymentMethodValidation } from "../middlewares/joi-validation/paymentValidation.js";
import {
  deletePaymentMethodById,
  getAllPaymentMethod,
  getAPaymentMethod,
  getPaymentMethods,
  insertPaymentMethod,
  updatePaymentMethodById,
} from "../models/paymentemethods/PaymentMethod.model.js";

const router = express.Router();
router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;

    const result = _id
      ? await getAPaymentMethod({ _id })
      : await getAllPaymentMethod();
    res.json({
      status: "success",
      message: "The payment method has been fetched",
      result,
    });
  } catch (error) {
    next(error);
  }
});
router.post("/", newPaymentMethodValidation, async (req, res, next) => {
  try {
    const result = await insertPaymentMethod(req.body);
    result?._id
      ? res.json({
          status: "success",
          message: "Payment method got hit successfully",
        })
      : res.json({
          status: "error",
          message: "Unable to add new payment method. plz try again later",
        });
    console.log(result);
  } catch (error) {
    error.status = 500;
    if (error.message.includes("E11000 duplicate key")) {
      error.status = 200;
      error.message = "This payment method already exists.";
    }
    next(error);
  }
});
router.put("/", newPaymentMethodValidation, async (req, res, next) => {
  try {
    console.log(req.body);
    const { _id, ...rest } = req.body;
    if (typeof _id === "string") {
      const result = await updatePaymentMethodById(_id, rest);
      if (result?._id) {
        return res.json({
          status: "success",
          message: "Payment method updated successfully",
        });
      }

      res.json({
        status: "error",
        message: "Payment method couldnot update",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const result = await deletePaymentMethodById(_id);
    if (result?._id) {
      return res.json({
        status: "success",
        message: "Deleted payment method.",
      });
    }
    res.json({
      status: "error",
      message: "Unable to delete.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
