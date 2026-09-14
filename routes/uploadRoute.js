import express from "express";
import axios from "axios";

import upload from "../middleware/multerConfig.js";

import {
  getImageToD365,
  getAccessToken
}
from "../services/d365Services.js";

const router =
  express.Router();


// ==========================================
// GET ALL IMAGES
// ==========================================

router.get(
  "/images",
  async (req, res) => {

    try {

      const images =
        await getImageToD365();

      console.log(
        "Images fetched successfully"
      );

      res.json(images);

    } catch (error) {

      console.log(
        "FETCH IMAGE ERROR:",
        error.response?.data ||
        error.message
      );

      res.status(500).json({

        error:
          "Failed to fetch images"
      });
    }
  }
);
// ==========================================
// GET IMAGES BY PROJECT ID
// ==========================================

router.get(
  "/images/:projectId",

  async (req, res) => {

    try {

      const { projectId } =
        req.params;

      const images =
        await getImageToD365();

      // FILTER PROJECT IMAGES

 const filteredImages =
  images.filter(

    (item) =>

      item.ProjId ===
      projectId
  );

      console.log(
        "FILTERED IMAGES:",
        filteredImages.length
      );

      res.json(filteredImages);

    } catch (error) {

      console.log(
        "IMAGE FETCH ERROR:",
        error.response?.data ||
        error.message
      );

      res.status(500).json({

        error:
          "Failed to fetch project images"
      });
    }
  }
);


// ==========================================
// UPLOAD IMAGE
// ==========================================

router.post(

  "/upload-images",

  upload.single("image"),

  async (req, res) => {

    try {

      console.log(
        "UPLOAD REQUEST RECEIVED"
      );

      console.log(
        "BODY:",
        req.body
      );

      console.log(
        "FILE:",
        req.file
      );

      if (!req.file) {

        return res.status(400).json({

          error:
            "No image uploaded"
        });
      }

      const token =
        await getAccessToken();

      // CONVERT IMAGE TO BASE64

      const base64Image =
        req.file.buffer.toString(
          "base64"
        );

      // D365 PAYLOAD

      const payload = {

        dataAreaId: "shlt",

        ProjId:
          req.body.ProjectId,

        ImageName:
          req.body.ImageName,

        ProjDate:
         req.body.ProjDate,

        ProjectImage:
          base64Image
      };

      console.log(
        "UPLOAD URL:",
        `${config.baseUrl}${process.env.GET_Image_API_URL}`
      );

      console.log(
        "PAYLOAD READY"
      );

      // SEND TO D365

      const response =
        await axios.post(

         `${config.baseUrl}${process.env.GET_Image_API_URL}`,

          payload,

          {
            headers: {

              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json"
            }
          }
        );

      console.log(
        "UPLOAD SUCCESS"
      );

      res.status(200).json({

        success: true,

        data: response.data
      });

    } catch (error) {

      console.log(
        "UPLOAD ERROR:"
      );

      console.log(
        error.response?.data ||
        error.message
      );

      res.status(500).json({

        error:

          error.response?.data?.error?.message ||

          error.message ||

          "Upload Failed"
      });
    }
  }
);

export default router;