import React, { useState } from "react";
 
const DataTable = ({
  columns,
  data,
  title,
  description,
  useCreateButton,
  titleButton,
  handleOnClick,
}: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Cambia este valor según necesites

  // Filtrar los datos según el término de búsqueda
  const filteredData = data.filter((item) => {
    return columns.some((column) => {
      const value = item[column.accessor]; // Obtén el valor de la columna
      return value != null && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reiniciar a la primera página al buscar
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4">
      {/* Campo de  búsqueda */}
      <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border">
        <div className="flex flex-col justify-between gap-8 mb-4 md:flex-row md:items-center">
          <div>
            <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              {title && title}
            </h5>
            <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
              {description && description}
            </p>
          </div>
          <div className="flex w-full gap-2 shrink-0 md:w-max">
            <div className="w-full md:w-72">
              <div className="relative h-10 w-full min-w-[200px]">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                />
                <button
                  className="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-white rounded "
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="3"
                    stroke="currentColor"
                    className="w-8 h-8 text-slate-600"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
           
            {useCreateButton && (
              <button
                className="flex select-none items-center gap-3 rounded-lg bg-slate-800 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                onClick={handleOnClick && handleOnClick}
              >
                {titleButton && titleButton}
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Tabla */}
      <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr className="bg-gray-200">
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  className="p-4 border-b border-slate-200 bg-slate-50"
                >
                  <p className="text-sm font-normal leading-none text-slate-500">
                    {column.Header}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-slate-50 border-b border-slate-200"
                >
                  {columns.map((column) => (
                    <td key={column.accessor} className="p-4 py-5">
                      {column.customRender ? (
                        column.customRender(index, item)
                      ) : (
                        <p className="text-sm text-slate-500">
                          {item[column.accessor]}
                        </p>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="flex justify-between items-center px-4 py-3">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50  hover:bg-slate-800 hover:text-white transition duration-200 ease"
          >
            Anterior
          </button>
          <div className="text-sm text-slate-500">
            Página {currentPage} de {totalPages}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:bg-slate-800 hover:text-white  transition duration-200 ease"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
