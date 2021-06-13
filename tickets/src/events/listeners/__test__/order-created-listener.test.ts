import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedEvent, OrderStatus } from "@eticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";

const setup = async () => {
  // create an istance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // build a ticket
  const ticket = Ticket.build({
    title: "party",
    price: 40,
    userId: "azerty",
  });
  await ticket.save();

  // build a fake data object
  const data: OrderCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "sdfsdfs",
    expiresAt: "edfsfsdfdf",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // Build a fake Message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return fake data object
  return { msg, data, listener, ticket };
};

it("sets the userId of the ticket", async () => {
  const { msg, data, listener, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("ack the message", async () => {
  const { msg, data, listener, ticket } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
