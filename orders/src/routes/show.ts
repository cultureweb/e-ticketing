//import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { requireAuth } from "@eticketing/common";
const router = express.Router();

router.get("/api/orders/:orderId", async (req: Request, res: Response) => {
  res.send({});
});

export { router as showOrderRouter };
