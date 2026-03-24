import { useEffect, useMemo, useState } from "react";
import supabase from '../Servicios/supabaseClient'

import ReportTable from "../Componentes/TablaReportes";
import Filters from "../Componentes/Filtros";

export default function Dashboard() {
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        // En Dashboard.jsx, dentro de loadData:
      // En Dashboard.jsx, dentro de loadData:
      const { data, error } = await supabase
        .from("formularios_hechos")
        .select(`
          id_formulario,
          nombre_encuestado,
          fecha,
          tipo_formulario,
          respuestas_operario (
            idrespuestas,
            idpregunta,
            descripcion,
            idopcion,
            fotourl,
            pregunta:idpregunta (descripcion), 
            opcion:idopcion (descripcion)
          )
        `)
        .ilike('tipo_formulario', '%operario%')
        .order('fecha', { ascending: false });

        if (error) {
          console.error("Error cargando operarios:", error);
          return;
        }

        if (data) {
        const formateados = data.map(form => {
          // Buscamos la respuesta de la patente (ID 32)
          const respPatente = form.respuestas_operario?.find(r => Number(r.idpregunta) === 32);
          const respuestas = form.respuestas_operario || [];

          const checkAlerta = (idPregunta) => {
            const r = respuestas.find(res => Number(res.idpregunta) === idPregunta);
            
            const textoRespuesta = r?.opcion?.descripcion || r?.descripcion || "";
            
            return textoRespuesta.trim().toLowerCase() === "requiere atención";
          };

          return {
            id: form.id_formulario,
            usuario: form.nombre_encuestado || "Usuario Desconocido",
            fecha: form.fecha,
            respuestas: form.respuestas_operario, // Pasamos las respuestas tal cual para el Modal
            // Extraemos la patente solo para mostrarla en la columna de la tabla
            patente: respPatente?.opcion?.descripcion || respPatente?.descripcion || "N/A",

            alertas: {
              bateria: checkAlerta(37),
              neumaticos: checkAlerta(25),
              aceite: checkAlerta(29),
              frenos: checkAlerta(38),
              refrigerante: checkAlerta(36),
              lucesd: checkAlerta(24),
              lucest: checkAlerta(33),
              neumaticosr: checkAlerta(34),
              parachoques: checkAlerta(35),
              espejos: checkAlerta(23)
            }
          };
        });
        setRows(formateados);
      }
      } catch (err) {
        console.error("Error en el flujo de datos:", err);
      }
    }
    loadData();
  }, []);

  const filteredRows = useMemo(() => {
    let items = [...rows];

    // 1. Filtro por Texto (Chofer/Patente/ID)
    // Nota: Quitamos el "if (!searchText.trim()) return rows" del principio 
    // para que los filtros de fecha puedan funcionar aunque no haya texto.
    if (searchText.trim()) {
      const term = searchText.toLowerCase().trim();
      items = items.filter(r => 
        (r.usuario || "").toLowerCase().includes(term) ||
        (r.patente || "").toLowerCase().includes(term) ||
        (r.id || "").toString().includes(term)
      );
    }

    // 2. Filtro por Rango de Fechas
    if (startDate || endDate) {
      items = items.filter(r => {
        if (!r.fecha) return false;
        const fechaRegistro = r.fecha.split('T')[0]; 
        const inicioOk = startDate ? fechaRegistro >= startDate : true;
        const finOk = endDate ? fechaRegistro <= endDate : true;
        return inicioOk && finOk;
      });
    }

    return items;

    // IMPORTANTE: Agregamos startDate y endDate aquí abajo
  }, [rows, searchText, startDate, endDate]);

  const stats = useMemo(() => {
    return {
      total: rows.length,
      latest: rows[0]?.fecha ? new Date(rows[0].fecha).toLocaleString('es-CL') : '—',
    };
  }, [rows]);

  return (
    <div className="dashboard-container">
      {/* HEADER: Título y Logo */}
      <header className="dashboard-header">
        <h1 className="main-title">Reporte Checklist Camión</h1>
        <div className="logo-wrapper">
          <img src="/logo.png" alt="Logo Moving Food" className="brand-logo" />
        </div>
      </header>

      {/* CARDS DE ESTADÍSTICAS */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Revisiones totales</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Último registro</span>
          <span className="stat-value small-text">{stats.latest}</span>
        </div>
      </div>

      {/* BARRA DE FILTROS Y CONTADOR: UN SOLO BLOQUE CORREGIDO */}
      <div className="actions-bar">
        <Filters 
          searchText={searchText} 
          setSearchText={setSearchText}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        <p className="results-count">
          <strong>{filteredRows.length}</strong> resultados encontrados
        </p>
      </div>

      {/* TABLA PERSONALIZADA */}
      <ReportTable rows={filteredRows} />

      {/* FOOTER */}
      <footer className="dashboard-footer">
        <p>{new Date().getFullYear()} © <strong>Moving Food</strong> - Checklist de Camiones</p>
        <span>Desarrollado para la gestión interna de flotas.</span>
      </footer>

      {/* ESTILOS CSS */}
      <style jsx>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f9fbf9; /* Un fondo casi blanco con toque verde */
          min-height: 100vh;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .main-title {
          font-size: 2rem;
          font-weight: 800;
          color: #2c3e50;
          margin: 0;
        }

        .brand-logo {
          height: 100px;
          width: auto;
          object-fit: contain;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          border-left: 5px solid #004d40; /* Línea verde Moving Food */
        }

        .stat-label {
          font-size: 0.85rem;
          color: #666;
          text-transform: uppercase;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #004d40;
        }

        .stat-value.small-text {
          font-size: 1.2rem;
        }

        .actions-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .results-count {
          font-size: 0.9rem;
          color: #666;
          margin: 0;
        }

        .dashboard-footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          color: #888;
        }

        .dashboard-footer p {
          margin: 0;
          font-size: 0.9rem;
        }

        .dashboard-footer span {
          font-size: 0.75rem;
          display: block;
          margin-top: 5px;
        }

        @media (max-width: 600px) {
          .dashboard-header {
            flex-direction: column;
            text-align: center;
            gap: 20px;
          }
          .main-title { font-size: 1.5rem; }
          .actions-bar { justify-content: center; text-align: center; }
        }
      `}</style>
    </div>
  );
}