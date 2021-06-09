import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("has a route handler to api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be access if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("return a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});
  console.log(response.status);
  expect(response.status).not.toEqual(401);
});

it("return an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "", price: 10 })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ price: 10 })
    .expect(400);
});
it("return an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "test", price: -10 })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "test" })
    .expect(400);
});
it("create a ticket with valid inputs", async () => {
  // add in a check to make sure a ticket was saved
  const title = "original";
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price: 10 })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(10);
  expect(tickets[0].title).toEqual(title);
});
