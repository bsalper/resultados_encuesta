import { DataGrid } from "@mui/x-data-grid";

export default function TablaReportes({ rows }) {

  const columns = [
    { field: "idrespuesta", headerName: "ID", width: 90 },
    { field: "nombreencuestado", headerName: "Nombre", width: 150 },
    { field: "pregunta", headerName: "Pregunta", width: 250 },
    {
      field: "opcion",
      headerName: "Respuesta",
      width: 250,
      renderCell: (params) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>{params.value}</span>
          {params.row.fotourl ? (
            <a href={params.row.fotourl} target="_blank">Ver foto</a>
          ) : null}
        </div>
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
      />
    </div>
  );
}
