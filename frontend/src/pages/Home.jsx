import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_URL =
  "https://game-store-hnoj.onrender.com/games/?page=1&size=20";

const CART_API =
  "https://game-store-hnoj.onrender.com/cart/";

export default function Home() {

  const [games, setGames] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadFeaturedGames();
    updateCartCounter();
  }, []);

  async function updateCartCounter() {

    if (!token) {
      setCartCount(0);
      return;
    }

    try {

      const response = await fetch(CART_API, {
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

  async function loadFeaturedGames() {

    try {

      const response = await fetch(API_URL);

      const data = await response.json();

      setGames(data.slice(0, 5));

    } catch (error) {

      console.error(error);

    }

  }

  return (

    <div className="bg-slate-950 text-white min-h-screen">

      <Navbar cartCount={cartCount} />

      <section className="py-20 md:py-32 px-6 text-center">

        <div className="max-w-5xl mx-auto">

          <p className="text-cyan-400 font-bold tracking-[0.2em] md:tracking-[0.3em] mb-6 text-sm md:text-base">
            TU TIENDA GAMING DEFINITIVA
          </p>

          <h1 className="text-4xl md:text-7xl font-black leading-tight mb-8">
            Descubre los mejores videojuegos
          </h1>

          <p className="text-slate-400 text-lg md:text-2xl leading-relaxed max-w-3xl mx-auto mb-10">
            Compra títulos populares, descubre ofertas increíbles y explora nuevas aventuras para todas las plataformas.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6">

            <a
              href="/catalogo"
              className="bg-cyan-400 hover:bg-cyan-300 transition text-black font-black px-8 py-4 rounded-2xl text-lg md:text-xl"
            >
              Explorar catálogo
            </a>

            <a
              href="#destacados"
              className="border border-slate-700 hover:border-cyan-400 transition px-8 py-4 rounded-2xl text-lg md:text-xl"
            >
              Ver destacados
            </a>

          </div>

        </div>

      </section>

      <section
        id="destacados"
        className="max-w-7xl mx-auto px-6 pb-24 md:pb-32"
      >

        <div className="text-center mb-14 md:mb-20">

          <p className="text-cyan-400 font-bold tracking-[0.2em] md:tracking-[0.3em] mb-6 text-sm md:text-base">
            JUEGOS DESTACADOS
          </p>

          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Los más populares de GameStore
          </h2>

          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto">
            Descubre algunos de los videojuegos más vendidos y mejor valorados por nuestra comunidad.
          </p>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-8">

          {games.map((game) => (

            <div
              key={game.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-400 transition flex flex-col h-full"
            >

              <img
                src={game.image_url || "/assets/images/default.jpg"}
                alt={game.title}
                className="w-full h-72 object-cover"
              />

              <div className="p-6 flex flex-col flex-grow">

                <div className="flex-grow">

                  <h3 className="text-2xl font-black mb-3 min-h-[72px] flex items-start">
                    {game.title}
                  </h3>

                  <p className="text-slate-400 mb-2">
                    {game.genre}
                  </p>

                  <p className="text-slate-500 mb-6">
                    {game.platform}
                  </p>

                </div>

                <div className="mt-auto">

                  <div className="flex justify-between items-center mb-5">

                    <span className="text-cyan-400 text-2xl font-black">
                      {game.price === 0
                        ? "Gratis"
                        : `${game.price.toFixed(2)}€`}
                    </span>

                  </div>

                  <a
                    href={`/producto/${game.id}`}
                    className="block bg-cyan-400 hover:bg-cyan-300 transition text-black px-5 py-3 rounded-xl font-black text-center"
                  >
                    Ver juego
                  </a>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

    </div>

  );

}