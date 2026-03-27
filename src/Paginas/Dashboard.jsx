import { useEffect, useMemo, useState } from "react";
import supabase from '../Servicios/supabaseClient'
import { useNavigate } from "react-router-dom";
import ReportTable from "../Componentes/TablaReportes";
import Filters from "../Componentes/Filtros";

export default function Dashboard() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase
          .from("formularios_hechos")
          .select(`
            id_formulario,
            fecha,
            tipo_formulario,
            respuestas_operario (
              idpregunta,
              descripcion,
              idopcion,
              fotourl,
              pregunta:idpregunta (descripcion),
              opcion:idopcion (descripcion),
              personal:id_personal_respondido (nombre_completo)
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
            const respPatente = form.respuestas_operario?.find(r => Number(r.idpregunta) === 32);
            const respuestas = form.respuestas_operario || [];
            const respChofer = respuestas.find(r => Number(r.idpregunta) === 15);

            const checkAlerta = (idPregunta) => {
              const r = respuestas.find(res => Number(res.idpregunta) === idPregunta);
              const textoRespuesta = r?.opcion?.descripcion || r?.descripcion || "";
              return textoRespuesta.trim().toLowerCase() === "requiere atención";
            };

            return {
              id: form.id_formulario,
              usuario: respChofer?.personal?.nombre_completo || "Sin Chofer",
              fecha: form.fecha,
              respuestas: respuestas,
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
                espejos: checkAlerta(23),
                candado: checkAlerta(26)
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
    if (searchText.trim()) {
      const term = searchText.toLowerCase().trim();
      items = items.filter(r => 
        (r.usuario || "").toLowerCase().includes(term) ||
        (r.patente || "").toLowerCase().includes(term) ||
        (r.id || "").toString().includes(term)
      );
    }
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
  }, [rows, searchText, startDate, endDate]);

  const stats = useMemo(() => {
    const conteoPatentes = filteredRows.reduce((acc, current) => {
      const patente = current.patente;
      if (patente && patente !== "N/A") {
        acc[patente] = (acc[patente] || 0) + 1;
      }
      return acc;
    }, {});

    const listaPatentesViajes = Object.entries(conteoPatentes)
      .map(([patente, viajes]) => ({ patente, viajes }))
      .sort((a, b) => b.viajes - a.viajes);

    return {
      totalRevisiones: filteredRows.length,
      patentesAgrupadas: listaPatentesViajes,
      latest: filteredRows[0]?.fecha ? new Date(filteredRows[0].fecha).toLocaleString('es-CL') : '—',
    };
  }, [filteredRows]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="main-title">Reporte Checklist Camión</h1>
        <div className="logo-wrapper">
          <img src="/logo.png" alt="Logo Moving Food" className="brand-logo" />
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card table-card">
          <div className="table-card-header">
            <span className="stat-label">Revisiones por Patente</span>
            <span className="stat-total-label">
              Total: <strong>{stats.totalRevisiones}</strong>
            </span>
          </div>
          
          <div className="mini-table-container">
            <table className="mini-stat-table">
              <thead>
                <tr>
                  <th>PATENTE VEHÍCULO</th>
                  <th className="text-right">CANTIDAD DE CHECKLIST</th>
                </tr>
              </thead>
              <tbody>
                {stats.patentesAgrupadas.length > 0 ? (
                  stats.patentesAgrupadas.map((item, index) => (
                    <tr key={index}>
                      <td>{item.patente}</td>
                      <td className="text-right count-cell">{item.viajes}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center empty-cell">No hay datos de patentes</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-label">Último registro</span>
          <span className="stat-value small-text">{stats.latest}</span>
        </div>

        <div 
          className="stat-card clickable-card" 
          onClick={() => navigate("/dashboard-limpieza")}
          style={{ cursor: 'pointer', borderLeft: '5px solid #E7F63C' }}
        >
          <span className="stat-label">Reportes Checklist Limpieza</span>
          <div className="stat-link-content">
            <span className="stat-value small-text">Ir a Checklist Limpieza</span>
            <span className="arrow-icon">→</span>
          </div>
        </div>
      </div>

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

      <ReportTable rows={filteredRows} />

      <footer className="dashboard-footer">
        <p>{new Date().getFullYear()} © <strong>Moving Food</strong> - Checklist de Camiones</p>
        <span>Desarrollado para la gestión interna de flotas.</span>
      </footer>

      <style jsx>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f9fbf9;
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
          border-left: 5px solid #004d40;
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

        .stat-value.small-text { font-size: 1.2rem; }

        .actions-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .results-count { font-size: 0.9rem; color: #666; margin: 0; }

        .dashboard-footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          color: #888;
        }

        .table-card { padding: 15px !important; min-width: 300px; }
        .table-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .stat-total-label { font-size: 0.8rem; color: #666; }
        .mini-table-container { max-height: 150px; overflow-y: auto; }
        .mini-stat-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
        .mini-stat-table th { text-align: left; background: #f4f4f4; padding: 5px; position: sticky; top: 0; color: #555; }
        .mini-stat-table td { padding: 6px 5px; border-bottom: 1px solid #f0f0f0; }
        .count-cell { font-weight: bold; color: #004d40; }
        .text-right { text-align: right; }

        .stat-link-content { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
        .arrow-icon { font-size: 1.2rem; font-weight: bold; color: #E7F63C; }
        .clickable-card:hover { background-color: #fff9f0; transform: translateY(-2px); transition: all 0.2s ease; }

        @media (max-width: 600px) {
          .dashboard-header { flex-direction: column; text-align: center; gap: 20px; }
          .main-title { font-size: 1.5rem; }
          .actions-bar { justify-content: center; text-align: center; }
        }
      `}</style>
    </div>
  );
}