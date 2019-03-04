import express from "express";
import books from "../__mocks__/books";

const router = express.Router();

router.get("/search", (req, res) => {
  res.json({
    books
  });
});

export default router;
