import { Publisher, Subjects, TicketUpdatedEvent } from "@eticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
