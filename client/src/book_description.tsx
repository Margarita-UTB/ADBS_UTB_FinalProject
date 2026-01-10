import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import type { Book, Author } from "./api";
import { useNavigate, useParams } from "react-router-dom";

type Mode = "view" | "edit" | "create";

// create, edit, view book details
function BookDetails({ mode }: { mode: Mode }) {
  const params = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null); // data from the book
  const [author, setAuthor] = useState<Author | null>(null); // data from the author
  const [authors, setAuthors] = useState<Author[]>([]); // Authors list to choose from
  const [form, setForm] = useState<Book>({ // ""survey"" state
    name: "",
    authorId: "",
    genre: "",
    synopsis: "",
  });
  const [busy, setBusy] = useState(false); // Estado para deshabilitar botones durante peticiones

  // Determines the current mode based on the received prop
  const currentMode: Mode = useMemo(() => {
    if (mode === "create") return "create";
    if (mode === "edit") return "edit";
    return "view";
  }, [mode]);

  // Load book data when in view or edit mode
  useEffect(() => {
    async function load() {
      if (currentMode === "create") return;
      const id = params.id!;
      const { data } = await api.get(`/books/${id}`);
      setBook(data.data);
      // fills the form with the book data
      setForm({
        _id: data.data._id,
        name: data.data.name,
        authorId: data.data.authorId,
        genre: data.data.genre,
        synopsis: data.data.synopsis || ""
      });
      // load author data
      const authorResp = await api.get(`/authors/${data.data.authorId}`);
      setAuthor(authorResp.data.data);
    }
    load();
  }, [params.id, currentMode]);

  // Charge the authors list
  useEffect(() => {
    async function loadAuthors() {
      const { data } = await api.get("/authors");
      setAuthors(data.data);
      // If in create mode, set the first author as default
      if (currentMode === "create" && data.data.length > 0) {
        setForm((prev) => ({ ...prev, authorId: data.data[0]._id }));
      }
    }
    loadAuthors();
  }, [currentMode]);

  // Manege saving (create or update)
  async function onSave() {
    setBusy(true);
    try {
      if (currentMode === "create") {
        await api.post("/books", form);
      } else {
        await api.put(`/books/${form._id}`, form);
      }
      navigate("/"); // return to the home page
    } finally {
      setBusy(false);
    }
  }

  // delete a book
  async function onDelete() {
    if (!book?._id) return;
    setBusy(true);
    try {
      await api.delete(`/books/${book._id}`);
      navigate("/");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {/* VISUAL MODE: Shows details and buttons */}
      {currentMode === "view" && book && (
        <div className="details">
          <div className="name">{book.name}</div>
          <div className="genre">{book.genre}</div>
          <div className="synopsis">{book.synopsis}</div>
          {author && (
            <div className="author">
              <div className="subtitle">Author</div>
              <div>{author.name}</div>
              <div>{author.biography}</div>
              <div>{author.bookspublished}</div>
            </div>
          )}
          <div className="actions">
            <button className="btn btn-primary" onClick={() => navigate(`/books/${book._id}/edit`)}>Editar</button>
            <button className="btn btn-danger" onClick={onDelete}>Eliminar</button>
          </div>
        </div>
      )}

      {/* EDIT/CREATE MODE: Shows the form */}
      {(currentMode === "edit" || currentMode === "create") && (
        <form className="form" onSubmit={(e) => { e.preventDefault(); onSave(); }}>
          <label>
            Name
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            Genre
            <input className="input" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} />
          </label>
          {/* <label>
            Synopsis
            <input className="input" value={form.synopsis} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} />
          </label> */}
          <label>
            Author
            <select className="select" value={form.authorId} onChange={(e) => setForm({ ...form, authorId: e.target.value })}>
              {authors.map((a) => (
                <option key={a._id} value={a._id}>{a.name}</option>
              ))}
            </select>
          </label>
          <label>
            Synopsis
            <textarea className="textarea" value={form.synopsis} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} />
          </label>
          <div className="actions">
            <button className="btn btn-primary" type="submit" disabled={busy}>{currentMode === "create" ? "Crear" : "Guardar"}</button>
            {currentMode === "edit" && (
              <button type="button" className="btn btn-danger" onClick={onDelete} disabled={busy}>Eliminar</button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

export default BookDetails;