import express from "express";
import slugify from "slugify";
import {
  newProductValidation,
  updateProductValidation,
} from "../middlewares/joi-validation/productCategoryValidation.js";
import {
  deleteMultipleProducts,
  getMultipleProducts,
  getProduct,
  insertProduct,
  updateProductById,
} from "../models/product/Product.model.js";
//multer setup to get the image files from the form data we sent from the front end.
import multer from "multer";
//multer setup for validation and upload destination
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    let error = null;
    //validation test

    cb(error, "public/img/products");
  },
  filename: (req, file, cb) => {
    const fullFileName = Date.now() + "-" + file.originalname;
    cb(null, fullFileName);
  },
});
const upload = multer({ storage });

const router = express.Router();

router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const products = _id
      ? await getProduct({ _id })
      : await getMultipleProducts();
    res.json({
      status: "success",
      message: "Product lists",
      products,
    });
  } catch (error) {
    next(error);
  }
});
router.post(
  "/",
  upload.array("images", 5),
  newProductValidation,
  async (req, res, next) => {
    try {
      const files = req.files;
      const images = files.map((img) => img.path);
      console.log(images);

      const { name } = req.body;
      const slug = slugify(name, { trim: true, lower: true });
      req.body.slug = slug;
      const result = await insertProduct({
        ...req.body,
        images,
        thumbnail: images[0],
      });
      console.log(result);
      console.log(slug);
      result?._id
        ? res.json({
            status: "success",
            message: "New Product has been created",
          })
        : res.json({
            status: "error",
            message: "Error! unable to add new product",
          });
    } catch (error) {
      //
      if (error.message.includes("E11000 duplicate key error collection")) {
        error.message =
          "Another product with similar name or SKU already exist.";
        error.status = 200;
      }
      next(error);
    }
  }
);
router.delete("/", async (req, res, next) => {
  try {
    const ids = req.body;
    if (ids.length) {
      const result = await deleteMultipleProducts(ids);
      console.log(result);
      if (result?.deletedCount) {
        return res.json({
          status: "success",
          message: "selected product has been deleted",
        });
      }
    }

    res.json({
      status: "error",
      message: "unable to delete, please try again later",
    });
  } catch (error) {
    next(error);
  }
});
router.put(
  "/",
  upload.array("newImages", 5),
  updateProductValidation,
  async (req, res, next) => {
    try {
      console.log(req.body);

      const { _id, imgToDelete, ...rest } = req.body;
      const files = req.files;
      //1. make new array for the images and replace in the database
      const images = files.map((img) => img.path); //new incoming images
      const oldImgList = rest.images.split(","); //old images from db before editing

      //remove deleteed image from old imglist
      const filteredImages = oldImgList.filter(
        (img) => !imgToDelete.includes(img)
      );
      rest.images = [...filteredImages, ...images];

      //2. delete image from the file system

      const result = await updateProductById(_id, rest);

      result?._id
        ? res.json({
            status: "success",
            message: "Product has been updated",
            result,
          })
        : res.json({
            status: "error",
            message: "Product has not been updated",
          });
    } catch (error) {
      next(error);
    }
  }
);
export default router;
