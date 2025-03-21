'use client'
import { IoCheckmarkCircle, IoTimeOutline, IoPersonOutline } from 'react-icons/io5';
import Link from 'next/link';

export default function ThankYouPage() {

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <IoCheckmarkCircle className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          ¡Gracias por tu compra!
        </h1>
        <p className="text-gray-600">
          Tu pedido ha sido procesado exitosamente.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Resumen de la Orden
        </h2>
        <div className="space-y-4">
          <div className="flex items-center text-gray-600">
            <IoTimeOutline className="w-5 h-5 mr-2" />
            <span>Estado del pedido: </span>
            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              En proceso
            </span>
          </div>
          {/* Add more order details here if needed */}
        </div>
      </div>

      <div className="space-y-4">
        <Link 
          href="/profile"
          className="flex items-center justify-center gap-2 w-full bg-[#d64d04] text-white py-3 px-4 rounded-md hover:bg-[#b33d03] transition-colors"
        >
          <IoPersonOutline className="w-5 h-5" />
          Ver mis pedidos en el perfil
        </Link>
        
        <Link 
          href="/"
          className="flex items-center justify-center gap-2 w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors"
        >
          Continuar comprando
        </Link>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>¿Tienes alguna pregunta sobre tu pedido?</p>
        <p>Contáctanos a través de nuestro servicio al cliente</p>
      </div>
    </div>
  );
} 