import { Publisher, OrderCreatedEvent, Subjects } from "@eticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
