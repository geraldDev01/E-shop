'use client'
import React, { useState } from "react";
import DataTable from "@/components/ui/DataTable/DataTable";

export default function OrderHistoryPage() {
    const [data, setData] = useState([]);


    const columns = [
        { Header: "Nombre", accessor: "fulll_name" },
        { Header: "correo", accessor: "email" },
        { Header: "Telefono Contacto", accessor: "phone" },
        { Header: "Departamento", accessor: "department_description" },
        { Header: "Municipio", accessor: "municipality_description" },
        {
            Header: "Acciones",
            accessor: "id",
            customRender: (index, item) => {
                return (
                    <button
                        className="relative h-10 max-h-[50px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button"

                    >
                        ver detalle
                    </button>
                );
            },
        },
    ];


    return (
        <div>

            <DataTable
                title={"Orden"}
                columns={columns}
                data={data}
                description="Historial de ordenes"
                useCreateButton={false}
                titleButton={"Agregar Articulo"}
            // handleOnClick={() => navigate(`/employees/new`)}
            />
        </div>

    )

}