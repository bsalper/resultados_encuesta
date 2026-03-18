import React from 'react';

export default function Filtros({ searchText, setSearchText }) {
  return (
    <div className="filters-wrapper">
      <div className="search-container">
        {/* Icono de Lupa (SVG simple) */}
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
          placeholder="Buscar chofer por nombre..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        
        {/* Botón opcional para limpiar la búsqueda si hay texto */}
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

      {/* --- ESTILOS CSS PERSONALIZADOS --- */}
      <style jsx>{`
        .filters-wrapper {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .search-container {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 320px; /* Ancho similar al TextField anterior */
        }

        .search-input {
          width: 100%;
          padding: 12px 15px 12px 45px; /* Espacio extra a la izquierda para el icono */
          font-size: 0.95rem;
          color: #333;
          background-color: white;
          border: 1px solid #e0e0e0;
          border-radius: 10px; /* Bordes redondeados modernos */
          transition: all 0.2s ease;
          box-shadow: 0 2px 5px rgba(0,0,0,0.03); /* Sombra sutil */
        }

        /* Quitar el borde azul por defecto del navegador */
        .search-input:focus {
          outline: none;
          border-color: #004d40; /* Verde corporativo de Moving Food */
          box-shadow: 0 0 0 3px rgba(0, 77, 64, 0.1); /* Efecto de foco suave en verde */
        }

        /* Estilo para el icono de lupa */
        .search-icon {
          position: absolute;
          left: 15px;
          width: 18px;
          height: 18px;
          color: #004d40; /* Verde corporativo */
          pointer-events: none; /* Para que el clic pase a través del icono al input */
        }

        /* Estilo para el botón de limpiar (✕) */
        .clear-button {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #999;
          font-size: 1.1rem;
          cursor: pointer;
          padding: 5px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .clear-button:hover {
          background-color: #f0f0f0;
          color: #e74c3c; /* Color rojo sutil al pasar el mouse */
        }
      `}</style>
    </div>
  );
}