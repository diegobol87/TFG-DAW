import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Perfil from "./pages/Perfil";
import Carrito from "./pages/Carrito";
import Producto from "./pages/Producto";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Pedidos from "./pages/Pedidos";
import Admin from "./pages/Admin";

function App() {

  return (

    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/catalogo" element={<Catalogo />} />

      <Route path="/producto/:id" element={<Producto />} />

      <Route path="/perfil" element={<Perfil />} />

      <Route path="/carrito" element={<Carrito />} />

      <Route path="/checkout" element={<Checkout />} />

      <Route path="/pedidos" element={<Pedidos />} />

      <Route path="/admin" element={<Admin />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

    </Routes>

  );

}

export default App;