import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler to api/tickets for post requests", async () => {
  const response = await request(app).post("/api/orders").send({});
  expect(response.status).not.toEqual(404);
});

// make sure that the user is authenticated if not respond with an error

it("can only be access if the user is signed in", async () => {
  await request(app).post("/api/orders").send({}).expect(401);
});

it("return a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("return an error if an invalid ticketId is provided", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: "" })
    .expect(400);
});

it("return an error if the ticket does not exist", async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(404);
});

it("return an error if the ticket is already reserved", async () => {
  // First we create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "gdhfsjg",
    price: 20,
  });
  await ticket.save();

  // Then we create an order
  const order = Order.build({
    userId: "jkfjsd",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  // First we create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  // Then we create an order with ticket
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  const orders = await Order.find({});

  expect(orders.length).toEqual(1);
  expect(orders[0].status).toEqual(OrderStatus.Created);
});

it("emits an order created event", async () => {
  // First we create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  // Then we create an order with ticket
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled(); // change this to .not.toHaveBeenCalled() to make the test fails
});
