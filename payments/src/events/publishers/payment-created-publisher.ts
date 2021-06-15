import { paymentCreatedEvent, Publisher, Subjects } from "@eticketing/common";

export class PaymentCreatedPublisher extends Publisher<paymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
