import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    name: { type: String, required :true, trim: true},
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "author", required: true},
    genre: { type: String, default: "" },
    synopsis: { type: String, required :true }
    },
    { timestamps: true }
);

BookSchema.index({name : "text", description: "text" });

export default mongoose.model("Book", BookSchema);