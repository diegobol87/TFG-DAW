import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ cartCount = 0 }) {

  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");

  function isActive(path) {
    return location.pathname === path;
  }

  function goProtected(path) {

    if (!token) {
      navigate("/login");
      setMenuOpen(false);
      return;
    }

    navigate(path);
    setMenuOpen(false);

  }

  return (

    <nav className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-5 py-5 flex justify-between items-center">

        <Link
          to="/"
          className="text-2xl md:text-3xl font-black text-cyan-400"
          onClick={() => setMenuOpen(false)}
        >
          GameStore
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl font-black"
        >
          ☰
        </button>

        <ul className="hidden md:flex gap-8 items-center font-semibold">

          <li>
            <Link
              to="/"
              className={isActive("/") ? "text-cyan-400" : "hover:text-cyan-400 transition"}
            >
              Inicio
            </Link>
          </li>

          <li>
            <Link
              to="/catalogo"
              className={isActive("/catalogo") ? "text-cyan-400" : "hover:text-cyan-400 transition"}
            >
              Catálogo
            </Link>
          </li>

          <li>
            <button
              onClick={() => goProtected("/pedidos")}
              className={isActive("/pedidos") ? "text-cyan-400" : "hover:text-cyan-400 transition"}
            >
              Pedidos
            </button>
          </li>

          <li>
            <button
              onClick={() => goProtected("/perfil")}
              className={isActive("/perfil") ? "text-cyan-400" : "hover:text-cyan-400 transition"}
            >
              Perfil
            </button>
          </li>

          <li>
            <button
              onClick={() => goProtected("/carrito")}
              className={`${isActive("/carrito") ? "text-cyan-400" : "hover:text-cyan-400 transition"} flex gap-2 items-center`}
            >
              Carrito

              <span className="bg-cyan-400 text-black px-2 py-1 rounded-full text-sm font-black">
                {cartCount}
              </span>
            </button>
          </li>

        </ul>

      </div>

      {menuOpen && (

        <div className="md:hidden px-5 pb-5">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 font-bold">

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={isActive("/") ? "text-cyan-400" : "text-white"}
            >
              Inicio
            </Link>

            <Link
              to="/catalogo"
              onClick={() => setMenuOpen(false)}
              className={isActive("/catalogo") ? "text-cyan-400" : "text-white"}
            >
              Catálogo
            </Link>

            <button
              onClick={() => goProtected("/pedidos")}
              className="text-left text-white"
            >
              Pedidos
            </button>

            <button
              onClick={() => goProtected("/perfil")}
              className="text-left text-white"
            >
              Perfil
            </button>

            <button
              onClick={() => goProtected("/carrito")}
              className="text-left text-white flex gap-2 items-center"
            >
              Carrito

              <span className="bg-cyan-400 text-black px-2 py-1 rounded-full text-sm font-black">
                {cartCount}
              </span>
            </button>

          </div>

        </div>

      )}

    </nav>

  );

}