// pantalla de home

import { useEffect, useState } from "react";
import { api } from "./api";
import type { Book } from "./api";
import { useNavigate } from "react-router-dom";

interface Author {
  name: string;
  [key: string]: unknown;
}

// Componente de la página principal (Home)
// Muestra el listado de libros con buscador
function Home() {
  const [books, setBooks] = useState<Book[]>([]); // Estado para lista de libros
  const [q, setQ] = useState(""); // Estado para el texto de búsqueda
  const [loading, setLoading] = useState(false); // Estado de carga
  const navigate = useNavigate(); // Hook para navegación

  // Función asíncrona para obtener libros de la API
  async function fetchBooks(query?: string) {
    setLoading(true);
    try {
      // Si hay query usa el endpoint de búsqueda, si no, el listado general
      const url = query ? `/books/search?q=${encodeURIComponent(query)}` : "/books";
      const { data } = await api.get(url);
      setBooks(data.data);
    } catch {
      setBooks([]); // En caso de error, limpia la lista
    } finally {
      setLoading(false);
    }
  }

  // Carga inicial de libros al montar el componente
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      {/* Barra de herramientas con buscador */}
      <div className="toolbar">
        <input
          className="input"
          placeholder="Search books"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn btn-outline" onClick={() => fetchBooks(q)}>Search</button>
      </div>
      
      {/* Indicador de carga */}
      {loading && <div>Loading your next adventure...</div>}
      
      {/* Mensaje si no hay resultados */}
      {!loading && books.length === 0 && (
        <div className="empty">There are no books for now. Add one using the button “New”.</div>
      )}
      
      {/* Lista de tarjetas de libros */}
      <ul className="list">
        {books.map((a) => (
          <li key={a._id} className="card" onClick={() => navigate(`/books/${a._id}`)}>
            <div className="title">{a.name}</div>
            <div className="genero">{a.genre} • {typeof a.authorId === 'object' ? (a.authorId as Author).name : a.authorId}</div>
            <div className="synopsis">{a.synopsis}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;