import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// An interface rhat descrives the properties
// that are required to create a payload
interface UserPayload {
  id: string;
  email: string;
}

declare global {
  // allow you to modify an existing interface
  namespace Express {
    interface Request {
      // add a new property to it
      currentUser?: UserPayload; // that may or may not be define
    }
  }
}
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    // req.session?.jwt === if (!req.session || !req.session.jwt)
    return next();
  }
  try {
    const payload = jwt.verify(
      req.session?.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}
  next();
};
