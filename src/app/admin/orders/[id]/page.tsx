"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getOrderById } from "@/api/administration";

export default function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const result = await getOrderById(id);
                if (result.success && result.data.data) {
                    setOrder(result.data.data);
                }

            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    if (loading) return <p className="text-center py-10">Cargando...</p>;
    if (!order) return <p className="text-center py-10">Orden no encontrada</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <div className="space-x-2">
                {order.order_state_id === "PENDING" && (
                    <button className="bg-yellow-500 hover:bg-yellow-600">
                        Marcar En Tránsito
                    </button>
                )}
                {order.order_state_id === "SHIPPED" && (
                    <button className="bg-green-500 hover:bg-green-600">
                        Marcar Entregado
                    </button>
                )}
            </div>
            <h1 className="text-xl font-bold">Detalle de Orden #{order.id}</h1>
            <p className="text-gray-600">Estado: {order.order_state_description}</p>
            <p className="text-gray-600">Cliente: {order.customer_name}</p>
            <p className="text-gray-600">Dirección: {order.delivery_address}</p>
            <p className="text-gray-600">Teléfono: {order.contact_phone}</p>


            <h2 className="mt-6 text-lg font-semibold">Detalle Facturacion</h2>
            <p className="text-gray-600">Total Envio: ${order.shipping_fee}</p>
            <p className="text-gray-600">Total: ${order.total_invoice}</p>

            <h2 className="mt-6 text-lg font-semibold">Informacion de Seguimiento</h2>
            <p className="text-gray-600">Fecha Hora Creacion: {order.order_date ?? "-"}</p>
            <p className="text-gray-600">Fecha Hora Puesta En Transito: {order.shipping_date ?? "-"}</p>
            <p className="text-gray-600">Fecha Hora Entrega: {order.delivery_date ?? "-"}</p>

            <h2 className="mt-6 text-lg font-semibold">Artículos</h2>
            <table className="w-full mt-4 border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">SKU</th>
                        <th className="border p-2">Producto</th>
                        <th className="border p-2">Cantidad</th>
                        <th className="border p-2">Precio</th>
                        <th className="border p-2">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {order.details.map((item) => (
                        <tr key={item.id} className="text-center">
                            <td className="border p-2">{item.sku}</td>
                            <td className="border p-2">{item.article_description}</td>
                            <td className="border p-2">{item.quantity}</td>
                            <td className="border p-2">${item.unit_price}</td>
                            <td className="border p-2">${item.subtotal}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
