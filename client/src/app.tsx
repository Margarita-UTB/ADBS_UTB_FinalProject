import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./home";
import BookDescription from "./book_description";
import AuthorDescription from "./author_description";
import "./app.css";

// Componente principal de la aplicación
// Define la estructura base (header, navegación) y las rutas
function App() {
  const navigate = useNavigate();

  return (
    <div className="container">
      {/* Cabecera con navegación */}
      <header className="header">
        <div className="nav">
          <Link to="/" className="brand">Library</Link>
          <Link to="/authors">Authors</Link>
        </div>
        {/* Botón para crear nuevo libro */}
        <button className="new-btn" onClick={() => navigate("/books/new")}>New Book</button>
      </header>
      <main>
        {/* Definición de rutas y componentes asociados */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books/new" element={<BookDescription mode="create" />} />
          <Route path="/books/:id" element={<BookDescription mode="view" />} />
          <Route path="/books/:id/edit" element={<BookDescription mode="edit" />} />
          <Route path="/authors" element={<AuthorDescription />} />
        </Routes>
      </main>
    </div>
  )
}

export default App