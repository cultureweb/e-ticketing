import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validationRequest } from "@eticketing/common";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validationRequest,
  (req: Request, res: Response) => {
    const { title, price } = req.body;

    res.sendStatus(200);
  }
);

export { router as createTicketRouter };
