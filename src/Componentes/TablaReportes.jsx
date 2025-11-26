import { DataGrid } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Typography from '@mui/material/Typography';

export default function TablaReportes({ rows }) {

  const columns = [
    { field: "idrespuesta", headerName: "ID", width: 90 },
    {
      field: "nombreencuestado",
      headerName: "Nombre",
      width: 220,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar src={params.row.fotourl} alt={params.value} sx={{ width: 36, height: 36 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Stack>
      )
    },
    { field: "pregunta", headerName: "Pregunta", width: 250 },
    {
      field: "opcion",
      headerName: "Respuesta",
      width: 320,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2">{params.value}</Typography>
          {params.row.fotourl ? (
            <IconButton href={params.row.fotourl} target="_blank" size="small" aria-label="open">
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          ) : null}
        </Stack>
      )
    },
    { field: "fecha", headerName: "Fecha", width: 180 }
  ];

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        getRowId={(row) => row.idrespuesta}
        sx={{
          '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f5f5f5' },
          '& .MuiDataGrid-cell': { alignItems: 'center' }
        }}
      />
    </div>
  );
}
