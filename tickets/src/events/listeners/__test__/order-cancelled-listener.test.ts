import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from "mongoose";
import { OrderCancelledEvent } from "@eticketing/common";
import { Message } from "node-nats-streaming";
const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // create a ticket with orderId
  const orderId = mongoose.Types.ObjectId().toHexString();
  const ticket = await Ticket.build({
    title: "test",
    price: 500,
    userId: "fdsfgfd",
  });
  ticket.set({ orderId });
  await ticket.save();

  // Create  a fake data object
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // Create  a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all object needed
  return { msg, ticket, listener, data, orderId };
};

it("finds, set orderId property of the ticket to null", async () => {
  const { msg, ticket, listener, data, orderId } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toBeUndefined();
});

it("acks the messsage", async () => {
  const { msg, ticket, listener, data, orderId } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publish the events", async () => {
  const { msg, listener, data } = await setup();

  await listener.onMessage(data, msg);

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  expect(data.ticket.id).toEqual(ticketUpdatedData.id);
});
