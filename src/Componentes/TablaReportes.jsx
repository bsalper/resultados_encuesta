import { useState } from "react";
import { Modal, Box, Typography, IconButton, List, ListItem, Divider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function TablaReportes({ rows }) {
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  // 1. Agrupamos las respuestas para el Modal
  const respuestasAgrupadas = selectedSurvey?.respuestas?.reduce((acc, current) => {
    
    const preguntaTitulo = current.pregunta?.descripcion ||
                          current.pregunta?.pregunta?.descripcion ||
                          "Pregunta sin Título";

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
            <th>Patente</th>
            <th>Fecha de Envío</th>
            <th style={{ textAlign: 'center' }}>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {rows && rows.length > 0 ? (
            rows.map((row) => (
              <tr key={row.id}>
                <td className="font-bold">{row.usuario}</td>
                <td className="font-bold" style={{ color: '#004d40' }}>
                  {row.patente || "N/A"}
                </td>
                <td>{row.fecha ? new Date(row.fecha).toLocaleString('es-CL') : '—'}</td>
                <td style={{ textAlign: 'center' }}>
                  <IconButton onClick={() => setSelectedSurvey(row)} sx={{ color: '#004d40' }}>
                    <OpenInNewIcon />
                  </IconButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                No se encontraron registros.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* --- MODAL --- */}
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
            👤 {selectedSurvey?.usuario} | 📅 {selectedSurvey ? new Date(selectedSurvey.fecha).toLocaleString('es-CL') : ''}
          </Typography>

          <List>
            {respuestasAgrupadas && Object.entries(respuestasAgrupadas).map(([titulo, respuestas], idx) => (
              <div key={idx}>
                <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', gap: 1, py: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#004d40', textTransform: 'uppercase' }}>
                    {titulo}
                  </Typography>
                  <Box sx={{ width: '100%', mt: 1 }}>
                    {respuestas.map((r, rIdx) => (
                      <Box key={rIdx} sx={{ mb: 1.5 }}>
                        {r.fotourl ? (
                          <img 
                            src={r.fotourl} 
                            alt="Evidencia" 
                            style={{ maxWidth: '100%', borderRadius: '12px', border: '1px solid #ddd', marginTop: '8px' }} 
                          />
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
        .report-container {
          width: 100%;
          background-color: #D8EED8;
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
          background-color: #004d40;
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