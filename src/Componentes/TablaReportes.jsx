import { useState } from "react";
import { Modal, Box, Typography, IconButton, List, ListItem, Divider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function TablaReportes({ rows }) {
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  // Agrupamos las respuestas por el texto de la pregunta
  const respuestasAgrupadas = selectedSurvey?.respuestas.reduce((acc, current) => {
    const preguntaTitulo = current.pregunta?.descripcion || "General";
    
    if (!acc[preguntaTitulo]) {
      acc[preguntaTitulo] = [];
    }
    acc[preguntaTitulo].push(current);
    
    return acc;
  }, {});

  return (
    <div className="report-container">
      <table className="moving-food-table">
        <thead>
          <tr>
            <th>Nombre Chofer</th>
            <th>Fecha de Envío</th>
            <th style={{ textAlign: 'center' }}>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr key={row.id}>
                <td className="font-bold">{row.usuario}</td>
                <td>{row.fecha ? new Date(row.fecha).toLocaleString('es-CL') : '—'}</td>
                <td style={{ textAlign: 'center' }}>
                  <IconButton 
                    onClick={() => setSelectedSurvey(row)} 
                    sx={{ color: '#004d40' }} // Verde corporativo
                  >
                    <OpenInNewIcon />
                  </IconButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                No se encontraron registros.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* --- MANTENEMOS TU MODAL ACTUAL --- */}
      <Modal open={Boolean(selectedSurvey)} onClose={() => setSelectedSurvey(null)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: { xs: '95%', md: 650 }, bgcolor: 'background.paper', boxShadow: 24, p: 4,
          borderRadius: 3, maxHeight: '85vh', overflowY: 'auto'
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Detalle del Checklist</Typography>
            <IconButton onClick={() => setSelectedSurvey(null)}><CloseIcon /></IconButton>
          </Box>
          
          <Typography variant="subtitle2" color="text.secondary" mb={3} sx={{ backgroundColor: '#f5f5f5', p: 1, borderRadius: 1 }}>
            👤 {selectedSurvey?.usuario} | 📅 {selectedSurvey ? new Date(selectedSurvey.fecha).toLocaleString() : ''}
          </Typography>

          <List>
            {respuestasAgrupadas && Object.entries(respuestasAgrupadas).map(([titulo, respuestas], idx) => (
              <div key={idx}>
                <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', gap: 1, py: 2 }}>
                  {/* Título de la Pregunta (Se muestra una sola vez) */}
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#004d40', textTransform: 'uppercase' }}>
                    {titulo}
                  </Typography>
                  
                  {/* Lista de respuestas para esa pregunta */}
                  <Box sx={{ width: '100%', mt: 1 }}>
                    {respuestas.map((r, rIdx) => (
                      <Box key={rIdx} sx={{ mb: 1.5 }}>
                        {r.fotourl ? (
                          <Box>
                            <img 
                              src={r.fotourl} 
                              alt="Evidencia" 
                              style={{ maxWidth: '100%', borderRadius: '12px', border: '1px solid #ddd', marginTop: '8px' }} 
                            />
                          </Box>
                        ) : (
                          <Typography variant="body1" sx={{ color: '#333', display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '8px', color: '#004d40' }}>•</span>
                            {r.opcion?.descripcion || r.descripcion || "—"}
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

      {/* --- ESTILOS CSS --- */}
      <style jsx>{`
        .report-container {
          width: 100%;
          background-color: #D8EED8; /* Tu verde claro */
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.05);
        }

        .moving-food-table {
          width: 100%;
          border-collapse: collapse;
          font-family: sans-serif;
        }

        .moving-food-table thead {
          background-color: #004d40; /* Verde Moving Food */
          color: white;
        }

        .moving-food-table th {
          padding: 18px 20px;
          text-align: left;
          font-weight: 600;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .moving-food-table td {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(0,0,0,0.04);
          color: #2c3e50;
          font-size: 0.95rem;
        }

        .moving-food-table tbody tr:hover {
          background-color: rgba(255, 255, 255, 0.4);
          transition: 0.2s;
        }

        .font-bold {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}