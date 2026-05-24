import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL =
  "https://game-store-hnoj.onrender.com/games";

const API_CART =
  "https://game-store-hnoj.onrender.com/cart/";

const API_CART_ADD =
  "https://game-store-hnoj.onrender.com/cart/add";

export default function Producto() {

  const { id } = useParams();

  const [game, setGame] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {

    loadGame();
    updateCartCounter();

  }, [id]);

  async function updateCartCounter() {

    if (!token) {
      setCartCount(0);
      return;
    }

    try {

      const response =
        await fetch(API_CART, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      if (!response.ok) {
        setCartCount(0);
        return;
      }

      const cart =
        await response.json();

      setCartCount(cart.items?.length || 0);

    } catch (error) {

      console.error(error);
      setCartCount(0);

    }

  }

  async function loadGame() {

    try {

      const response =
        await fetch(`${API_URL}/${id}`);

      if (!response.ok) {
        throw new Error("Juego no encontrado");
      }

      const data =
        await response.json();

      setGame(data);

    } catch (error) {

      console.error(error);

    }

  }

  function showToast(message) {

    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 3000);

  }

  async function addToCart() {

    if (!token) {

      showToast("Debes iniciar sesión para añadir juegos.");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

      return;

    }

    try {

      const response =
        await fetch(API_CART_ADD, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            game_id: game.id,
            quantity: 1
          })
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error al añadir al carrito");
      }

      await updateCartCounter();

      showToast(`"${game.title}" añadido al carrito`);

    } catch (error) {

      console.error(error);
      showToast(error.message);

    }

  }

  if (!game) {

    return (

      <div className="bg-slate-950 text-white min-h-screen">

        <Navbar cartCount={cartCount} />

        <div className="text-center py-32 text-3xl text-slate-400">
          Cargando videojuego...
        </div>

      </div>

    );

  }

  const image =
    game.image_url || "/assets/images/default.jpg";

  const price =
    game.price === 0
      ? "Gratis"
      : `${game.price.toFixed(2)}€`;

  return (

    <div className="bg-slate-950 text-white min-h-screen">

      <Navbar cartCount={cartCount} />

      <section className="py-24 px-6 text-center">

        <span className="text-cyan-400 font-bold tracking-[0.3em]">
          DETALLE DEL VIDEOJUEGO
        </span>

        <h1 className="text-6xl font-black mt-6 mb-6">
          Explora cada detalle
        </h1>

        <p className="text-slate-400 text-xl max-w-3xl mx-auto">
          Consulta información del juego, plataforma, stock disponible y añádelo a tu carrito.
        </p>

      </section>

      <main className="max-w-7xl mx-auto px-6 pb-32">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden">

            <img
              src={image}
              alt={game.title}
              className="w-full h-full object-cover hover:scale-105 transition duration-500"
            />

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-10">

            <span className="inline-block text-cyan-400 font-bold tracking-[0.2em] mb-6">
              {game.genre}
            </span>

            <h2 className="text-5xl md:text-6xl font-black leading-tight mb-10">
              {game.title}
            </h2>

            <div className="space-y-5 mb-10">

              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
                <p className="text-slate-400 font-bold mb-2">Plataforma</p>
                <p className="text-2xl font-black">🎮 {game.platform}</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
                <p className="text-slate-400 font-bold mb-2">Stock disponible</p>
                <p className="text-2xl font-black">{game.stock} unidades</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
                <p className="text-slate-400 font-bold mb-2">Multijugador</p>
                <p className="text-2xl font-black">
                  {game.multiplayer ? "Sí" : "No"}
                </p>
              </div>

            </div>

            <div className="mb-10">

              <p className="text-slate-400 text-lg mb-2">
                Precio
              </p>

              <div className="text-6xl font-black text-cyan-400">
                {price}
              </div>

            </div>

            <button
              onClick={addToCart}
              className="w-full bg-cyan-400 hover:bg-cyan-300 transition text-black font-black py-5 rounded-2xl text-2xl"
            >
              Añadir al carrito
            </button>

          </div>

        </div>

      </main>

      {toast && (

        <div className="fixed top-32 right-8 z-50">

          <div className="bg-slate-900/95 border border-cyan-500/40 rounded-2xl px-6 py-5 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl min-w-[340px]">

            <div className="flex items-start gap-4">

              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl">
                🛒
              </div>

              <div>
                <h3 className="text-white font-black text-xl mb-1">
                  GameStore
                </h3>

                <p className="text-slate-300 text-sm">
                  {toast}
                </p>
              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}