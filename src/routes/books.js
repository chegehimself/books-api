import express from "express";
import authenticate from "../middlewares/authenticate";
import books from "../__mocks__/books";

const router = express.Router();

router.get("/search", authenticate, (req, res) => {
  res.json({
    books
  });
});

export default router;
