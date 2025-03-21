'use client'
import React, { useState, useEffect } from "react";
import Link from 'next/link'
import DataTable from "@/components/ui/DataTable/DataTable";
import { getAllOrders } from "@/api/administration";

export default function OrderHistoryPage() {
    const [data, setData] = useState([]);

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await getAllOrders();
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
        { Header: "Numero Orden", accessor: "id" },
        { Header: "Cliente", accessor: "customer_name" },
        { Header: "Direccion", accessor: "delivery_address" },
        { Header: "Telefono", accessor: "contact_phone" },
        { Header: "Estado Orden", accessor: "order_state_description" },
        { Header: "Fecha Creacion", accessor: "order_date" },
        { Header: "Total Envio", accessor: "shipping_fee" },
        { Header: "Total Orden", accessor: "total_invoice" },
        {
            Header: "Acciones",
            accessor: "id",
            customRender: (index, item) => {
                return (

                    <Link
                        key={`/admin/orders/${item.id}`}
                        href={`/admin/orders/${item.id}`}
                        className="block p-4 hover:bg-gray-700"

                    >

                        <span>Ver</span>
                    </Link>
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