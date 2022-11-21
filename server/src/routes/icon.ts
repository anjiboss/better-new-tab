import axios from "axios";
import express from "express";
const router = express.Router();

/**************************************************
 * _API /api/v1/icon/
 **************************************************/

/**
 * _GET Icon in base64 string
 * (bypass cors)
 * @query url
 */
router.get("/", async (req, res) => {
  const url = (req.query.url as string) || "";
  const resp = await axios(`${url}/favicon.ico`, {
    headers: {
      Origin: url,
    },
    responseType: "arraybuffer",
  });
  const base64String = Buffer.from(resp.data, "binary").toString("base64");

  res.json({
    base64: base64String,
  });
});

export { router as iconRouter };
