import { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
  constructor(public errors: ValidationError[]) {
    super();

    // On;y because we are extending a built class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}
// throw new RequestValidationError(errors)
