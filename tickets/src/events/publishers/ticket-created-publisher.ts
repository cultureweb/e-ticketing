import { Publisher, Subjects, TicketCreatedEvent } from "@eticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
