import "dotenv/config";
import express from "express";
const app = express();
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { dbConnect } from "./src/config/dbConfig.js";
import { adminAuth } from "./src/middlewares/authmiddlewares/authMiddleware.js";

const PORT = process.env.PORT || 8000;

//use middle wares
app.use(express.json()); //parse req.body
app.use(cors()); //browser to access cors
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
); //for the security purpose
app.use(morgan("dev")); //for logging the api calls
import path from "path";

//mongo db connection
dbConnect();

//routers
//admin router
import adminRouter from "./src/routers/adminRouter.js";
import categoryRouter from "./src/routers/categoryRouter.js";
import productRouter from "./src/routers/productRouter.js";
import paymentMethodRouter from "./src/routers/paymentMethodRouter.js";
import customerRouter from "./src/routers/customerRouter.js";
import orderRouter from "./src/routers/orderRouter.js";
import reviewRouter from "./src/routers/reviewRouter.js";
//middle wares
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/category", adminAuth, categoryRouter);
app.use("/api/v1/products", adminAuth, productRouter);
app.use("/api/v1/payment-method", adminAuth, paymentMethodRouter);
app.use("/api/v1/customers", adminAuth, customerRouter);
app.use("/api/v1/orders", adminAuth, orderRouter);
app.use("/api/v1/reviews", reviewRouter);
//server static content
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

//if nothing got hit
app.get("/", (req, res) => {
  res.json({
    message: "you have reached the admin api",
  });
});
//error handling
app.use((err, req, res, next) => {
  //log in file system or time series db like cloud watch
  console.log(err);
  res.status(err.status || 404);

  res.json({
    status: "error",
    message: err.message,
  });
});

//bound api with the port to serve on internet
app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`server is running on  http://localhost: ${PORT}`);
});
