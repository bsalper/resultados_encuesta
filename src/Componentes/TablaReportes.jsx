import { useState, useMemo } from "react";
import { Modal, Box, Typography, IconButton, List, ListItem, Divider, Tooltip } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// Importaciones de iconos
import imgBateria from '../assets/bateria.png';
import imgNeumaticos from '../assets/neumatico.png';
import imgRefrigerante from '../assets/refrigerante.png';
import imgFreno from '../assets/freno.png';
import imgAceite from '../assets/aceite.png';
import imgLuces from '../assets/luces.png';
import imgNeumaticor from '../assets/neumaticor.png';
import imgEspejos from '../assets/espejo.png';
import imgParachoques from '../assets/parachoque.png';
import imgCandado from '../assets/candado.png';

// Recibimos "searchText" como prop desde el padre
export default function TablaReportes({ rows = [], searchText = "", showAuxiliares = false }) {
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'fecha', direction: 'desc' });

  // 1. Filtrado Universal y Ordenamiento
  const sortedAndFilteredRows = useMemo(() => {
    if (!Array.isArray(rows)) return [];
  
    let items = [...rows];

    if (searchText) {
      const term = searchText.toLowerCase().trim();
      items = items.filter(row => 
        String(row?.usuario || "").toLowerCase().includes(term) || 
        String(row?.patente || "").toLowerCase().includes(term)
      );
    }

    // Lógica de ordenamiento
    if (sortConfig.key) {
      items.sort((a, b) => {
        let valA = a?.[sortConfig.key] ?? '';
        let valB = b?.[sortConfig.key] ?? '';

        if (sortConfig.key === 'fecha') {
          valA = valA ? new Date(valA) : 0;
          valB = valB ? new Date(valB) : 0;
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [rows, searchText, sortConfig]);

  // 2. Agrupación para el Modal
  const respuestasAgrupadas = useMemo(() => {
    if (!selectedSurvey?.respuestas) return {};
    
    return selectedSurvey.respuestas.reduce((acc, current) => {
      const preguntaTitulo = 
        current.pregunta?.descripcion ||
        current.descripcion ||
        `Pregunta #${current.idpregunta}`;

      if (!acc[preguntaTitulo]) acc[preguntaTitulo] = [];
      acc[preguntaTitulo].push(current);
      return acc;
    }, {});
  }, [selectedSurvey]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpwardIcon sx={{ fontSize: '1rem', opacity: 0.3 }} />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUpwardIcon sx={{ fontSize: '1rem' }} /> 
      : <ArrowDownwardIcon sx={{ fontSize: '1rem' }} />;
  };

  const nombreChofer = selectedSurvey?.respuestas?.find(r => r.personal?.nombre_completo)?.personal?.nombre_completo || "Sin Chofer";

  return (
    <div className="main-wrapper" style={{ width: '100%' }}>
      <div className="report-container">
        <table className="moving-food-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('usuario')} style={{ cursor: 'pointer' }}>
                <Box display="flex" alignItems="center" gap={1}>Chofer {getSortIcon('usuario')}</Box>
              </th>
              <th>Patente</th>

              {/* 2. Cabeceras condicionales */}
              {showAuxiliares && <th>Auxiliar 1</th>}
              {showAuxiliares && <th>Auxiliar 2</th>}

              <th onClick={() => requestSort('fecha')} style={{ cursor: 'pointer' }}>
                <Box display="flex" alignItems="center" gap={1}>Fecha {getSortIcon('fecha')}</Box>
              </th>
              <th style={{ textAlign: 'center' }}>Alertas</th>
              <th style={{ textAlign: 'center' }}>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredRows.map((row) => (
              <tr key={row.id}>
                <td className="font-bold">{row.usuario}</td>
                <td className="font-bold" style={{ color: '#004d40' }}>{row.patente || "N/A"}</td>
                {/* 3. Celdas condicionales */}
                {showAuxiliares && <td>{row.auxiliar1 || "—"}</td>}
                {showAuxiliares && <td>{row.auxiliar2 || "—"}</td>}
                <td>{row.fecha ? new Date(row.fecha).toLocaleString('es-CL') : '—'}</td>
                <td style={{ textAlign: 'center' }}>
                  <Box display="flex" justifyContent="center" gap={1}>
                    
                    {row.alertas?.bateria && (
                      <Tooltip title="Atención: Revisar Batería" arrow>
                        <div className="custom-alert-icon">
                          <img src={imgBateria} alt="Alerta Batería" />
                        </div>
                      </Tooltip>
                    )}

                    {row.alertas?.neumaticos && (
                      <Tooltip title="Atención: Revisar Neumáticos" arrow>
                        <div className="custom-alert-icon">
                          <img src={imgNeumaticos} alt="Alerta Neumáticos" />
                        </div>
                      </Tooltip>
                    )}

                    {row.alertas?.refrigerante && (
                      <Tooltip title="Atención: Revisar líquido refrigerante" arrow>
                        <div className="custom-alert-icon">
                          <img src={imgRefrigerante} alt="Alerta Refrigerante" />
                        </div>
                      </Tooltip>
                    )}

                    {row.alertas?.frenos && (
                      <Tooltip title="Atención: Revisar Frenos" arrow>
                        <div className="custom-alert-icon">
                          <img src={imgFreno} alt="Alerta Frenos" />
                        </div>
                      </Tooltip>
                    )}

                    {row.alertas?.aceite && (
                      <Tooltip title="Atención: Revisar aceite" arrow>
                        <div className="custom-alert-icon">
                          <img src={imgAceite} alt="Alerta Aceite" />
                        </div>
                      </Tooltip>
                    )}

                    {row.alertas?.lucesd && (
                      <Tooltip title="Atención: Revisar luces delanteras" arrow>
                        <div className="custom-alert-icon">
                          <img src={imgLuces} alt="Alerta Luces Delanteras" />
                        </div>
                      </Tooltip>
                    )}

                    {row.alertas?.lucest && (
                      <Tooltip title="Atención: Revisar luces traseras" arrow>
                        <div className="custom-alert-icon">
                          <img src={imgLuces} alt="Alerta Luces Traseras" />
                        </div>
                      </Tooltip>
                    )}

                    {row.alertas?.neumaticosr && (
                      <Tooltip title="Atención: Revisar Neumáticos de respuesto" arrow>
                        <div className="custom-alert-icon">
                          <img src={imgNeumaticor} alt="Alerta Neumático Repuesto" />
                        </div>
                      </Tooltip>
                    )}

                    {row.alertas?.espejos && (
                      <Tooltip title="Atención: Revisar Espejos y Parabrisas" arrow>
                        <div className="custom-alert-icon">
                          <img src={imgEspejos} alt="Alerta Espejos y Parabrisas" />
                        </div>
                      </Tooltip>
                    )}

                    {row.alertas?.parachoques && (
                      <Tooltip title="Atención: Revisar Defensa frontal y trasera" arrow>
                        <div className="custom-alert-icon">
                          <img src={imgParachoques} alt="Alerta Parachoques" />
                        </div>
                      </Tooltip>
                    )}

                    {row.alertas?.candado && (
                      <Tooltip title="Atención: Revisar Candados y Pernos de puertas" arrow>
                        <div className="custom-alert-icon">
                          <img src={imgCandado} alt="Alerta Candados y Pernos" />
                        </div>
                      </Tooltip>
                    )}
                    
                  </Box>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <IconButton onClick={() => setSelectedSurvey(row)} sx={{ color: '#004d40' }}>
                    <OpenInNewIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
            {sortedAndFilteredRows.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                  No se encontraron resultados para "{searchText}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL --- */}
      <Modal open={Boolean(selectedSurvey)} onClose={() => setSelectedSurvey(null)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: { xs: '95%', md: 650 }, bgcolor: 'background.paper', p: 4, borderRadius: 3, 
          maxHeight: '85vh', overflowY: 'auto', boxShadow: 24
        }}>
          <Box display="flex" justifyContent="space-between" mb={2} alignItems="center">
            <Typography variant="h6" fontWeight="bold">Detalle del Checklist</Typography>
            <IconButton onClick={() => setSelectedSurvey(null)}><CloseIcon /></IconButton>
          </Box>

          <Typography 
            variant="subtitle2" 
            color="text.secondary" 
            mb={3} 
            sx={{ backgroundColor: '#f5f5f5', p: 1.5, borderRadius: 2, display: 'flex', gap: 2 }}
          >
            <span>👤 <strong>{nombreChofer}</strong></span>
            <span>📅 {selectedSurvey?.fecha ? new Date(selectedSurvey.fecha).toLocaleString('es-CL') : ''}</span>
            {selectedSurvey?.patente && <span>🚗 <strong>{selectedSurvey.patente}</strong></span>}
          </Typography>

          <List>
            {Object.entries(respuestasAgrupadas).map(([titulo, respuestas], idx) => (
              <div key={idx}>
                <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#004d40', textTransform: 'uppercase', mb: 1 }}>
                    {titulo}
                  </Typography>
                  <Box sx={{ width: '100%' }}>
                    {respuestas.map((r, rIdx) => (
                      <Box key={rIdx} sx={{ mb: 1.5 }}>
                        {r.fotourl ? (
                          <img src={r.fotourl} alt="Evidencia" style={{ maxWidth: '100%', borderRadius: '12px', border: '1px solid #ddd' }} />
                        ) : (
                          <Typography variant="body1" sx={{ color: '#333', display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '8px', color: '#004d40' }}>•</span>
                            {r.opcion?.descripcion || r.descripcion || "Sin respuesta"}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </Box>
      </Modal>

      <style jsx>{`
        .report-container { background-color: #D8EED8; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .moving-food-table { width: 100%; border-collapse: collapse; }
        .moving-food-table thead { background-color: #004d40; color: white; }
        .moving-food-table th { padding: 18px 20px; text-align: left; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }
        .moving-food-table td { padding: 16px 20px; border-bottom: 1px solid rgba(0,0,0,0.04); color: #2c3e50; }
        .moving-food-table tbody tr:hover { background-color: rgba(255, 255, 255, 0.4); }
        .font-bold { font-weight: 600; }

        /* Estilos para los iconos PNG de Alertas */
        .custom-alert-icon {
          width: 25px; /* Tamaño ideal para la celda */
          height: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse-alert 2s infinite;
        }

        .custom-alert-icon img {
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        @keyframes pulse-alert {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}