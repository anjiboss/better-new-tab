import { tokenVerify } from "@middleware/token";
import HttpStatusCode from "@utils/httpStatus";
import { responser } from "@utils/responser";
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
router.get("/", tokenVerify, async (req, res) => {
  const url = (req.query.url as string) || "";
  const resp = await axios(
    `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=64`,
    {
      // headers: {
      //   Origin: url,
      // },
      responseType: "arraybuffer",
    }
  );
  const base64String = Buffer.from(resp.data, "binary").toString("base64");

  return responser(res, HttpStatusCode.OK, "Success", {
    base64: base64String,
  });
});

export { router as iconRouter };
