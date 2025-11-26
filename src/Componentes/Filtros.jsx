export default function Filtros({ setSearchText }) {

  return (
    <div style={{ marginBottom: 20 }}>
      <input
        type="text"
        placeholder="Buscar por nombre..."
        onChange={(e) => setSearchText(e.target.value)}
        style={{ padding: 8, width: 250 }}
      />
    </div>
  );
}
