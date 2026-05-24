import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_ADMIN =
  "https://game-store-hnoj.onrender.com/admin/dashboard";

const API_CART =
  "https://game-store-hnoj.onrender.com/cart/";

const API_GAMES =
  "https://game-store-hnoj.onrender.com/games/";

export default function Admin() {

  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [games, setGames] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const [mensaje, setMensaje] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const [openSection, setOpenSection] = useState("");

  const [searchEdit, setSearchEdit] = useState("");
  const [searchDelete, setSearchDelete] = useState("");

  const [editingGame, setEditingGame] = useState(null);

  const [newGame, setNewGame] = useState({
    title: "",
    genre: "",
    platform: "",
    price: "",
    release_year: "",
    multiplayer: false,
    stock: "",
    image_url: ""
  });

  const [rawgName, setRawgName] = useState("");

  const token = localStorage.getItem("token");

  const editResults =
    searchEdit.trim().length === 0
      ? []
      : games.filter((game) =>
          game.title.toLowerCase().includes(searchEdit.toLowerCase())
        );

  const deleteResults =
    searchDelete.trim().length === 0
      ? []
      : games.filter((game) =>
          game.title.toLowerCase().includes(searchDelete.toLowerCase())
        );

  useEffect(() => {

    if (!token) {
      navigate("/login");
      return;
    }

    loadDashboard();
    loadCartCount();
    loadGames();

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
      setMensaje("");

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

  async function loadGames() {

    try {

      const response =
        await fetch(`${API_GAMES}?page=1&size=50`);

      if (!response.ok) {
        throw new Error("No se pudieron cargar los juegos");
      }

      const data =
        await response.json();

      setGames(data || []);

    } catch (error) {

      console.error(error);

    }

  }

  function toggleSection(section) {

    setOpenSection(openSection === section ? "" : section);

  }

  async function createGame(e) {

    e.preventDefault();

    try {

      setMensaje("");
      setSuccess("");

      const body = {
        title: newGame.title,
        genre: newGame.genre,
        platform: newGame.platform,
        price: Number(newGame.price),
        release_year: newGame.release_year
          ? Number(newGame.release_year)
          : null,
        multiplayer: newGame.multiplayer,
        stock: newGame.stock
          ? Number(newGame.stock)
          : 0,
        image_url: newGame.image_url || null
      };

      const response =
        await fetch(API_GAMES, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "No se pudo crear el juego");
      }

      setSuccess("Juego creado correctamente");

      setNewGame({
        title: "",
        genre: "",
        platform: "",
        price: "",
        release_year: "",
        multiplayer: false,
        stock: "",
        image_url: ""
      });

      await loadGames();
      await loadDashboard();

    } catch (error) {

      console.error(error);
      setMensaje(error.message);

    }

  }

  async function updateGame(e) {

    e.preventDefault();

    try {

      setMensaje("");
      setSuccess("");

      const body = {
        title: editingGame.title,
        genre: editingGame.genre,
        platform: editingGame.platform,
        price: Number(editingGame.price),
        release_year: editingGame.release_year
          ? Number(editingGame.release_year)
          : null,
        multiplayer: editingGame.multiplayer,
        stock: Number(editingGame.stock),
        image_url: editingGame.image_url || null
      };

      const response =
        await fetch(`${API_GAMES}${editingGame.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "No se pudo actualizar el juego");
      }

      setSuccess("Juego actualizado correctamente");
      setEditingGame(null);
      setSearchEdit("");

      await loadGames();
      await loadDashboard();

    } catch (error) {

      console.error(error);
      setMensaje(error.message);

    }

  }

  async function importGame(e) {

    e.preventDefault();

    if (!rawgName.trim()) {
      setMensaje("Escribe el nombre del juego que quieres importar");
      return;
    }

    try {

      setMensaje("");
      setSuccess("");

      const response =
        await fetch(`${API_GAMES}import/${encodeURIComponent(rawgName)}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "No se pudo importar el juego");
      }

      setSuccess("Juego importado correctamente desde RAWG");
      setRawgName("");

      await loadGames();
      await loadDashboard();

    } catch (error) {

      console.error(error);
      setMensaje(error.message);

    }

  }

  async function deleteGame(game) {

    const confirmDelete =
      window.confirm(`¿Seguro que quieres eliminar "${game.title}" del catálogo?`);

    if (!confirmDelete) return;

    try {

      setMensaje("");
      setSuccess("");

      const response =
        await fetch(`${API_GAMES}${game.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "No se pudo eliminar el juego");
      }

      setSuccess("Juego eliminado correctamente del catálogo");
      setSearchDelete("");

      await loadGames();
      await loadDashboard();

    } catch (error) {

      console.error(error);
      setMensaje(error.message);

    }

  }

  function startEditing(game) {

    setEditingGame({
      id: game.id,
      title: game.title || "",
      genre: game.genre || "",
      platform: game.platform || "",
      price: game.price ?? "",
      release_year: game.release_year || "",
      multiplayer: game.multiplayer || false,
      stock: game.stock ?? "",
      image_url: game.image_url || ""
    });

  }

  function handleInputChange(e) {

    const { name, value, type, checked } = e.target;

    setNewGame({
      ...newGame,
      [name]: type === "checkbox"
        ? checked
        : value
    });

  }

  function handleEditChange(e) {

    const { name, value, type, checked } = e.target;

    setEditingGame({
      ...editingGame,
      [name]: type === "checkbox"
        ? checked
        : value
    });

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

        <h1 className="text-5xl md:text-6xl font-black mt-6 mb-6">
          Panel de administración
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto">
          Gestiona estadísticas, juegos, stock e inventario de GameStore.
        </p>

      </section>

      <main className="max-w-7xl mx-auto px-6 pb-32">

        {mensaje && (

          <div className="bg-red-500/20 border border-red-500/40 text-red-300 rounded-2xl p-5 text-center font-bold mb-8">
            {mensaje}
          </div>

        )}

        {success && (

          <div className="bg-green-500/20 border border-green-500/40 text-green-300 rounded-2xl p-5 text-center font-bold mb-8">
            {success}
          </div>

        )}

        {loading ? (

          <div className="text-center py-20 text-3xl text-slate-400">
            Cargando dashboard...
          </div>

        ) : mensaje && !stats ? (

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

              <StatCard
                title="Usuarios registrados"
                value={stats.total_users}
              />

              <StatCard
                title="Juegos activos"
                value={stats.total_games_in_catalog}
              />

              <StatCard
                title="Valor inventario"
                value={formatMoney(stats.total_inventory_value)}
              />

              <StatCard
                title="Ingresos totales"
                value={formatMoney(stats.total_earnings)}
                green
              />

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

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

            <AdminAccordion
              title="Crear nuevo juego"
              description="Añade un videojuego manualmente al catálogo."
              isOpen={openSection === "create"}
              onClick={() => toggleSection("create")}
            >

              <form
                onSubmit={createGame}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >

                <Input
                  label="Título"
                  name="title"
                  value={newGame.title}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  label="Género"
                  name="genre"
                  value={newGame.genre}
                  onChange={handleInputChange}
                  placeholder="Action, RPG, Sports..."
                  required
                />

                <Input
                  label="Plataforma"
                  name="platform"
                  value={newGame.platform}
                  onChange={handleInputChange}
                  placeholder="PC, PlayStation 5..."
                  required
                />

                <Input
                  label="Precio"
                  name="price"
                  type="number"
                  step="0.01"
                  value={newGame.price}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  label="Año de lanzamiento"
                  name="release_year"
                  type="number"
                  value={newGame.release_year}
                  onChange={handleInputChange}
                  placeholder="2025"
                />

                <Input
                  label="Stock"
                  name="stock"
                  type="number"
                  value={newGame.stock}
                  onChange={handleInputChange}
                  required
                />

                <div className="md:col-span-2">

                  <Input
                    label="URL de imagen"
                    name="image_url"
                    value={newGame.image_url}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />

                </div>

                <label className="flex items-center gap-3 text-slate-300 font-bold">

                  <input
                    type="checkbox"
                    name="multiplayer"
                    checked={newGame.multiplayer}
                    onChange={handleInputChange}
                    className="w-5 h-5"
                  />

                  Multijugador

                </label>

                <button
                  type="submit"
                  className="bg-cyan-400 hover:bg-cyan-300 transition text-black font-black px-8 py-4 rounded-2xl"
                >
                  Crear juego
                </button>

              </form>

            </AdminAccordion>

            <AdminAccordion
              title="Importar juego desde RAWG"
              description="Busca un título en RAWG y añádelo automáticamente al catálogo."
              isOpen={openSection === "import"}
              onClick={() => toggleSection("import")}
            >

              <form
                onSubmit={importGame}
                className="flex flex-col md:flex-row gap-4"
              >

                <input
                  type="text"
                  value={rawgName}
                  onChange={(e) => setRawgName(e.target.value)}
                  placeholder="Ejemplo: The Witcher 3"
                  className="flex-grow bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-400"
                />

                <button
                  type="submit"
                  className="bg-cyan-400 hover:bg-cyan-300 transition text-black font-black px-8 py-4 rounded-2xl"
                >
                  Importar
                </button>

              </form>

            </AdminAccordion>

            <AdminAccordion
              title="Editar juego del inventario"
              description="Busca un juego por nombre y modifica sus datos."
              isOpen={openSection === "edit"}
              onClick={() => toggleSection("edit")}
            >

              <div className="mb-8">

                <input
                  type="text"
                  value={searchEdit}
                  onChange={(e) => {
                    setSearchEdit(e.target.value);
                    setEditingGame(null);
                  }}
                  placeholder="Buscar juego para editar..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-400"
                />

              </div>

              {editResults.length > 0 && !editingGame && (

                <div className="space-y-4 mb-8">

                  {editResults.map((game) => (

                    <div
                      key={game.id}
                      className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between gap-4"
                    >

                      <div>

                        <h3 className="text-2xl font-black">
                          {game.title}
                        </h3>

                        <p className="text-slate-400">
                          {game.genre} · {game.platform}
                        </p>

                        <p className="text-slate-500">
                          Stock: {game.stock} · Precio: {formatMoney(game.price)}
                        </p>

                      </div>

                      <button
                        onClick={() => startEditing(game)}
                        className="bg-cyan-400 hover:bg-cyan-300 transition text-black font-black px-6 py-3 rounded-2xl"
                      >
                        Editar este juego
                      </button>

                    </div>

                  ))}

                </div>

              )}

              {searchEdit && editResults.length === 0 && (

                <p className="text-slate-400 text-lg">
                  No se encontraron juegos con ese nombre.
                </p>

              )}

              {editingGame && (

                <form
                  onSubmit={updateGame}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >

                  <Input
                    label="Título"
                    name="title"
                    value={editingGame.title}
                    onChange={handleEditChange}
                    required
                  />

                  <Input
                    label="Género"
                    name="genre"
                    value={editingGame.genre}
                    onChange={handleEditChange}
                    required
                  />

                  <Input
                    label="Plataforma"
                    name="platform"
                    value={editingGame.platform}
                    onChange={handleEditChange}
                    required
                  />

                  <Input
                    label="Precio"
                    name="price"
                    type="number"
                    step="0.01"
                    value={editingGame.price}
                    onChange={handleEditChange}
                    required
                  />

                  <Input
                    label="Año de lanzamiento"
                    name="release_year"
                    type="number"
                    value={editingGame.release_year}
                    onChange={handleEditChange}
                  />

                  <Input
                    label="Stock"
                    name="stock"
                    type="number"
                    value={editingGame.stock}
                    onChange={handleEditChange}
                    required
                  />

                  <div className="md:col-span-2">

                    <Input
                      label="URL de imagen"
                      name="image_url"
                      value={editingGame.image_url}
                      onChange={handleEditChange}
                    />

                  </div>

                  <label className="flex items-center gap-3 text-slate-300 font-bold">

                    <input
                      type="checkbox"
                      name="multiplayer"
                      checked={editingGame.multiplayer}
                      onChange={handleEditChange}
                      className="w-5 h-5"
                    />

                    Multijugador

                  </label>

                  <div className="flex flex-col md:flex-row gap-4">

                    <button
                      type="submit"
                      className="bg-cyan-400 hover:bg-cyan-300 transition text-black font-black px-8 py-4 rounded-2xl"
                    >
                      Guardar cambios
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingGame(null)}
                      className="bg-slate-800 hover:bg-slate-700 transition px-8 py-4 rounded-2xl font-black"
                    >
                      Cancelar
                    </button>

                  </div>

                </form>

              )}

            </AdminAccordion>

            <AdminAccordion
              title="Borrar juego del inventario"
              description="Busca un juego por nombre antes de eliminarlo del catálogo."
              isOpen={openSection === "delete"}
              onClick={() => toggleSection("delete")}
            >

              <input
                type="text"
                value={searchDelete}
                onChange={(e) => setSearchDelete(e.target.value)}
                placeholder="Buscar juego para borrar..."
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-400 mb-8"
              />

              {deleteResults.length > 0 && (

                <div className="space-y-4">

                  {deleteResults.map((game) => (

                    <div
                      key={game.id}
                      className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between gap-4"
                    >

                      <div>

                        <h3 className="text-2xl font-black">
                          {game.title}
                        </h3>

                        <p className="text-slate-400">
                          {game.genre} · {game.platform}
                        </p>

                        <p className="text-slate-500">
                          Stock: {game.stock} · Precio: {formatMoney(game.price)}
                        </p>

                      </div>

                      <button
                        onClick={() => deleteGame(game)}
                        className="bg-red-500/20 border border-red-500/40 hover:bg-red-500/30 transition text-red-300 font-black px-6 py-3 rounded-2xl"
                      >
                        Eliminar
                      </button>

                    </div>

                  ))}

                </div>

              )}

              {searchDelete && deleteResults.length === 0 && (

                <p className="text-slate-400 text-lg">
                  No se encontraron juegos con ese nombre.
                </p>

              )}

            </AdminAccordion>

          </>

        )}

      </main>

    </div>

  );

}

function StatCard({ title, value, green = false }) {

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

      <p className="text-slate-400 font-bold mb-4">
        {title}
      </p>

      <h2 className={`text-5xl font-black ${green ? "text-green-400" : "text-cyan-400"}`}>
        {value}
      </h2>

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

function AdminAccordion({ title, description, isOpen, onClick, children }) {

  return (

    <section className="bg-slate-900 border border-slate-800 rounded-[2rem] mb-8 overflow-hidden">

      <button
        onClick={onClick}
        className="w-full p-8 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/40 transition"
      >

        <div>

          <h2 className="text-3xl font-black mb-2">
            {title}
          </h2>

          <p className="text-slate-400 text-lg">
            {description}
          </p>

        </div>

        <span className="text-cyan-400 text-4xl font-black">
          {isOpen ? "−" : "+"}
        </span>

      </button>

      {isOpen && (

        <div className="px-8 pb-8">
          {children}
        </div>

      )}

    </section>

  );

}

function Input({ label, ...props }) {

  return (

    <div>

      <label className="block mb-3 text-slate-300 font-bold">
        {label}
      </label>

      <input
        {...props}
        className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-400"
      />

    </div>

  );

}