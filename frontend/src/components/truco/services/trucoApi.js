import axios from "axios";

import backendURL
  from "../../../config.js";

const API = axios.create({

  baseURL:
    `${backendURL}/truco`
});

export const guardarPartida =
  (data) => API.post("/", data);

export const obtenerHistorial =
  () => API.get("/");

export const borrarPartida =
  (id) => API.delete(`/${id}`);

export const obtenerRanking =
  () => API.get("/ranking");

export const obtenerJugadores = 
  () => API.get("/jugadores");

export const crearJugador =
  (data) => API.post("/jugadores", data);

export const eliminarJugador =
  (id) => API.delete(`/jugadores/${id}`);