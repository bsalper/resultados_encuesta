import { useEffect, useMemo, useState } from "react";
import supabase from '../Servicios/supabaseClient'
import { useNavigate } from "react-router-dom";
import "./DashboardStyle.css";

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
        // En Dashboard.jsx, dentro de loadData:
      // En Dashboard.jsx, dentro de loadData:
      const { data, error } = await supabase
        .from("formularios_hechos")
        .select(`
            id_formulario,
            fecha,
            tipo_formulario,
            respuestas_limpieza (
              idpregunta,
              descripcion,
              idopcion,
              fotourl,
              pregunta:idpregunta (descripcion),
              opcion:idopcion (descripcion),
              personal:id_personal_respondido (nombre_completo)
            )
        `)
        .ilike('tipo_formulario', '%limpieza%')
        .order('fecha', { ascending: false });

        if (error) {
          console.error("Error cargando operarios:", error);
          return;
        }

        if (data) {
        const formateados = data.map(form => {
          const respuestasOriginales = form.respuestas_limpieza || [];
          const respuestasProcesadas = respuestasOriginales.map(r => {
            if (r.personal?.nombre_completo) {
              return { ...r, descripcion: r.personal.nombre_completo };
            }
            return r;
          });
          const respuestas = form.respuestas_limpieza || [];
          const respChofer = respuestas.find(r => Number(r.idpregunta) === 39);
          const respPatente = respuestas.find(r => Number(r.idpregunta) === 40);
          
          const respAux1 = respuestasProcesadas.find(r => Number(r.idpregunta) === 52);
          const respAux2 = respuestasProcesadas.find(r => Number(r.idpregunta) === 53);
          /*const checkAlerta = (idPregunta) => {
            const r = respuestas.find(res => Number(res.idpregunta) === idPregunta);
            
            const textoRespuesta = r?.opcion?.descripcion || r?.descripcion || "";
            
            return textoRespuesta.trim().toLowerCase() === "requiere atención";
          };*/

          return {
            id: form.id_formulario,
            usuario: respChofer?.personal?.nombre_completo || respChofer?.descripcion || "Usuario Desconocido",
            fecha: form.fecha,
            respuestas: respuestasProcesadas,
            patente: respPatente?.opcion?.descripcion || respPatente?.descripcion || "N/A",
            auxiliar1: respAux1?.descripcion || "—",
            auxiliar2: respAux2?.descripcion || "—"
            /*alertas: { 
            }*/
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
    // 1. Agrupar conteo de auxiliares
    const conteoAuxiliares = filteredRows.reduce((acc, current) => {
      // Revisamos ambos auxiliares (si existen y no son "—")
      [current.auxiliar1, current.auxiliar2].forEach(aux => {
        if (aux && aux !== "—") {
          acc[aux] = (acc[aux] || 0) + 1;
        }
      });
      return acc;
    }, {});

    // 2. Convertir el objeto a una lista ordenada por cantidad
    const listaAuxiliares = Object.entries(conteoAuxiliares)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);

    return {
      totalRevisiones: filteredRows.length,
      auxiliaresAgrupados: listaAuxiliares,
      latest: filteredRows[0]?.fecha ? new Date(filteredRows[0].fecha).toLocaleString('es-CL') : '—',
    };
  }, [filteredRows]);

  return (
    <div className="dashboard-container">
      {/* HEADER: Título y Logo */}
      <header className="dashboard-header">
        <h1 className="main-title">Reporte Checklist Limpieza</h1>
        <div className="logo-wrapper">
          <img src="/logo.png" alt="Logo Moving Food" className="brand-logo" />
        </div>
      </header>

      {/* CARDS DE ESñTADÍSTICAS: Ahora las 3 están en el mismo grid */}
      <div className="stats-grid">
        
        {/* 1. REVISIONES POR AUXILIAR */}
        <div className="stat-card table-card">
          <div className="table-card-header">
            <span className="stat-label">Revisiones por Auxiliar</span>
            <span className="stat-total-label">
              Total Checklist: <strong>{stats.totalRevisiones}</strong>
            </span>
          </div>
          
          <div className="mini-table-container">
            <table className="mini-stat-table">
              <thead>
                <tr>
                  <th>NOMBRE AUXILIAR</th>
                  <th className="text-right">CANTIDAD</th>
                </tr>
              </thead>
              <tbody>
                {stats.auxiliaresAgrupados.length > 0 ? (
                  stats.auxiliaresAgrupados.map((item, index) => (
                    <tr key={index}>
                      <td>{item.nombre}</td>
                      <td className="text-right count-cell">{item.cantidad}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center empty-cell">No hay datos de auxiliares</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. ÚLTIMO REGISTRO */}
        <div className="stat-card">
          <span className="stat-label">Último registro</span>
          <span className="stat-value small-text">{stats.latest}</span>
        </div>

        {/* 3. ACCESO A CAMIÓN (Mantenido dentro del grid para alineación) */}
        <div 
          className="stat-card clickable-card" 
          onClick={() => navigate("/dashboard")}
          style={{ cursor: 'pointer', borderLeft: '5px solid #E7F63C' }}
        >
          <span className="stat-label">Reporte Checklist Camión</span>
          <div className="stat-link-content">
            <span className="stat-value small-text">Ir a Checklist Camión</span>
            <span className="arrow-icon">→</span>
          </div>
        </div>

      </div>

      {/* BARRA DE FILTROS Y CONTADOR */}
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
      <ReportTable rows={filteredRows} showAuxiliares={true}/>

      {/* FOOTER */}
      <footer className="dashboard-footer">
        <p>{new Date().getFullYear()} © <strong>Moving Food</strong> - Checklist de Limpieza</p>
        <span>Desarrollado para la gestión interna de flotas.</span>
      </footer>
    </div>
  );
}