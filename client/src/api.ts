import axios from "axios";

// Detecta si está en Codespaces y ajusta la URL de la API
let API_BASE = "http://localhost:4000";

if (typeof window !== "undefined") {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  if (hostname.includes("app.github.dev")) {
    // En Codespaces: reemplaza el puerto 5173 con 4000
    const apiHost = hostname.replace("-5173.app.github.dev", "-4000.app.github.dev");
    API_BASE = `${protocol}//${apiHost}`;
  }
}

// Instancia de axios preconfigurada
export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" }
});

// Definición de tipos TypeScript para Book
export type Book = {
  _id?: string; // Opcional porque al crear no tiene ID aún
  name: string;
  authorId: string;
  genre: string;
  synopsis: string;
};

// Definición de tipos TypeScript para Author
export type Author = {
  _id: string;
  name: string;
  biography: string;
  bookspublished: string;
};