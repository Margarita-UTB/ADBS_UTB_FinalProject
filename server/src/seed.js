// cunaod se inicia el servidor/pagina web, para tener unos libros7autores por defecto

import mongoose from "mongoose";
import Book from "./models/Books.js";
import Author from "./models/Authors.js";

// URI de conexión por defecto
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Library";

async function run() {
  // Conectar a la base de datos
  await mongoose.connect(MONGO_URI);

  // Limpiar colecciones existentes (borrar datos antiguos)
  // .catch(() => {}) ignora errores si la colección no existe
  await Book.collection.drop().catch(() => {});
  await Author.collection.drop().catch(() => {});

  // Crear refugios de ejemplo
  const author = await Author.insertMany([
    { name: "", 
        biography: "", 
        bookspublished: "" },
    { name: "Ana Huang",
        biography: "#1 bestselling American romance author, known for viral BookTok"
                    +"sensations like the Twisted series, who started writing as a child"
                    +"to improve her English as the daughter of Chinese immigrants", 
        bookspublished: "If love series, Twisted Love, Twisted Games, Twisted Hate, Twisted Lies, King of sins series" },
    { name: "", 
        biography: "", 
        bookspublished: "" },
    { name: "", 
        biography: "", 
        bookspublished: "" },
    { name: "", 
        biography: "", 
        bookspublished: "" }
  ]);

  const [s1, s2, s3, s4, s5] = Author;

  // Crear libros de ejemplo y asignarlos a los refugios creados
  await Book.insertMany([
    { name: "", authorId: "s1._id", genre: "", 
        synopsis: "" },
    { name: "Twisted Games", authorId: "s2._id", genre: "Contemporary Romace", 
        synopsis: "Princess Bridget von Ascheberg and her stoic, broody royal bodyguard, Rhys Larsen, exploring their forbidden"
                +"enemies-to-lovers relationship as duty clashes with desire when she faces a potential marriage and throne she"
                +"never wanted, all while navigating royal expectations and hidden passion" },
    { name: "", authorId: "s3._id", genre: "", 
        synopsis: "" },
    { name: "", authorId: "s4._id", genre: "", 
        synopsis: "" },
    { name: "", authorId: "s5._id", genre: "", 
        synopsis: "" }
  ]);

  console.log("Seed completed");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});