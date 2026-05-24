import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_PROFILE =
  "https://game-store-hnoj.onrender.com/auth/me";

const API_ORDERS =
  "https://game-store-hnoj.onrender.com/orders/me";

const API_CART =
  "https://game-store-hnoj.onrender.com/cart/";

export default function Perfil() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [ordersCount, setOrdersCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [modalAdmin, setModalAdmin] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {

    if (!token) {
      navigate("/login");
      return;
    }

    loadProfile();
    loadOrders();
    loadCart();

  }, []);

  async function loadProfile() {

    try {

      const response =
        await fetch(API_PROFILE, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      if (!response.ok) {
        throw new Error("No se pudo cargar el perfil");
      }

      const data =
        await response.json();

      setUser(data);

      localStorage.setItem(
        "usuario",
        JSON.stringify(data)
      );

    } catch (error) {

      console.error(error);
      navigate("/login");

    }

  }

  async function loadOrders() {

    try {

      const response =
        await fetch(API_ORDERS, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      if (!response.ok) {
        setOrdersCount(0);
        return;
      }

      const data =
        await response.json();

      setOrdersCount(data.length || 0);

    } catch (error) {

      console.error(error);
      setOrdersCount(0);

    }

  }

  async function loadCart() {

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

  function accessAdmin() {

    if (user?.is_admin) {
      navigate("/admin");
    } else {
      setModalAdmin(true);
    }

  }

  function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("carrito");

    navigate("/");

  }

  const avatarLetter =
    user?.username
      ? user.username.charAt(0).toUpperCase()
      : "U";

  return (

    <div className="bg-slate-950 text-white min-h-screen">

      <Navbar cartCount={cartCount} />

      <section className="py-24 px-6 text-center">

        <span className="text-cyan-400 font-bold tracking-[0.3em]">
          MI CUENTA
        </span>

        <h1 className="text-6xl font-black mt-6 mb-6">
          Tu perfil gamer
        </h1>

        <p className="text-slate-400 text-xl max-w-3xl mx-auto">
          Gestiona tu cuenta, revisa tus pedidos y continúa explorando nuevos videojuegos.
        </p>

      </section>

      <main className="max-w-6xl mx-auto px-6 pb-32">

        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-10 md:p-14">

          <div className="flex flex-col lg:flex-row items-center gap-10 mb-14">

            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-6xl font-black shadow-2xl shadow-cyan-500/20">
              {avatarLetter}
            </div>

            <div className="flex-grow text-center lg:text-left">

              <p className="text-cyan-400 font-bold tracking-widest uppercase mb-3">
                Cuenta de usuario
              </p>

              <h2 className="text-5xl font-black mb-4">
                {user?.username || "Usuario"}
              </h2>

              <p className="text-slate-400 text-2xl">
                {user?.email || "usuario@email.com"}
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">

            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center">

              <h3 className="text-5xl font-black text-cyan-400 mb-3">
                {ordersCount}
              </h3>

              <p className="text-slate-400 font-bold">
                Pedidos realizados
              </p>

            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center">

              <h3 className="text-5xl font-black text-cyan-400 mb-3">
                {cartCount}
              </h3>

              <p className="text-slate-400 font-bold">
                Juegos en carrito
              </p>

            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center">

              <h3 className="text-5xl font-black text-cyan-400 mb-3">
                {user?.is_admin ? "ADMIN" : "VIP"}
              </h3>

              <p className="text-slate-400 font-bold">
                Estado de la cuenta
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <button
              onClick={() => navigate("/pedidos")}
              className="bg-slate-950 border border-slate-800 hover:border-cyan-400 transition rounded-3xl p-8 text-left flex justify-between items-center"
            >

              <div>

                <h3 className="text-3xl font-black mb-4">
                  Mis pedidos
                </h3>

                <p className="text-slate-400 text-lg leading-relaxed">
                  Consulta todas tus compras y revisa el estado de tus pedidos.
                </p>

              </div>

              <span className="text-cyan-400 text-3xl">
                →
              </span>

            </button>

            <button
              onClick={() => navigate("/catalogo")}
              className="bg-slate-950 border border-slate-800 hover:border-cyan-400 transition rounded-3xl p-8 text-left flex justify-between items-center"
            >

              <div>

                <h3 className="text-3xl font-black mb-4">
                  Seguir comprando
                </h3>

                <p className="text-slate-400 text-lg leading-relaxed">
                  Descubre nuevos videojuegos y ofertas exclusivas.
                </p>

              </div>

              <span className="text-cyan-400 text-3xl">
                →
              </span>

            </button>

            <button
              onClick={accessAdmin}
              className="bg-slate-950 border border-slate-800 hover:border-cyan-400 transition rounded-3xl p-8 text-left flex justify-between items-center md:col-span-2"
            >

              <div>

                <h3 className="text-3xl font-black mb-4">
                  Panel de administración
                </h3>

                <p className="text-slate-400 text-lg leading-relaxed">
                  Gestiona estadísticas, ingresos, stock y métricas de GameStore.
                </p>

              </div>

              <span className="text-cyan-400 text-3xl">
                →
              </span>

            </button>

          </div>

          <div className="mt-14">

            <button
              onClick={() => setModalLogout(true)}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:scale-[1.01] transition rounded-2xl py-5 text-xl font-black shadow-lg shadow-red-500/30"
            >
              Cerrar sesión
            </button>

          </div>

        </div>

      </main>

      {modalAdmin && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">

          <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl max-w-md w-full p-8 text-center shadow-2xl shadow-cyan-500/20">

            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-5xl">
              🔒
            </div>

            <h2 className="text-3xl font-black mb-4">
              Acceso restringido
            </h2>

            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Debes tener permisos de administrador para acceder al panel de control.
            </p>

            <button
              onClick={() => setModalAdmin(false)}
              className="px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 transition text-black font-black text-lg"
            >
              Entendido
            </button>

          </div>

        </div>

      )}

      {modalLogout && (

        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] px-6">

          <div className="bg-slate-900 border border-red-500/20 rounded-[2rem] p-10 max-w-md w-full shadow-2xl shadow-red-500/20 text-center">

            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-5xl shadow-lg shadow-red-500/30">
              ⚠️
            </div>

            <h2 className="text-4xl font-black mb-4">
              ¿Cerrar sesión?
            </h2>

            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Tendrás que volver a iniciar sesión para acceder a tu cuenta.
            </p>

            <div className="flex gap-4">

              <button
                onClick={() => setModalLogout(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 transition rounded-2xl py-4 text-lg font-bold"
              >
                Cancelar
              </button>

              <button
                onClick={logout}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:scale-105 transition rounded-2xl py-4 text-lg font-bold shadow-lg shadow-red-500/30"
              >
                Salir
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}