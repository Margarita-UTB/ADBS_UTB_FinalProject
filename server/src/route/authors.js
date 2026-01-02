import express from "express";
import mongoose from "mongoose";
import Joi from "joi";
import Author from "../models/Authors.js";

const router = express.Router();

const authorSchema = Joi.object({
  name: Joi.string().min(1).required(),
  biography: Joi.string().min(1).required(),
  bookspublished: Joi.string().min(1).required()
});

router.get("/", async (req, res, next) => {
  try {
    const authors = await Author.find().lean();
    res.json({ ok: true, data: author });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, error: "Invalid id" });
    }
    const author = await Author.findById(id).lean();
    if (!author) {
      return res.status(404).json({ ok: false, error: "Author not found" });
    }
    res.json({ ok: true, data: author });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error, value } = authorSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ ok: false, error: error.details.map(d => d.message) });
    }
    const doc = await Author.create(value);
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
    const { error, value } = authorSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ ok: false, error: error.details.map(d => d.message) });
    }
    const updated = await Author.findByIdAndUpdate(id, value, { new: true }).lean();
    if (!updated) {
      return res.status(404).json({ ok: false, error: "Author not found" });
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
    const deleted = await Author.findByIdAndDelete(id).lean();
    if (!deleted) {
      return res.status(404).json({ ok: false, error: "Author not found" });
    }
    res.json({ ok: true, data: { id: deleted._id } });
  } catch (err) {
    next(err);
  }
});

export default router;