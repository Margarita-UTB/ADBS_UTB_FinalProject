import express from "express";
import mongoose from "mongoose";
import Joi from "joi";
import Book from "../models/Books.js";

const router = express.Router();

const bookSchema = Joi.object({
  name: Joi.string().min(1).required(),
  authorId: Joi.string().hex().length(24).required(),
  genre: Joi.string().allow("").optional(),
  synopsis: Joi.string().min(1).required()
});

router.get("/", async (req, res, next) => {
  try {
    const books = await Book.find().lean();
    res.json({ ok: true, data: books });
  } catch (err) {
    next(err);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();

    if (!q) {
      const books = await Book.find().lean();
      return res.json({ ok: true, data: books });
    }

    const books = await Book.find({
      $text: { $search: q }
    }).lean();

    res.json({ ok: true, data: books });
  } catch (err) {
    next(err);
  }
});

router.get("/:id([0-9a-fA-F]{24})", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, error: "Invalid id" });
    }
    const book = await Book.findById(id).lean();
    if (!book) {
      return res.status(404).json({ ok: false, error: "Book not found" });
    }
    res.json({ ok: true, data: book });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error, value } = bookSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ ok: false, error: error.details.map(d => d.message) });
    }
    const doc = await Book.create({
      ...value,
      authorId: new mongoose.Types.ObjectId(value.authorId)
    });
    res.status(201).json({ ok: true, data: doc });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, error: "Invalid id" });
    }
    const { error, value } = bookSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ ok: false, error: error.details.map(d => d.message) });
    }
    const updated = await Book.findByIdAndUpdate(
      id,
      { ...value, authorId: new mongoose.Types.ObjectId(value.authorId) },
      { new: true }
    ).lean();
    if (!updated) {
      return res.status(404).json({ ok: false, error: "Book not found" });
    }
    res.json({ ok: true, data: updated });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, error: "Invalid id" });
    }
    const deleted = await Book.findByIdAndDelete(id).lean();
    if (!deleted) {
      return res.status(404).json({ ok: false, error: "Book not found" });
    }
    res.json({ ok: true, data: { id: deleted._id } });
  } catch (err) {
    next(err);
  }
});

export default router;