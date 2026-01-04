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

  const [s1, s2, s3, s4, s5] = Author;

  // Crear libros de ejemplo y asignarlos a los refugios creados
  await Book.insertMany([
    { name: "ried and Prejudice", authorId: "s1._id", genre: "Romatic Comedy", 
        synopsis: "Pride and Prejudice by Jane Austen follows witty Elizabeth Bennet and wealthy, arrogant Mr. Darcy, as they overcome"
                +"initial dislike, fueled by misunderstandings and class differences, to find love in Regency England, alongside Elizabeth's"
                +"sister Jane's romance with Darcy's friend Bingley, exploring themes of marriage, manners, and social standing" },
    { name: "Twisted Games", authorId: "s2._id", genre: "Contemporary Romace", 
        synopsis: "Princess Bridget von Ascheberg and her stoic, broody royal bodyguard, Rhys Larsen, exploring their forbidden"
                +"enemies-to-lovers relationship as duty clashes with desire when she faces a potential marriage and throne she"
                +"never wanted, all while navigating royal expectations and hidden passion" },
    { name: "Dracula", authorId: "s3._id", genre: "Horror", 
        synopsis: "the vampire Count Dracula's attempt to move from Transylvania to England to spread his undead curse, clashing with a" 
                +"group led by Professor Van Helsing who hunts him down using diaries, letters, and scientific methods to protect victims"
                +"like Lucy Westenra and ultimately destroy the Count" },
    { name: "A court of silver flames", authorId: "s4._id", genre: "Fantasy-Romance", 
        synopsis: "follows Nesta Archeron's journey of healing and self-discovery as she deals with severe trauma from the war, becoming self-destructive "
                +"until she's forced to train with the Illyrian warrior Cassian, sparking an intense, fiery romance "
                +"and a path to empowerment as they confront both internal demons and external political threats to the Fae realms" },
    { name: "new moon", authorId: "s5._id", genre: "Fantasy-Romance", 
        synopsis: "Bella and Edward face a devastating separation, the mysterious appearance of dangerous wolves roaming the forest in Forks,"
                +" a terrifying threat of revenge from a female vampire and a deliciously sinister encounter with Italys reigning royal family"
                +"of vampires, the Volturi." }
  ]);

  console.log("Seed completed");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});