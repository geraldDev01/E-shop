'use client'
import React, { useState, useEffect } from "react";
import DataTable from "@/components/ui/DataTable/DataTable";

import { getAllCategories } from "@/api/inventory";

export default function CategoryPage() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await getAllCategories();
                if (result.success && result.data) {
                    setData(result.data);
                }
            } catch (error: unknown) {
                console.error('Failed to load product:', error instanceof Error ? error.message : 'Unknown error');

            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const columns = [
        { Header: "Descripcion", accessor: "description" },
        { Header: "Activo", accessor: "is_active" },
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
        <DataTable
            title={"Categorias"}
            columns={columns}
            data={data}
            description="Listado de categorias de los productos"
            useCreateButton={true}
            titleButton={"Agregar Articulo"}
           // handleOnClick={() => navigate(`/employees/new`)}
        />
    )

}