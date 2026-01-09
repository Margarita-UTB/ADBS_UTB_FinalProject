import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import type { Book, Author } from "./api";
import { useNavigate, useParams } from "react-router-dom";

type Mode = "view" | "edit" | "create";

// Componente para ver detalles, crear o editar un libro
// Recibe el modo de operación como prop
function BookDetails({ mode }: { mode: Mode }) {
  const params = useParams(); // Obtiene parámetros de la URL (ej: id)
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null); // Datos del libro actual
  const [author, setAuthor] = useState<Author | null>(null); // Datos del autor asociado
  const [authors, setAuthors] = useState<Author[]>([]); // Lista de autores disponibles para el select
  const [form, setForm] = useState<Book>({ // Estado del formulario
    name: "",
    authorId: "",
    genre: "",
    synopsis: "",
  });
  const [busy, setBusy] = useState(false); // Estado para deshabilitar botones durante peticiones

  // Determina el modo actual basándose en la prop recibida
  const currentMode: Mode = useMemo(() => {
    if (mode === "create") return "create";
    if (mode === "edit") return "edit";
    return "view";
  }, [mode]);

  // Efecto para cargar los datos del animal si estamos en modo view o edit
  useEffect(() => {
    async function load() {
      if (currentMode === "create") return;
      const id = params.id!;
      const { data } = await api.get(`/books/${id}`);
      setBook(data.data);
      // Rellena el formulario con los datos cargados
      setForm({
        _id: data.data._id,
        name: data.data.name,
        authorId: data.data.authorId,
        genre: data.data.genre,
        synopsis: data.data.synopsis || ""
      });
      // Carga información extra del autor para mostrar en modo vista
      const authorResp = await api.get(`/authors/${data.data.authorId}`);
      setAuthor(authorResp.data.data);
    }
    load();
  }, [params.id, currentMode]);

  // Efecto para cargar la lista de autores (necesaria para el dropdown en crear/editar)
  useEffect(() => {
    async function loadAuthors() {
      const { data } = await api.get("/authors");
      setAuthors(data.data);
      // Si estamos creando, pre-selecciona el primer autor por defecto
      if (currentMode === "create" && data.data.length > 0) {
        setForm((prev) => ({ ...prev, authorId: data.data[0]._id }));
      }
    }
    loadAuthors();
  }, [currentMode]);

  // Maneja el envío del formulario (Crear o Actualizar)
  async function onSave() {
    setBusy(true);
    try {
      if (currentMode === "create") {
        await api.post("/books", form);
      } else {
        await api.put(`/books/${form._id}`, form);
      }
      navigate("/"); // Vuelve al home tras guardar
    } finally {
      setBusy(false);
    }
  }

  // Maneja la eliminación del libro
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
      {/* MODO VISTA: Muestra detalles y botones de acción */}
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

      {/* MODO EDICIÓN / CREACIÓN: Muestra formulario */}
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