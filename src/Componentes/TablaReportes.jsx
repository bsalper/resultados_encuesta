import { useState, useMemo } from "react";
import { Modal, Box, Typography, IconButton, List, ListItem, Divider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// Recibimos "searchText" como prop desde el padre
export default function TablaReportes({ rows = [], searchText = "" }) {
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'fecha', direction: 'desc' });

  // 1. Filtrado Universal y Ordenamiento
  const sortedAndFilteredRows = useMemo(() => {
    if (!Array.isArray(rows)) return [];
  
    let items = [...rows];

    if (searchText) {
      const term = searchText.toLowerCase().trim();
      items = items.filter(row => {
        const nombre = String(row?.usuario || "").toLowerCase();
        const patente = String(row?.patente || "").toLowerCase();
        
        return nombre.includes(term) || patente.includes(term);
      });
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
      const preguntaTitulo = current.pregunta?.descripcion ||
                             current.pregunta?.pregunta?.descripcion ||
                             "Pregunta sin Título";

      if (!acc[preguntaTitulo]) {
        acc[preguntaTitulo] = [];
      }
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
              <th onClick={() => requestSort('fecha')} style={{ cursor: 'pointer' }}>
                <Box display="flex" alignItems="center" gap={1}>Fecha {getSortIcon('fecha')}</Box>
              </th>
              <th style={{ textAlign: 'center' }}>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredRows.map((row) => (
              <tr key={row.id}>
                <td className="font-bold">{row.usuario}</td>
                <td className="font-bold" style={{ color: '#004d40' }}>{row.patente || "N/A"}</td>
                <td>{row.fecha ? new Date(row.fecha).toLocaleString('es-CL') : '—'}</td>
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
            <span>👤 <strong>{selectedSurvey?.usuario}</strong></span>
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
                            {r.tiporespuesta?.descripcion || r.opcion?.descripcion || r.descripcion || "—"}
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
      `}</style>
    </div>
  );
}