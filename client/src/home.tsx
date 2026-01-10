import { useEffect, useState } from "react";
import { api } from "./api";
import type { Book } from "./api";
import { useNavigate } from "react-router-dom";

interface Author {
  name: string;
  [key: string]: unknown;
}

// Home Main component 
// Shows list of books
function Home() {
  const [books, setBooks] = useState<Book[]>([]); // State for the list of books
  const [q, setQ] = useState(""); // State for the search text
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate(); // Hook for navigation

  // Asynchronous function to fetch books from the API
  async function fetchBooks(query?: string) {
    setLoading(true);
    try {
      // If there is a query, use the search endpoint, otherwise use the general list
      const url = query ? `/books/search?q=${encodeURIComponent(query)}` : "/books";
      const { data } = await api.get(url);
      setBooks(data.data);
    } catch {
      setBooks([]); // if error, clear the list
    } finally {
      setLoading(false);
    }
  }

  // Initial load of books
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      {/* Tools bar */}
      <div className="toolbar">
        <input
          className="input"
          placeholder="Search books"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn btn-outline" onClick={() => fetchBooks(q)}>Search</button>
      </div>
      
      {/* loading indicator */}
      {loading && <div>Loading your next adventure...</div>}
      
      {/* Message if no results */}
      {!loading && books.length === 0 && (
        <div className="empty">There are no books for now. Add one using the button “New Book”.</div>
      )}
      
      {/* List of book cards */}
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