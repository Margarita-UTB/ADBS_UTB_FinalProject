import { useEffect, useState } from "react";
import { api } from "./api";
import type { Author } from "./api";

// Manage authors: list, create, edit, delete
function Author() {
  const [author, setAuthor] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // ID del refugio que se está editando
  const [form, setForm] = useState<{ name: string; biography: string; bookspublished: string }>({
    name: "",
    biography: "",
    bookspublished: ""
  });

  // list of authors
  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/authors");
      setAuthor(data.data);
    } finally {
      setLoading(false);
    }
  }

  // initial load
  useEffect(() => {
    load();
  }, []);

  // create a new author
  async function createAuthor() {
    await api.post("/authors", form);
    setForm({ name: "", biography: "", bookspublished: "" });
    await load(); // Recharge the list
  }

  // update an existing author
  async function updateAuthor(id: string) {
    await api.put(`/authors/${id}`, form);
    setEditingId(null); // exits edition mode
    await load();
  }

  // deletes an author
  async function deleteAuthor(id: string) {
    await api.delete(`/authors/${id}`);
    await load();
  }

  return (
    <div>
      <div className="subtitle">Crear nuevo author</div>
      {/* creation "survey" */}
      <form className="form" onSubmit={(e) => { e.preventDefault(); createAuthor(); }}>
        <label>
          Nombre
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>
          Bibliografía
          <input className="input" value={form.biography} onChange={(e) => setForm({ ...form, biography: e.target.value })} />
        </label>
        <label>
          Libros publicados
          <input className="input" value={form.bookspublished} onChange={(e) => setForm({ ...form, bookspublished: e.target.value })} />
        </label>
        <div className="actions">
          <button className="btn btn-primary" type="submit">Crear</button>
        </div>
      </form>

      <div className="subtitle">Authors</div>
      {loading && <div>Loading...</div>}
      <ul className="list">
        {author.map((s) => (
          <li key={s._id} className="card">
            {/* If editingId coincides an author, show the edit form */}
            {editingId === s._id ? (
              <form className="form" onSubmit={(e) => { e.preventDefault(); updateAuthor(s._id); }}>
                <label>
                  Nombre
                  <input className="input" defaultValue={s.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>
                <label>
                  Bibliografía
                  <input className="input" defaultValue={s.biography} onChange={(e) => setForm({ ...form, biography: e.target.value })} />
                </label>
                <label>
                  Libros publicados
                  <input className="input" defaultValue={s.bookspublished} onChange={(e) => setForm({ ...form, bookspublished: e.target.value })} />
                </label>
                <div className="actions">
                  <button className="btn btn-primary" type="submit">Guardar</button>
                  <button className="btn btn-outline" type="button" onClick={() => setEditingId(null)}>Cancelar</button>
                </div>
              </form>
            ) : (
              /* visualization of the author card */
              <>
                <div className="title">{s.name}</div>
                <div>{s.biography}</div>
                <div>Libros publicados: {s.bookspublished}</div>
                <div className="actions">
                  <button className="btn btn-outline" onClick={() => { setEditingId(s._id); setForm({ name: s.name, biography: s.biography, bookspublished: s.bookspublished }); }}>Editar</button>
                  <button className="btn btn-danger" onClick={() => deleteAuthor(s._id)}>Eliminar</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Author;