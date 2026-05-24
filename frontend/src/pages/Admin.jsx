import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_ADMIN =
  "https://game-store-hnoj.onrender.com/admin/dashboard";

const API_CART =
  "https://game-store-hnoj.onrender.com/cart/";

export default function Admin() {

  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {

    if (!token) {
      navigate("/login");
      return;
    }

    loadDashboard();
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

  async function loadDashboard() {

    try {

      setLoading(true);

      const response =
        await fetch(API_ADMIN, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "No tienes permisos de administrador");
      }

      setStats(data);

    } catch (error) {

      console.error(error);
      setMensaje(error.message);

    } finally {

      setLoading(false);

    }

  }

  function formatMoney(value) {

    return `${Number(value || 0).toFixed(2)}€`;

  }

  return (

    <div className="bg-slate-950 text-white min-h-screen">

      <Navbar cartCount={cartCount} />

      <section className="py-24 px-6 text-center">

        <span className="text-cyan-400 font-bold tracking-[0.3em]">
          ADMIN DASHBOARD
        </span>

        <h1 className="text-6xl font-black mt-6 mb-6">
          Panel de administración
        </h1>

        <p className="text-slate-400 text-xl max-w-3xl mx-auto">
          Consulta métricas, ingresos, usuarios, inventario y alertas de stock de GameStore.
        </p>

      </section>

      <main className="max-w-7xl mx-auto px-6 pb-32">

        {loading ? (

          <div className="text-center py-20 text-3xl text-slate-400">
            Cargando dashboard...
          </div>

        ) : mensaje ? (

          <div className="bg-slate-900 border border-red-500/30 rounded-[2rem] p-12 text-center max-w-2xl mx-auto">

            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-5xl">
              🔒
            </div>

            <h2 className="text-4xl font-black mb-4">
              Acceso restringido
            </h2>

            <p className="text-slate-400 text-xl mb-8">
              {mensaje}
            </p>

            <button
              onClick={() => navigate("/perfil")}
              className="bg-cyan-400 hover:bg-cyan-300 transition text-black font-black px-8 py-4 rounded-2xl text-xl"
            >
              Volver al perfil
            </button>

          </div>

        ) : stats && (

          <>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

                <p className="text-slate-400 font-bold mb-4">
                  Usuarios registrados
                </p>

                <h2 className="text-5xl font-black text-cyan-400">
                  {stats.total_users}
                </h2>

              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

                <p className="text-slate-400 font-bold mb-4">
                  Juegos activos
                </p>

                <h2 className="text-5xl font-black text-cyan-400">
                  {stats.total_games_in_catalog}
                </h2>

              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

                <p className="text-slate-400 font-bold mb-4">
                  Valor inventario
                </p>

                <h2 className="text-5xl font-black text-cyan-400">
                  {formatMoney(stats.total_inventory_value)}
                </h2>

              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

                <p className="text-slate-400 font-bold mb-4">
                  Ingresos totales
                </p>

                <h2 className="text-5xl font-black text-green-400">
                  {formatMoney(stats.total_earnings)}
                </h2>

              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8">

                <h2 className="text-3xl font-black mb-8">
                  Resumen visual
                </h2>

                <div className="space-y-6">

                  <MetricBar
                    label="Usuarios"
                    value={stats.total_users}
                    max={Math.max(stats.total_users, stats.total_games_in_catalog, 1)}
                  />

                  <MetricBar
                    label="Juegos activos"
                    value={stats.total_games_in_catalog}
                    max={Math.max(stats.total_users, stats.total_games_in_catalog, 1)}
                  />

                  <MetricBar
                    label="Alertas stock bajo"
                    value={stats.low_stock_alerts_count}
                    max={Math.max(stats.total_games_in_catalog, 1)}
                  />

                </div>

              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8">

                <div className="flex justify-between items-center mb-8">

                  <h2 className="text-3xl font-black">
                    Stock bajo
                  </h2>

                  <span className="bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-2 rounded-2xl font-black">
                    {stats.low_stock_alerts_count} alertas
                  </span>

                </div>

                {stats.low_stock_games?.length === 0 ? (

                  <p className="text-slate-400 text-xl">
                    No hay juegos con stock bajo.
                  </p>

                ) : (

                  <div className="space-y-4">

                    {stats.low_stock_games?.map((game) => (

                      <div
                        key={game.id}
                        className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex justify-between items-center"
                      >

                        <div>

                          <h3 className="text-xl font-black">
                            {game.title}
                          </h3>

                          <p className="text-slate-500">
                            ID: {game.id}
                          </p>

                        </div>

                        <span className="text-red-300 font-black text-2xl">
                          {game.stock}
                        </span>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>

          </>

        )}

      </main>

    </div>

  );

}

function MetricBar({ label, value, max }) {

  const percentage =
    max > 0
      ? Math.min((value / max) * 100, 100)
      : 0;

  return (

    <div>

      <div className="flex justify-between mb-2">

        <span className="text-slate-300 font-bold">
          {label}
        </span>

        <span className="text-cyan-400 font-black">
          {value}
        </span>

      </div>

      <div className="w-full bg-slate-950 rounded-full h-4 overflow-hidden">

        <div
          className="h-4 bg-cyan-400 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />

      </div>

    </div>

  );

}