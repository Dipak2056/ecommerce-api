import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "GET method hit to admin router",
  });
});

router.post("/", (req, res) => {
  res.json({
    status: "success",
    message: "Put method got hit to admin router",
  });
});

router.patch("/", (req, res) => {
  res.json({
    status: "success",
    message: "PATCH method got hit to admin router",
  });
});
export default router;
