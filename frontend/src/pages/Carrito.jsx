import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_CART =
  "https://game-store-hnoj.onrender.com/cart/";

const API_REMOVE =
  "https://game-store-hnoj.onrender.com/cart/remove";

const API_CLEAR =
  "https://game-store-hnoj.onrender.com/cart/clear";

export default function Carrito() {

  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {

    if (!token) {
      navigate("/login");
      return;
    }

    loadCart();

  }, []);

  async function loadCart() {

    try {

      setLoading(true);

      const response =
        await fetch(API_CART, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error al cargar carrito");
      }

      setCartItems(data.items || []);
      setTotal(data.total_price || 0);

    } catch (error) {

      console.error(error);
      setMensaje(error.message);

    } finally {

      setLoading(false);

    }

  }

  async function removeItem(itemId) {

    try {

      const response =
        await fetch(`${API_REMOVE}/${itemId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error al eliminar producto");
      }

      await loadCart();

    } catch (error) {

      console.error(error);
      setMensaje(error.message);

    }

  }

  async function clearCart() {

    try {

      const response =
        await fetch(API_CLEAR, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      if (!response.ok) {
        throw new Error("Error al vaciar carrito");
      }

      setCartItems([]);
      setTotal(0);

    } catch (error) {

      console.error(error);
      setMensaje(error.message);

    }

  }

  return (

    <div className="bg-slate-950 text-white min-h-screen">

      <Navbar cartCount={cartItems.length} />

      <section className="py-24 px-6 text-center">

        <span className="text-cyan-400 font-bold tracking-[0.3em]">
          CARRITO
        </span>

        <h1 className="text-6xl font-black mt-6 mb-6">
          Tu carrito de compra
        </h1>

        <p className="text-slate-400 text-xl max-w-3xl mx-auto">
          Revisa los videojuegos seleccionados antes de finalizar tu pedido.
        </p>

      </section>

      <main className="max-w-6xl mx-auto px-6 pb-32">

        {mensaje && (

          <div className="bg-red-500/20 border border-red-500/40 text-red-300 rounded-2xl p-5 text-center font-bold mb-8">
            {mensaje}
          </div>

        )}

        {loading ? (

          <div className="text-center py-20 text-3xl text-slate-400">
            Cargando carrito...
          </div>

        ) : cartItems.length === 0 ? (

          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-14 text-center">

            <h2 className="text-5xl font-black mb-6">
              El carrito está vacío
            </h2>

            <p className="text-slate-400 text-xl mb-10">
              Explora el catálogo y añade tus videojuegos favoritos.
            </p>

            <button
              onClick={() => navigate("/catalogo")}
              className="bg-cyan-400 hover:bg-cyan-300 transition text-black font-black px-10 py-4 rounded-2xl text-xl"
            >
              Ir al catálogo
            </button>

          </div>

        ) : (

          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 md:p-12">

            <div className="space-y-6 mb-10">

              {cartItems.map((item) => {

                const game = item.game;

                return (

                  <div
                    key={item.id}
                    className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-6"
                  >

                    <div className="flex items-center gap-6 w-full">

                      <img
                        src={game?.image_url || "/assets/images/default.jpg"}
                        alt={game?.title}
                        className="w-32 h-32 object-cover rounded-2xl"
                      />

                      <div>

                        <h3 className="text-3xl font-black mb-2">
                          {game?.title}
                        </h3>

                        <p className="text-slate-400 text-lg">
                          🎮 {game?.platform}
                        </p>

                        <p className="text-slate-500">
                          Cantidad: {item.quantity}
                        </p>

                      </div>

                    </div>

                    <div className="flex flex-col md:items-end gap-4">

                      <span className="text-4xl font-black text-cyan-400">
                        {(game?.price * item.quantity).toFixed(2)}€
                      </span>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="bg-red-500/20 border border-red-500/40 hover:bg-red-500/30 transition text-red-300 font-bold px-6 py-3 rounded-2xl"
                      >
                        Eliminar
                      </button>

                    </div>

                  </div>

                );

              })}

            </div>

            <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">

              <div>

                <p className="text-slate-400 text-lg mb-2">
                  Total del carrito
                </p>

                <h2 className="text-5xl font-black text-cyan-400">
                  {total.toFixed(2)}€
                </h2>

              </div>

              <div className="flex flex-col md:flex-row gap-4">

                <button
                  onClick={clearCart}
                  className="bg-slate-800 hover:bg-slate-700 transition px-8 py-4 rounded-2xl font-black"
                >
                  Vaciar carrito
                </button>

                <button
                  onClick={() => navigate("/checkout")}
                  className="bg-cyan-400 hover:bg-cyan-300 transition text-black px-8 py-4 rounded-2xl font-black"
                >
                  Finalizar compra
                </button>

              </div>

            </div>

          </div>

        )}

      </main>

    </div>

  );

}