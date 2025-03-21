'use client'
import React, { useState, useEffect } from "react";
import DataTable from "@/components/ui/DataTable/DataTable";
import InputField from "@/components/ui/InputField";

import { addProduct, getAllProducts } from "@/api/inventory";

const INITIAL_PRODUCT_DATA = {
    sku: '',
    image: null,
    name: '',
    description: '',
    price: 0,
    cost: 0
}

export default function InventoryPage() {
    const [data, setData] = useState([]);
    const [productData, setProductData] = useState(INITIAL_PRODUCT_DATA)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await getAllProducts();
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
        { Header: "Codigo", accessor: "sku" },
        { Header: "Nombre", accessor: "name" },
        { Header: "Descripcion", accessor: "description" },
        { Header: "Categoria", accessor: "clasification" },
        { Header: "Precio", accessor: "price" },
        { Header: "Costo", accessor: "cost" },
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


    const handleChange = (e) => {
        const { name, value } = e.target;

        setProductData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("sku", productData.sku);
            formData.append("name", productData.name);
            formData.append("description", productData.description);
            formData.append("price", productData.price);
            formData.append("cost", productData.cost);
            formData.append("imagen", productData.image); // Aquí se adjunta la imagen

            await addProduct(formData);
        } catch (err) {
            //   setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="SKU"
                        type="text"
                        name="sku"
                        id="ruc"
                        placeholder="Ej: ART0101"
                        required={true}
                        value={productData.sku}
                        onChange={handleChange}
                    />

                    <InputField
                        label="Nombre"
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Ej: Camisa"
                        required={true}
                        value={productData.name}
                        onChange={handleChange}
                    />


                    <InputField
                        label="Imagen"
                        type="file"
                        name="sku"
                        id="ruc"
                        placeholder="Ej: ART0101"
                        required={true}
                        value={productData.image}
                        onChange={handleChange}
                    />

                    <button type="submit">Enviar</button>

                </form>
            </div>
            <DataTable
                title={"Inventario"}
                columns={columns}
                data={data}
                description="Listado de productos"
                useCreateButton={true}
                titleButton={"Agregar Articulo"}
            // handleOnClick={() => navigate(`/employees/new`)}
            />
        </div>

    )

}