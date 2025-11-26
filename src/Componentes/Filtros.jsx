import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export default function Filtros({ searchText, setSearchText }) {
  return (
    <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      <TextField
        size="small"
        label="Buscar por nombre"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{ minWidth: 260 }}
      />
    </Box>
  );
}
