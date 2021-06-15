import { PaymentCreatedEvent, Publisher, Subjects } from "@eticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
