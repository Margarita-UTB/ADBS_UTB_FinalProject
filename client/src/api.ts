import axios from "axios";

let API_BASE = "http://localhost:4000";

if (typeof window !== "undefined") {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  if (hostname.includes("app.github.dev")) {
    const apiHost = hostname.replace("-5173.app.github.dev", "-4000.app.github.dev");
    API_BASE = `${protocol}//${apiHost}`;
  }
}

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" }
});

export type Book = {
  _id?: string;
  name: string;
  authorId: string;
  genre: string;
  synopsis: string;
};

export type Author = {
  _id: string;
  name: string;
  biography: string;
  bookspublished: string;
};