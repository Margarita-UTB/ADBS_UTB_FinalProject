import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./Home";
import bookdescription from "./book_description";
import authordescription from "./pages/author_description";
import "./App.css";

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
          <Link to="/author">Author</Link>
        </div>
        {/* Botón para crear nuevo animal */}
        <button className="new-btn" onClick={() => navigate("/book/new")}>New</button>
      </header>
      <main>
        {/* Definición de rutas y componentes asociados */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books/new" element={<bookdescription mode="create" />} />
          <Route path="/books/:id" element={<bookdescription mode="view" />} />
          <Route path="/books/:id/edit" element={<bookdescription mode="edit" />} />
          <Route path="/authors" element={<Authors />} />
        </Routes>
      </main>
    </div>
  )
}

export default App