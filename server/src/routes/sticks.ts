import { tokenVerify } from "@middleware/token";
import { PrismaClient, Stick } from "@prisma/client";
import HttpStatusCode from "@utils/httpStatus";
import { responser } from "@utils/responser";
import express from "express";

/**
 * _API /api/v1/stick
 */

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", tokenVerify, async (req, res) => {
  const profile = await prisma.profile.findFirst({
    where: {
      id: req.profile.id,
    },
    include: {
      sticks: true,
    },
  });
  if (!profile) {
    return responser(res, HttpStatusCode.BAD_REQUEST, "Not Logged in");
  }

  return responser(res, HttpStatusCode.OK, "Success. here is your stick", {
    sticks: profile.sticks,
  });
});

/**
 * @body Stick[] sticks
 */
router.post("/", tokenVerify, async (req, res) => {
  console.log(req.body);
  const profile = await prisma.profile.findFirst({
    where: {
      id: req.profile.id,
    },
  });

  if (!profile) {
    return responser(res, HttpStatusCode.BAD_REQUEST, "Not Logged in");
  }

  const sticks: Stick[] = req.body.sticks;
  try {
    // Delete old record + create new => upsert many
    await prisma.stick.deleteMany({
      where: {
        id: {
          in: sticks.map((stick) => stick.id),
        },
      },
    });
    await prisma.stick.createMany({
      data: sticks.map((stick) => ({
        icon: stick.icon,
        position: stick.position,
        title: stick.title,
        url: stick.url,
        userId: profile.id,
        id: stick.id,
      })),
    });
  } catch (error) {
    console.log(error);
    return responser(
      res,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      "Server unexpected problem or input error"
    );
  }

  return responser(res, HttpStatusCode.OK, "ok");
});

export { router as sticksRouter };
