import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { createTicketRouter } from "./routes/new";

import { errorHandler, NotFoundError, currentUser } from "@eticketing/common";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // Whenever Jest run the test, it sets variable .NODE_ENV === "test"
    // The code below is saying If it'is equal to test set secure false
    // Otherwise for any other kind of environment set secure to true
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);
app.use(createTicketRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
