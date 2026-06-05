import express from "express";

const router =
  express.Router();

import {
  getProjectReport,
  createProjectReport,
  getProjectActivities
}
from "../services/d365Services.js";



// =======================================
// GET REPORT
// =======================================

router.get("/:projectId", async (req, res) => {

  try {

    const { projectId } =
      req.params;

    const { date } =
      req.query;

    const data =
      await getProjectReport(
        projectId,
        date
      );

    res.json(data);

  } catch (error) {

    console.log(
      "FETCH REPORT ERROR:",
      error.response?.data ||
      error.message
    );

    res.status(500).json({

      error:
        "Failed to fetch report",

      details:

        error.response?.data?.error?.innererror?.message ||

        error.response?.data?.error?.message ||

        error.message ||

        "Unknown Error"
    });
  }
});


// =======================================
// CREATE NEW RECORD
// =======================================

router.post("/create", async (req, res) => {

  try {

    const data =
      await createProjectReport(
        req.body
      );

    res.json(data);

  } catch (error) {

    // FULL ERROR IN TERMINAL

    console.log(
      "CREATE RECORD ERROR:",
      JSON.stringify(
        error.response?.data,
        null,
        2
      )
    );

    // SEND ERROR TO FRONTEND

    res.status(500).json({

      error:
        "Failed to create record",

      details:

        error.response?.data?.error?.innererror?.message ||

        error.response?.data?.error?.message ||

        error.message ||

        "Unknown D365 Error"
    });
  }
});
// =======================================
// GET DISCIPLINE ACTIONS FOR PROJECT
// =======================================

router.get(
  "/activities/:projectId",
  async (req, res) => {
    console.log("ACTIVITIES API HIT");
    try {

      const { projectId } =
        req.params;

      const data =
        await getProjectActivities(
          projectId
        );

      res.json(data);

    } catch (error) {

      console.log(
        "FETCH ACTIVITIES ERROR:",
        error.response?.data ||
        error.message
      );

      res.status(500).json({

        error:
          "Failed to fetch activities",

        details:

          error.response?.data?.error?.message ||

          error.message ||

          "Unknown Error"
      });

    }

  }
);

export default router;