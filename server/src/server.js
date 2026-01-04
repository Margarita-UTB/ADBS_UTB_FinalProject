// une tod el backend, conecta el back con el front

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import booksRouter from "./routes/books.js";
import authorsRouter from "./routes/authors.js";
import Book from "./models/Book.js";
import Author from "./models/Author.js";

const app = express();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/library";
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors()); // Permite todos los orígenes para facilitar el desarrollo local
app.use(express.json()); // Parsea cuerpos JSON
app.use(morgan("dev")); // Log de peticiones HTTP en consola

// Endpoint de salud / estado
app.get("/", async (req, res) => {
  const count = await Book.countDocuments();
  res.json({ ok: true, service: "library-api", books: count });
});

// Rutas de la API
app.use("/books", booksRouter);
app.use("/authors", authorsRouter);

// Manejo global de errores
app.use((err, req, res, next) => {
  res.status(500).json({ ok: false, error: "Internal server error" });
});

// Función para asegurar datos iniciales (semilla) si la DB está vacía
async function ensureSeed() {
  const sc = await Author.countDocuments();
  const ac = await Book.countDocuments();
  if (sc < 5) {
    const author = await Author.insertMany([
      
    ]);
    if (ac < 5) {
      const [s1, s2, s3, s4, s5] = authors;
      await Book.insertMany([
        
      ]);
    }
  }
}

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB at ${MONGO_URI}`);
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
  
  await ensureSeed();
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch(() => {
  process.exit(1);
});