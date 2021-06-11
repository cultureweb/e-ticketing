import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

it("should return 404 if there is no order", async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();

  await request(app).post(`/api/orders/${orderId}`).send({}).expect(404);
});

it("should return 401 if the user is not authenticated", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 30,
  });
  await ticket.save();
  // Make a request to build an order with this ticket
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app).delete(`/api/orders/${order.id}`).send().expect(401);
});

it("marks an order as cancelled", async () => {
  // Create a ticket with Ticket Model
  const ticket = Ticket.build({
    title: "concert",
    price: 30,
  });
  await ticket.save();

  // Make a request to create an order with this ticket
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make a request to cancelled this order with no authenticated
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  // Expectation to make sure the order is marked as cancellled
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an order cancelled event", async () => {
  // Create a ticket with Ticket Model
  const ticket = Ticket.build({
    title: "concert",
    price: 30,
  });
  await ticket.save();

  // Make a request to create an order with this ticket
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make a request to cancelled this order with no authenticated
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
