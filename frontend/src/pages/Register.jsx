import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_REGISTER =
  "https://game-store-hnoj.onrender.com/auth/register";

export default function Register() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  async function registrarUsuario(e) {

    e.preventDefault();

    if (!username || !email || !password) {
      setMensaje("Debes completar todos los campos.");
      return;
    }

    if (password.length < 8) {
      setMensaje("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {

      setLoading(true);
      setMensaje("");

      const respuesta =
        await fetch(API_REGISTER, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            email,
            password
          })
        });

      const data =
        await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.detail || "Error al registrar usuario");
      }

      navigate("/login");

    } catch (error) {

      console.error(error);
      setMensaje(error.message);

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="bg-slate-950 text-white min-h-screen">

      <Navbar cartCount={0} />

      <section className="py-24 px-6 text-center">

        <span className="text-cyan-400 font-bold tracking-[0.3em]">
          NUEVA CUENTA
        </span>

        <h1 className="text-6xl font-black mt-6 mb-6">
          Crea tu perfil gamer
        </h1>

        <p className="text-slate-400 text-xl max-w-3xl mx-auto">
          Regístrate para comprar videojuegos, gestionar tu carrito y consultar tus pedidos.
        </p>

      </section>

      <main className="max-w-xl mx-auto px-6 pb-32">

        <form
          onSubmit={registrarUsuario}
          className="bg-slate-900 border border-slate-800 rounded-[2rem] p-10 shadow-2xl shadow-cyan-500/10"
        >

          {mensaje && (

            <div className="bg-red-500/20 border border-red-500/40 text-red-300 rounded-2xl p-4 text-center font-bold mb-8">
              {mensaje}
            </div>

          )}

          <div className="mb-6">

            <label className="block text-slate-300 font-bold mb-3">
              Nombre de usuario
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="usuario_gamer"
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-2xl px-5 py-4 outline-none text-white"
            />

          </div>

          <div className="mb-6">

            <label className="block text-slate-300 font-bold mb-3">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@email.com"
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-2xl px-5 py-4 outline-none text-white"
            />

          </div>

          <div className="mb-8">

            <label className="block text-slate-300 font-bold mb-3">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-2xl px-5 py-4 outline-none text-white"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 transition text-black font-black py-4 rounded-2xl text-xl"
          >
            {loading ? "Creando cuenta..." : "Registrarme"}
          </button>

          <p className="text-center text-slate-400 mt-8">

            ¿Ya tienes cuenta?{" "}

            <Link
              to="/login"
              className="text-cyan-400 font-bold hover:underline"
            >
              Inicia sesión
            </Link>

          </p>

        </form>

      </main>

    </div>

  );

}