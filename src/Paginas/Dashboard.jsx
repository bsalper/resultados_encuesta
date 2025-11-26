import { useEffect, useState } from "react";
import supabase from '../Servicios/supabaseClient'

import ReportTable from "../Componentes/TablaReportes";
import Filters from "../Componentes/Filtros";
import { exportToCSV } from "../Componentes/ExportarCSV";

export default function Dashboard() {
  
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    async function loadData() {
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

      if (!error) {
        setRows(
          data.map((x) => ({
            ...x,
            pregunta: x.pregunta?.descripcion,
            opcion: x.opcion?.descripcion
          }))
        );
      }
    }
    loadData();
  }, []);

  const filteredRows = rows.filter((r) =>
    r.nombreencuestado?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: 30 }}>
      <h1>Reportes de Respuestas</h1>

      <Filters setSearchText={setSearchText} />

      <button 
        onClick={() => exportToCSV("reporte.csv", filteredRows)}
        style={{ marginBottom: 15 }}>
        Descargar CSV
      </button>

      <ReportTable rows={filteredRows} />
    </div>
  );
}
