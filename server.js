import "dotenv/config";
import express from "express";
const app = express();
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

const PORT = process.env.PORT || 8000;

//use middle wares
app.use(express.json()); //parse req.body
app.use(cors()); //browser to access cors
app.unlock(helmet()); //for the security purpose
app.use(morgan("dev")); //for logging the api calls

//mongo db connection

//routers
app.get("/", (req, res) => {
  res.json({
    message: "you have reached the admin api",
  });
});
//error handling
app.use((err, req, res, next) => {
  console.log(err);
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
