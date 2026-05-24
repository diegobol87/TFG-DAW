import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_ORDERS =
  "https://game-store-hnoj.onrender.com/orders/me";

const API_CART =
  "https://game-store-hnoj.onrender.com/cart/";

export default function Pedidos() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {

    if (!token) {
      navigate("/login");
      return;
    }

    loadOrders();
    loadCartCount();

  }, []);

  async function loadCartCount() {

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

      const data =
        await response.json();

      setCartCount(data.items?.length || 0);

    } catch (error) {

      console.error(error);
      setCartCount(0);

    }

  }

  async function loadOrders() {

    try {

      setLoading(true);

      const response =
        await fetch(API_ORDERS, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error al cargar pedidos");
      }

      setOrders(data || []);

    } catch (error) {

      console.error(error);
      setMensaje(error.message);

    } finally {

      setLoading(false);

    }

  }

  function formatPrice(value) {

    const number =
      Number(value || 0);

    return `${number.toFixed(2)}€`;

  }

  function formatDate(value) {

    if (!value) {
      return "Fecha no disponible";
    }

    return new Date(value).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

  }

  return (

    <div className="bg-slate-950 text-white min-h-screen">

      <Navbar cartCount={cartCount} />

      <section className="py-24 px-6 text-center">

        <span className="text-cyan-400 font-bold tracking-[0.3em]">
          MIS PEDIDOS
        </span>

        <h1 className="text-6xl font-black mt-6 mb-6">
          Historial de compras
        </h1>

        <p className="text-slate-400 text-xl max-w-3xl mx-auto">
          Consulta tus pedidos realizados y revisa los videojuegos comprados.
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
            Cargando pedidos...
          </div>

        ) : orders.length === 0 ? (

          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-14 text-center">

            <h2 className="text-5xl font-black mb-6">
              Todavía no tienes pedidos
            </h2>

            <p className="text-slate-400 text-xl mb-10">
              Explora el catálogo y realiza tu primera compra.
            </p>

            <button
              onClick={() => navigate("/catalogo")}
              className="bg-cyan-400 hover:bg-cyan-300 transition text-black font-black px-10 py-4 rounded-2xl text-xl"
            >
              Ir al catálogo
            </button>

          </div>

        ) : (

          <div className="space-y-8">

            {orders.map((order) => (

              <div
                key={order.id}
                className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 md:p-10"
              >

                <div className="flex flex-col md:flex-row justify-between gap-6 border-b border-slate-700 pb-6 mb-8">

                  <div>

                    <p className="text-cyan-400 font-bold tracking-widest mb-2">
                      PEDIDO #{order.id}
                    </p>

                    <h2 className="text-4xl font-black mb-3">
                      {formatPrice(order.total_price)}
                    </h2>

                    <p className="text-slate-400">
                      {formatDate(order.created_at)}
                    </p>

                  </div>

                  <div className="text-left md:text-right">

                    <span className="inline-block bg-green-500/20 border border-green-500/40 text-green-300 px-5 py-3 rounded-2xl font-black">
                      {order.status || "completed"}
                    </span>

                  </div>

                </div>

                <div className="space-y-5">

                  {(order.items || []).map((item) => {

                    const game =
                      item.game || {};

                    const price =
                      item.price_at_purchase ??
                      item.price_at_order ??
                      game.price ??
                      0;

                    return (

                      <div
                        key={item.id}
                        className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row justify-between gap-6"
                      >

                        <div>

                          <h3 className="text-3xl font-black mb-2">
                            {game.title || "Videojuego"}
                          </h3>

                          <p className="text-slate-400">
                            Cantidad: {item.quantity}
                          </p>

                          <p className="text-slate-500">
                            Precio de compra: {formatPrice(price)}
                          </p>

                        </div>

                        <div className="text-cyan-400 text-4xl font-black">
                          {formatPrice(price * item.quantity)}
                        </div>

                      </div>

                    );

                  })}

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>

  );

}