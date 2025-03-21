'use client'
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/auth/AuthContext';
import { useCart } from '@/context/cart/CartContext';
import { useRouter } from 'next/navigation';
import { getCart, deleteCartItem } from '@/api/cart';
import { IoCartOutline, IoTrashOutline, IoClose, IoWarning } from 'react-icons/io5';
import { getFees } from '@/api/fees';

// Add interfaces for type safety
interface CartItem {
  id: number;
  id_presentation: number;
  presentation_description: string;
  product_id: number;
  product_description: string;
  unit_price: string;
  quantity: string;
  sub_total: string;
}

interface Cart {
  id: number;
  total_items: string;
  sub_total: string;
  created_at: string;
  detail: CartItem[];
}

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  productName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  productName: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full relative animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <IoClose className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 text-yellow-500">
            <IoWarning className="w-16 h-16" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Confirmar Eliminación
          </h3>
          <p className="text-gray-600 mb-6">
            ¿Estás seguro que deseas eliminar &ldquo;{productName}&rdquo; de tu carrito?
          </p>
          <div className="flex gap-4 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartItemComponent = ({ item, onDelete }: { item: CartItem; onDelete: (id: number) => void }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-800">{item.product_description}</h3>
                <p className="text-sm text-gray-500">Talla: {item.presentation_description}</p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Eliminar producto"
              >
                <IoTrashOutline className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-2 flex justify-between items-end">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Cantidad:</span>
                <span className="font-medium">{parseInt(item.quantity)}</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-[#d64d04]">${parseFloat(item.sub_total).toFixed(2)}</p>
                <p className="text-sm text-gray-500">${parseFloat(item.unit_price).toFixed(2)} c/u</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDelete(item.id);
          setShowDeleteModal(false);
        }}
        productName={item.product_description}
      />
    </>
  );
};

export default function CartPage() {
  const { user } = useAuth();
  const { updateCartCount } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<Cart | null>(null);
  const [shippingFee, setShippingFee] = useState<string>('0');

  const loadCart = useCallback(async () => {
    if (!user) return;
    
    try {
      const result = await getCart(user.token);
      if (result.success && result.data) {
        setCart(result.data);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const loadShippingFee = useCallback(async () => {
    if (!user?.token || !user?.profile?.department_id || !user?.profile?.municipality_id) return;
    
    const result = await getFees(
      user.token,
      user.profile.department_id,
      user.profile.municipality_id
    );
    
    if (result.success) {
      setShippingFee(result.fee);
    }
  }, [user?.token, user?.profile?.department_id, user?.profile?.municipality_id]);

  useEffect(() => {
    if (user === null) {
      router.replace('/auth/login');
      return;
    }
    loadCart();
    loadShippingFee();
  }, [user, router, loadCart, loadShippingFee]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d64d04]"></div>
      </div>
    );
  }

  if (!cart || !cart.detail || cart.detail.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <IoCartOutline className="w-24 h-24 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-600 mb-6 text-center">
          ¡Agrega algunos productos increíbles para comenzar tu compra!
        </p>
        <button
          onClick={() => router.push('/')}
          className="btn-primary"
        >
          Explorar Productos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Mi Carrito</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.detail.map((item) => (
            <CartItemComponent 
              key={item.id} 
              item={item} 
              onDelete={async (id) => {
                if (!user) return;
                try {
                  const result = await deleteCartItem(user.token, id);
                  if (result.success) {
                    await loadCart();
                    updateCartCount();
                  }
                } catch (error) {
                  console.error('Error deleting item:', error);
                }
              }}
            />
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
          <h3 className="font-bold text-gray-800 mb-4">Resumen de la Orden</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({parseInt(cart.total_items)} items)</span>
              <span>${parseFloat(cart.sub_total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Envío</span>
              <span>${parseFloat(shippingFee).toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span>${(parseFloat(cart.sub_total) + parseFloat(shippingFee)).toFixed(2)}</span>
              </div>
            </div>
          </div>
          <button className="btn-primary w-full">
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  );
}