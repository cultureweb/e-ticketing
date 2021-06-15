import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validationRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@eticketing/common";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validationRequest,
  async (req: Request, res: Response) => {
    const { orderId, token } = req.body;
    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for a cancelled order");
    }

    const charge = await stripe.charges.create({
      currency: "eur",
      amount: order.price * 100,
      source: token,
      description: "Test Charge",
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    res.status(201).send({ success: true });
  }
);

export { router as createChargetRouter };
