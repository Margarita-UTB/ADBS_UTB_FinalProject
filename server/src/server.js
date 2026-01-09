// une tod el backend, conecta el back con el front

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import booksRouter from "./route/books.js";
import authorsRouter from "./route/authors.js";
import Book from "./models/Books.js";
import Author from "./models/Authors.js";

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
    const authors = await Author.insertMany([
      { name: "Jane Austen", 
        biography: "", 
        bookspublished: "Pried and Prejudice, Emma, Sense and Sensibility" },
      { name: "Ana Huang",
        biography: "#1 bestselling American romance author, known for viral BookTok"
                    +"sensations like the Twisted series, who started writing as a child"
                    +"to improve her English as the daughter of Chinese immigrants", 
        bookspublished: "If love series, Twisted Love, Twisted Games, Twisted Hate, Twisted Lies, King of sins series" },
      { name: "Bram Stoker", 
        biography: "born sickly in Dublin, he overcame childhood illness to excel at Trinity College and work as a civil servant,"
                    +" drama critic, and eventually business manager for actor Henry Irving in London, a role that defined much of his"
                    +" professional life until his death from exhaustion", 
        bookspublished: "Dracula, The mistery of the sea, Under the sunset" },
      { name: "Sarah J. Maas", 
        biography: "A graduate of Hamilton College, she began writing as a teenager, posting early work on fanfiction sites before her "
                    +"books were acquired by publishers, becoming massive international bestsellers", 
        bookspublished: "Throne of glass saga, A court of Thorns and Roses" },
      { name: "Stephenie Meyer", 
        biography: "", 
        bookspublished: "Twilight Saga, The Host" }
    ]);
    if (ac < 5) {
      const [s1, s2, s3, s4, s5] = authors;
      await Book.insertMany([
        { name: "ried and Prejudice", 
          authorId: s1._id, 
          genre: "Romatic Comedy", 
          synopsis: "Pride and Prejudice by Jane Austen follows witty Elizabeth Bennet and wealthy, arrogant Mr. Darcy, as they overcome"
                +"initial dislike, fueled by misunderstandings and class differences, to find love in Regency England, alongside Elizabeth's"
                +"sister Jane's romance with Darcy's friend Bingley, exploring themes of marriage, manners, and social standing" },
        { name: "Twisted Games", 
          authorId: s2._id, 
          genre: "Contemporary Romace", 
          synopsis: "Princess Bridget von Ascheberg and her stoic, broody royal bodyguard, Rhys Larsen, exploring their forbidden"
                +"enemies-to-lovers relationship as duty clashes with desire when she faces a potential marriage and throne she"
                +"never wanted, all while navigating royal expectations and hidden passion" },
        { name: "Dracula", 
          authorId: s3._id, 
          genre: "Horror", 
          synopsis: "the vampire Count Dracula's attempt to move from Transylvania to England to spread his undead curse, clashing with a" 
                +"group led by Professor Van Helsing who hunts him down using diaries, letters, and scientific methods to protect victims"
                +"like Lucy Westenra and ultimately destroy the Count" },
        { name: "A court of silver flames", 
          authorId: s4._id, 
          genre: "Fantasy-Romance", 
          synopsis: "follows Nesta Archeron's journey of healing and self-discovery as she deals with severe trauma from the war, becoming self-destructive "
                +"until she's forced to train with the Illyrian warrior Cassian, sparking an intense, fiery romance "
                +"and a path to empowerment as they confront both internal demons and external political threats to the Fae realms" },
        { name: "new moon", 
          authorId: s5._id, 
          genre: "Fantasy-Romance", 
          synopsis: "Bella and Edward face a devastating separation, the mysterious appearance of dangerous wolves roaming the forest in Forks,"
                +" a terrifying threat of revenge from a female vampire and a deliciously sinister encounter with Italys reigning royal family"
                +"of vampires, the Volturi." }
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