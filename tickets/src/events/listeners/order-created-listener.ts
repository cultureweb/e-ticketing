import { Listener, OrderCreatedEvent, Subjects } from "@eticketing/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // if no ticket, throw an error
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    // Mark the ticket has been reserved by settind order id property
    ticket.set({
      orderId: data.id,
    });

    // Save  the ticket
    await ticket.save();

    // ack the message
    msg.ack();
  }
}
