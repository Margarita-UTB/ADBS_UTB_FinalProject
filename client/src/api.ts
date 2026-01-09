import axios from "axios";

// URL base de la API, tomada de variables de entorno o por defecto a localhost:4000
const API_BASE = "http://localhost:4000";

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

// Definición de tipos TypeScript para Auhtor
export type Author = {
  _id: string;
  name: string;
  bibliography: string;
  bookspublished: string;
};