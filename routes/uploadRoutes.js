import express from "express";

import upload from "../configuration/multerConfig.js";

import {
  uploadImages,
} from "../controllers/uploadController.js";

const router = express.Router();

router.post(
  "/",
  upload.array("images", 10),
  uploadImages
);

export default router;