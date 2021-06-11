import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("Fetches the order", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: "jdjs",
    price: 60,
  });
  await ticket.save();
  // Make a request to build an order with this ticket
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make a request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
  expect(fetchedOrder.status).toEqual(order.status);
  expect(fetchedOrder.expiresAt).toEqual(order.expiresAt);
});

it("returns an error if one user tries to fetch another user order", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: "jdjs",
    price: 60,
  });
  await ticket.save();
  // Make a request to build an order with this ticket
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make a request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(401);
});
