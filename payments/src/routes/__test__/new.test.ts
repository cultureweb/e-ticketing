import { OrderStatus } from "@eticketing/common";
import { cookie } from "express-validator";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";

it("return return 404 when puchasing an order that does not exist ", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      orderId: mongoose.Types.ObjectId().toHexString(),
      token: "123ùdsfkkj",
    })
    .expect(404);
});

it("returns 401 when purchasing an order that does not belong to the user", async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    userId: "kfsldmf",
    price: 15,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({ orderId: order.id, token: "123ùdsfkkj" })
    .expect(401);
});

it("returns 400 when purchasing a cancelled order", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Cancelled,
    version: 0,
    userId,
    price: 15,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({ orderId: order.id, token: "123ùdsfkkj" })
    .expect(400);
});
