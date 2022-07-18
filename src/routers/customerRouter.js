import express from "express";
const router = express.Router();
import { getCustomers } from "../fake-db/fakeDB.js";

router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { data } = await getCustomers(_id);
    res.json({
      status: "success",
      message: "customer list",
      customers: data,
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

export default router;
