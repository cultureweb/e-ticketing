import { Publisher, OrderCancelledEvent, Subjects } from "@eticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
