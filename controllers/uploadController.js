import {saveImageToD365} from "../services/d365Services.js";

export const uploadImages = async ( req,res) => {
  try {

    const uploadedFiles = [];

    for (const file of req.files) {

      const imageUrl =
        `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

      uploadedFiles.push(imageUrl);

      await saveImageToD365({
        projectId: req.body.projectId,
        imageUrl,
        fileName: file.filename,
      });
    }

    res.status(200).json({
      success: true,
      images: uploadedFiles,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};