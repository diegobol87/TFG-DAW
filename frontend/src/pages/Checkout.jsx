import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_CART =
  "https://game-store-hnoj.onrender.com/cart/";

const API_CHECKOUT =
  "https://game-store-hnoj.onrender.com/orders/checkout";

export default function Checkout() {

  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [mensajeTipo, setMensajeTipo] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [titular, setTitular] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [fecha, setFecha] = useState("");
  const [cvv, setCvv] = useState("");

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
      setMensajeTipo("error");

    } finally {

      setLoading(false);

    }

  }

  async function realizarCheckout(e) {

    e.preventDefault();

    if (!titular || !tarjeta || !fecha || !cvv) {
      setMensaje("Debes completar todos los datos de pago");
      setMensajeTipo("error");
      return;
    }

    try {

      setProcessing(true);

      setMensaje("Procesando pago seguro... Conectando con la pasarela de pago...");
      setMensajeTipo("info");

      const response =
        await fetch(API_CHECKOUT, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error al procesar compra");
      }

      setMensaje("✅ Compra realizada correctamente. Recibirás toda la información de tu pedido por correo electrónico.");
      setMensajeTipo("success");

      setCartItems([]);
      setTotal(0);

      setTimeout(() => {
        navigate("/pedidos");
      }, 3000);

    } catch (error) {

      console.error(error);
      setMensaje(error.message);
      setMensajeTipo("error");

    } finally {

      setProcessing(false);

    }

  }

  function mensajeClass() {

    if (mensajeTipo === "success") {
      return "bg-green-500/20 border border-green-500/40 text-green-300";
    }

    if (mensajeTipo === "info") {
      return "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300";
    }

    return "bg-red-500/20 border border-red-500/40 text-red-300";

  }

  return (

    <div className="bg-slate-950 text-white min-h-screen">

      <Navbar cartCount={cartItems.length} />

      <section className="py-24 px-6 text-center">

        <span className="text-cyan-400 font-bold tracking-[0.3em]">
          CHECKOUT
        </span>

        <h1 className="text-6xl font-black mt-6 mb-6">
          Finaliza tu pedido
        </h1>

        <p className="text-slate-400 text-xl max-w-3xl mx-auto">
          Revisa tus videojuegos y confirma la compra para añadirlos a tu colección.
        </p>

      </section>

      <main className="max-w-5xl mx-auto px-6 pb-32">

        <form
          onSubmit={realizarCheckout}
          className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 md:p-12"
        >

          {mensaje && (

            <div className={`${mensajeClass()} mb-8 p-5 rounded-2xl text-center font-bold text-xl`}>
              {mensaje}
            </div>

          )}

          {loading ? (

            <div className="text-center py-20 text-3xl text-slate-400">
              Cargando checkout...
            </div>

          ) : cartItems.length === 0 ? (

            <div className="text-center py-12">

              <h2 className="text-5xl font-black mb-6">
                El carrito está vacío
              </h2>

              <p className="text-slate-400 text-xl mb-10">
                Añade videojuegos antes de finalizar la compra.
              </p>

              <button
                type="button"
                onClick={() => navigate("/catalogo")}
                className="bg-cyan-400 hover:bg-cyan-300 transition text-black font-black px-10 py-4 rounded-2xl text-xl"
              >
                Ir al catálogo
              </button>

            </div>

          ) : (

            <>

              <div className="space-y-6 mb-10">

                {cartItems.map((item) => {

                  const game = item.game;

                  return (

                    <div
                      key={item.id}
                      className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-6"
                    >

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

                      <span className="text-4xl font-black text-cyan-400">
                        {(game?.price * item.quantity).toFixed(2)}€
                      </span>

                    </div>

                  );

                })}

              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 mb-10">

                <h2 className="text-3xl font-black mb-8">
                  Datos de pago
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>

                    <label className="block mb-3 text-slate-300 font-bold">
                      Titular de la tarjeta
                    </label>

                    <input
                      type="text"
                      value={titular}
                      onChange={(e) => setTitular(e.target.value)}
                      placeholder="Nombre Apellido"
                      className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-400"
                    />

                  </div>

                  <div>

                    <label className="block mb-3 text-slate-300 font-bold">
                      Número de tarjeta
                    </label>

                    <input
                      type="text"
                      value={tarjeta}
                      onChange={(e) => setTarjeta(e.target.value)}
                      maxLength="19"
                      placeholder="1234 5678 9012 3456"
                      className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-400"
                    />

                  </div>

                  <div>

                    <label className="block mb-3 text-slate-300 font-bold">
                      Fecha de expiración
                    </label>

                    <input
                      type="text"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      maxLength="5"
                      placeholder="12/28"
                      className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-400"
                    />

                  </div>

                  <div>

                    <label className="block mb-3 text-slate-300 font-bold">
                      CVV
                    </label>

                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength="4"
                      placeholder="123"
                      className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-400"
                    />

                  </div>

                </div>

              </div>

              <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">

                <div>

                  <p className="text-slate-400 text-lg mb-2">
                    Total del pedido
                  </p>

                  <h2 className="text-5xl font-black text-cyan-400">
                    {total.toFixed(2)}€
                  </h2>

                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 transition text-black font-black text-2xl px-10 py-5 rounded-2xl"
                >
                  {processing ? "Procesando pago..." : "Confirmar compra"}
                </button>

              </div>

            </>

          )}

        </form>

      </main>

    </div>

  );

}