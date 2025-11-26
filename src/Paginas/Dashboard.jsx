import { useEffect, useMemo, useState } from "react";
import supabase from '../Servicios/supabaseClient'

import ReportTable from "../Componentes/TablaReportes";
import Filters from "../Componentes/Filtros";
import { exportToCSV } from "../Componentes/ExportarCSV";

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function Dashboard() {
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data, error } = await supabase
        .from("respuesta")
        .select(`
          idrespuesta,
          nombreencuestado,
          fotourl,
          fecha,
          pregunta:pregunta(descripcion),
          opcion:tiporespuesta(descripcion)
        `);

      if (!error && data) {
        setRows(
          data.map((x) => ({
            ...x,
            pregunta: x.pregunta?.descripcion,
            opcion: x.opcion?.descripcion
          }))
        );
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredRows = useMemo(
    () => rows.filter((r) =>
      r.nombreencuestado?.toLowerCase().includes(searchText.toLowerCase())
    ),
    [rows, searchText]
  );

  const stats = useMemo(() => {
    const total = rows.length;
    const uniqueNames = new Set(rows.map(r => r.nombreencuestado)).size;
    const latest = rows.reduce((acc, r) => {
      const d = r.fecha ? new Date(r.fecha) : null;
      if (!acc || (d && d > acc)) return d;
      return acc;
    }, null);

    const mostAsked = rows.reduce((acc, r) => {
      acc[r.pregunta] = (acc[r.pregunta] || 0) + 1;
      return acc;
    }, {});
    const topQuestion = Object.entries(mostAsked).sort((a,b) => b[1]-a[1])[0];

    return {
      total,
      uniqueNames,
      latest: latest ? new Date(latest).toLocaleString() : '—',
      topQuestion: topQuestion ? `${topQuestion[0]} (${topQuestion[1]})` : '—'
    };
  }, [rows]);

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Reportes de Respuestas</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => exportToCSV("reporte.csv", filteredRows)}
            sx={{
              mr: 1,
              backgroundColor: "#E2DC00",
              color: "#000",
              "&:hover": {
                backgroundColor: "#E2DC00",
              }
            }}
          >
            Exportar CSV
          </Button>
          <IconButton
            onClick={() => window.location.reload()}
            sx={{
              color: "#E2DC00",
              "&:hover": { color: "#E2DC00" }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Total respuestas</Typography>
              <Typography variant="h5">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Encuestados únicos</Typography>
              <Typography variant="h5">{stats.uniqueNames}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Última respuesta</Typography>
              <Typography variant="h6">{stats.latest}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Pregunta más frecuente</Typography>
              <Typography variant="h6">{stats.topQuestion}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Filters searchText={searchText} setSearchText={setSearchText} />
        <Typography variant="body2" color="text.secondary">{filteredRows.length} filas</Typography>
      </Box>

      <ReportTable rows={filteredRows} />
    </Container>
  );
}
