const express = require("express");

const app = express();
const port = 3000;
const { successResponse } = require("./config/responseHandler");
const { default: rateLimit } = require("express-rate-limit");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const limiter = rateLimit({
  windowMs: 1 * 10 * 1000,
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: {
    code: 429,
    message: "Too many requests, please try again later.",
  },
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
});

app.use(limiter);

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.get("/user", (req, res) => {
  successResponse(res, `This is user ${req.user.id}`, {}, 200);
});
