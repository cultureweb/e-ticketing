import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@eticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
