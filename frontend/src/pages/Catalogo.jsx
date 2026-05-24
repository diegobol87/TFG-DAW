import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_URL =
  "https://game-store-hnoj.onrender.com/games/";

const API_CART =
  "https://game-store-hnoj.onrender.com/cart/";

export default function Catalogo() {

  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("todos");
  const [genreFilter, setGenreFilter] = useState("todos");
  const [cartCount, setCartCount] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);

  const juegosPorPagina = 12;

  const token = localStorage.getItem("token");

  useEffect(() => {

    loadGames();
    updateCartCounter();

  }, [paginaActual]);

  useEffect(() => {

    applyFilters();

  }, [search, platformFilter, genreFilter, games]);

  async function updateCartCounter() {

    if (!token) {
      setCartCount(0);
      return;
    }

    try {

      const response = await fetch(API_CART, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        setCartCount(0);
        return;
      }

      const cart = await response.json();

      setCartCount(cart.items?.length || 0);

    } catch (error) {

      console.error(error);
      setCartCount(0);

    }

  }

  async function loadGames() {

    try {

      setLoading(true);

      const response = await fetch(
        `${API_URL}?page=${paginaActual}&size=${juegosPorPagina}`
      );

      if (!response.ok) {
        throw new Error("Error al cargar videojuegos");
      }

      const data = await response.json();

      setGames(data);

    } catch (error) {

      console.error(error);
      setGames([]);

    } finally {

      setLoading(false);

    }

  }

  function applyFilters() {

    const texto =
      search.toLowerCase();

    const filtered =
      games.filter((game) => {

        const title =
          game.title || "";

        const genre =
          game.genre || "";

        const platform =
          game.platform || "";

        const matchesSearch =

          title.toLowerCase().includes(texto) ||

          genre.toLowerCase().includes(texto) ||

          platform.toLowerCase().includes(texto);

        const matchesPlatform =

          platformFilter === "todos" ||

          platform === platformFilter;

        const matchesGenre =

          genreFilter === "todos" ||

          genre.toLowerCase().includes(genreFilter.toLowerCase());

        return matchesSearch && matchesPlatform && matchesGenre;

      });

    setFilteredGames(filtered);

  }

  function paginaAnterior() {

    if (paginaActual > 1) {

      setPaginaActual(paginaActual - 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }

  }

  function paginaSiguiente() {

    if (games.length === juegosPorPagina) {

      setPaginaActual(paginaActual + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }

  }

  function resetFilters() {

    setSearch("");
    setPlatformFilter("todos");
    setGenreFilter("todos");

  }

  return (

    <div className="bg-slate-950 text-white min-h-screen">

      <Navbar cartCount={cartCount} />

      <section className="py-20 md:py-28 px-6 text-center">

        <div className="max-w-5xl mx-auto">

          <h1 className="text-4xl md:text-7xl font-black mb-8 leading-tight">
            Explora el mejor catálogo gaming
          </h1>

          <p className="text-slate-400 text-lg md:text-2xl leading-relaxed">
            Descubre los títulos más vendidos y experiencias épicas para todas las plataformas.
          </p>

        </div>

      </section>

      <section className="max-w-5xl mx-auto px-6 mb-10">

        <input
          type="text"
          placeholder="Buscar videojuegos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-2xl p-5 text-lg md:text-xl outline-none"
        />

      </section>

      <section className="max-w-7xl mx-auto px-6 mb-8">

        <h2 className="text-center text-cyan-400 font-black tracking-[0.2em] mb-6">
          FILTRAR POR PLATAFORMA
        </h2>

        <div className="flex flex-wrap justify-center gap-4">

          <button
            onClick={() => setPlatformFilter("todos")}
            className={`px-6 py-3 rounded-2xl font-black transition ${
              platformFilter === "todos"
                ? "bg-cyan-400 text-black"
                : "bg-slate-900 border border-slate-700"
            }`}
          >
            Todas
          </button>

          <button
            onClick={() => setPlatformFilter("PC")}
            className={`px-6 py-3 rounded-2xl font-black transition ${
              platformFilter === "PC"
                ? "bg-cyan-400 text-black"
                : "bg-slate-900 border border-slate-700"
            }`}
          >
            PC
          </button>

          <button
            onClick={() => setPlatformFilter("PlayStation 5")}
            className={`px-6 py-3 rounded-2xl font-black transition ${
              platformFilter === "PlayStation 5"
                ? "bg-cyan-400 text-black"
                : "bg-slate-900 border border-slate-700"
            }`}
          >
            PlayStation 5
          </button>

          <button
            onClick={() => setPlatformFilter("PlayStation 4")}
            className={`px-6 py-3 rounded-2xl font-black transition ${
              platformFilter === "PlayStation 4"
                ? "bg-cyan-400 text-black"
                : "bg-slate-900 border border-slate-700"
            }`}
          >
            PlayStation 4
          </button>

        </div>

      </section>

      <section className="max-w-7xl mx-auto px-6 mb-16">

        <h2 className="text-center text-cyan-400 font-black tracking-[0.2em] mb-6">
          FILTRAR POR GÉNERO
        </h2>

        <div className="flex flex-wrap justify-center gap-4">

          <button
            onClick={() => setGenreFilter("todos")}
            className={`px-6 py-3 rounded-2xl font-black transition ${
              genreFilter === "todos"
                ? "bg-cyan-400 text-black"
                : "bg-slate-900 border border-slate-700"
            }`}
          >
            Todos
          </button>

          <button
            onClick={() => setGenreFilter("Action")}
            className={`px-6 py-3 rounded-2xl font-black transition ${
              genreFilter === "Action"
                ? "bg-cyan-400 text-black"
                : "bg-slate-900 border border-slate-700"
            }`}
          >
            Acción
          </button>

          <button
            onClick={() => setGenreFilter("Adventure")}
            className={`px-6 py-3 rounded-2xl font-black transition ${
              genreFilter === "Adventure"
                ? "bg-cyan-400 text-black"
                : "bg-slate-900 border border-slate-700"
            }`}
          >
            Aventura
          </button>

          <button
            onClick={() => setGenreFilter("RPG")}
            className={`px-6 py-3 rounded-2xl font-black transition ${
              genreFilter === "RPG"
                ? "bg-cyan-400 text-black"
                : "bg-slate-900 border border-slate-700"
            }`}
          >
            RPG
          </button>

          <button
            onClick={() => setGenreFilter("Shooter")}
            className={`px-6 py-3 rounded-2xl font-black transition ${
              genreFilter === "Shooter"
                ? "bg-cyan-400 text-black"
                : "bg-slate-900 border border-slate-700"
            }`}
          >
            Shooter
          </button>

          <button
            onClick={() => setGenreFilter("Sports")}
            className={`px-6 py-3 rounded-2xl font-black transition ${
              genreFilter === "Sports"
                ? "bg-cyan-400 text-black"
                : "bg-slate-900 border border-slate-700"
            }`}
          >
            Deportes
          </button>

          <button
            onClick={() => setGenreFilter("Racing")}
            className={`px-6 py-3 rounded-2xl font-black transition ${
              genreFilter === "Racing"
                ? "bg-cyan-400 text-black"
                : "bg-slate-900 border border-slate-700"
            }`}
          >
            Carreras
          </button>

          <button
            onClick={resetFilters}
            className="px-6 py-3 rounded-2xl font-black transition bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30"
          >
            Limpiar filtros
          </button>

        </div>

      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">

        {loading ? (

          <div className="text-center py-20 text-3xl text-slate-400">
            Cargando videojuegos...
          </div>

        ) : filteredGames.length === 0 ? (

          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-14 text-center">

            <h2 className="text-4xl font-black mb-4">
              No se encontraron videojuegos
            </h2>

            <p className="text-slate-400 text-xl">
              Prueba con otra búsqueda o cambia los filtros seleccionados.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">

            {filteredGames.map((game) => (

              <div
                key={game.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-400 transition flex flex-col h-full"
              >

                <img
                  src={game.image_url || "/assets/images/default.jpg"}
                  alt={game.title}
                  className="w-full h-72 object-cover"
                />

                <div className="p-7 flex flex-col flex-grow">

                  <div className="flex-grow">

                    <h2 className="text-3xl font-black mb-4 min-h-[96px] flex items-start">
                      {game.title}
                    </h2>

                    <p className="text-slate-400 mb-2">
                      🎮 {game.platform}
                    </p>

                    <p className="text-slate-500 mb-6">
                      {game.genre}
                    </p>

                  </div>

                  <div className="mt-auto">

                    <div className="flex justify-between items-center mb-6">

                      <span className="text-cyan-400 text-3xl font-black">
                        {game.price === 0
                          ? "Gratis"
                          : `${game.price.toFixed(2)}€`}
                      </span>

                      <span className="text-slate-400">
                        Stock: {game.stock}
                      </span>

                    </div>

                    <a
                      href={`/producto/${game.id}`}
                      className="block bg-cyan-400 hover:bg-cyan-300 transition text-black font-black py-4 rounded-2xl text-center"
                    >
                      Ver videojuego
                    </a>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      <section className="max-w-7xl mx-auto px-6 pb-32">

        <div className="flex justify-center items-center gap-6 flex-wrap">

          <button
            onClick={paginaAnterior}
            disabled={paginaActual === 1}
            className="bg-slate-900 border border-slate-700 hover:border-cyan-400 disabled:opacity-40 disabled:hover:border-slate-700 transition px-8 py-4 rounded-2xl font-black"
          >
            ← Anterior
          </button>

          <div className="text-white text-xl font-black">
            Página {paginaActual}
          </div>

          <button
            onClick={paginaSiguiente}
            disabled={games.length < juegosPorPagina}
            className="bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 transition text-black px-8 py-4 rounded-2xl font-black"
          >
            Siguiente →
          </button>

        </div>

      </section>

    </div>

  );

}