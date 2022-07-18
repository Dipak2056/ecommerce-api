import express from "express";
const router = express.Router();

router.get("/:_id?", async (req, res, next) => {
  console.log(res);
});

export default router;
