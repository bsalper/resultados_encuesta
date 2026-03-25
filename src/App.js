import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Paginas/Dashboard";
import DashboardLimpieza from "./Paginas/DashboardLimpieza"; // El que vas a crear

function App() {
  return (
    <Router>
      <Routes>
        {/* Tu ruta actual de camiones */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* La nueva ruta que el botón intentará buscar */}
        <Route path="/dashboard-limpieza" element={<DashboardLimpieza />} />
        
        {/* Ruta por defecto */}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;