import mongoose from "mongoose";

const AuthorSchema = new mongoose.Schema({
    name: { type: String, required :true, trim: true},
    biography: { type: String, default: "" },
    bookspublished: { type: String, required :true }
    },
    { timestamps: true }
);

export default mongoose.model("Author", AuthorScheme);