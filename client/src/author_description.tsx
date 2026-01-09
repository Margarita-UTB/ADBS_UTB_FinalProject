import { useEffect, useState } from "react";
import { api } from "./api";
import type { Author } from "./api";

// Componente para la gestión de refugios (Listar, Crear, Editar, Eliminar)
function Author() {
  const [author, setAuthor] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // ID del refugio que se está editando
  const [form, setForm] = useState<{ name: string; biography: string; bookspublished: string }>({
    name: "",
    biography: "",
    bookspublished: ""
  });

  // Carga la lista de refugios
  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/authors");
      setAuthor(data.data);
    } finally {
      setLoading(false);
    }
  }

  // Carga inicial
  useEffect(() => {
    load();
  }, []);

  // Crea un nuevo refugio
  async function createAuthor() {
    await api.post("/authors", form);
    setForm({ name: "", biography: "", bookspublished: "" }); // Limpia el formulario
    await load(); // Recarga la lista
  }

  // Actualiza un refugio existente
  async function updateAuthor(id: string) {
    await api.put(`/authors/${id}`, form);
    setEditingId(null); // Sale del modo edición
    await load();
  }

  // Elimina un author
  async function deleteAuthor(id: string) {
    await api.delete(`/authors/${id}`);
    await load();
  }

  return (
    <div>
      <div className="subtitle">Crear nuevo author</div>
      {/* Formulario de creación */}
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
            {/* Si editingId coincide con este author, muestra formulario de edición */}
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
              /* Vista normal de la tarjeta del author */
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