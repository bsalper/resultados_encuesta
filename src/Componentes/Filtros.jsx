import React from 'react';

// AGREGAMOS las props que faltaban en la cabecera de la función
export default function Filtros({ 
  searchText, 
  setSearchText, 
  startDate, 
  setStartDate, 
  endDate, 
  setEndDate 
}) {
  return (
    <div className="filters-wrapper">
      {/* Contenedor del Buscador de Texto */}
      <div className="search-container">
        <svg 
          className="search-icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por chofer o patente..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        
        {searchText && (
          <button 
            className="clear-button" 
            onClick={() => setSearchText("")}
            title="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>

      {/* Contenedor de Fechas (Separado para mejor orden) */}
      <div className="date-filters">
        <div className="date-input-group">
          <label>Desde:</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
          />
        </div>
        <div className="date-input-group">
          <label>Hasta:</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
          />
        </div>
        {(startDate || endDate) && (
          <button className="reset-dates" onClick={() => {setStartDate(""); setEndDate("");}}>
            Limpiar Fechas
          </button>
        )}
      </div>

      <style jsx>{`
        .filters-wrapper {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .search-container {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 320px;
        }

        .search-input {
          width: 100%;
          padding: 10px 15px 10px 45px;
          font-size: 0.95rem;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #004d40;
          box-shadow: 0 0 0 3px rgba(0, 77, 64, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 15px;
          width: 18px;
          height: 18px;
          color: #004d40;
        }

        .clear-button {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
        }

        /* Estilos para las Fechas */
        .date-filters {
          display: flex;
          align-items: center;
          gap: 15px;
          background: #f1f3f1;
          padding: 6px 15px;
          border-radius: 10px;
        }

        .date-input-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .date-input-group label {
          font-size: 0.8rem;
          font-weight: bold;
          color: #444;
        }

        .date-input-group input {
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 4px;
          font-family: inherit;
        }

        .reset-dates {
          background: none;
          border: none;
          color: #c0392b;
          font-size: 0.75rem;
          cursor: pointer;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}