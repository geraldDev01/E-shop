'use client'
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/auth/AuthContext';
import { useCart } from '@/context/cart/CartContext';
import { useRouter } from 'next/navigation';
import { getCart, deleteCartItem } from '@/api/cart';
import { IoCartOutline, IoTrashOutline, IoClose, IoWarning } from 'react-icons/io5';
import { getFees } from '@/api/fees';
import { PayPalButton } from '@/components/products/PayPalButton';
import { Popup } from '@/components/ui/Popup';
import { createOrder } from '@/api/orders';
import { FaRegCreditCard, FaPaypal, FaUniversity, FaFileUpload } from 'react-icons/fa';
import { DateTime } from 'luxon';
import BankTransferForm from '@/components/ui/BankTransferForm';
import { getFinancialEntities, FinancialEntity } from '@/api/financialEntities';

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

// Add PayPal types
interface PayPalOrderData {
  orderID: string;
  payerID: string;
  paymentID: string | null;
  billingToken: string | null;
  facilitatorAccessToken: string;
}

interface PayPalError {
  message: string;
  details?: Array<{ issue: string; description: string }>;
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

// Modal component for reuse
const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-white/30 via-white/10 to-gray-100/10 backdrop-blur-lg px-2 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full relative p-8 animate-fade-in-up overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Cerrar"
        >
          <IoClose className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default function CartPage() {
  const { user } = useAuth();
  const { updateCartCount } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<Cart | null>(null);
  const [shippingFee, setShippingFee] = useState<string>('0');
  const [popup, setPopup] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'transfer'>('paypal');
  const [isSubmittingTransfer, setIsSubmittingTransfer] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [entities, setEntities] = useState<FinancialEntity[]>([]);
  const [loadingEntities, setLoadingEntities] = useState(false);

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

  useEffect(() => {
    if (showTransferModal) {
      setLoadingEntities(true);
      getFinancialEntities().then(res => {
        if (res.success) setEntities(res.entities);
        setLoadingEntities(false);
      });
    }
  }, [showTransferModal]);

  const handlePaymentSuccess = async (paypalDetails: PayPalOrderData) => {
    try {
      if (!user?.profile || !cart) return;

      const orderData = {
        customer_id: user.profile.id.toString(),
        detail: cart.detail.map(item => ({
          product_id: item.product_id,
          presentation_id: item.id_presentation,
          unit_price: parseFloat(item.unit_price),
          quantity: parseInt(item.quantity)
        }))
      };

      console.log('PayPal Order ID:', paypalDetails.orderID); // Using paypalDetails
      const result = await createOrder(user.token, orderData);
      if (result.success) {
        setPopup({
          show: true,
          message: 'Pago realizado con éxito',
          type: 'success'
        });
        updateCartCount();
        router.push('/orders/thank-you');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setPopup({
        show: true,
        message: 'Error al procesar la orden',
        type: 'error'
      });
    }
  };

  const handlePaymentError = (error: PayPalError) => {
    console.error('Payment error:', error);
    setPopup({
      show: true,
      message: error.message || 'Error al procesar el pago',
      type: 'error'
    });
  };

  const handleTransferSubmit = async (data: any) => {
    setIsSubmittingTransfer(true);
    try {
      // TODO: Implement API call to submit transfer payment
      // Example: await submitBankTransfer(user.token, data)
      setPopup({
        show: true,
        message: 'Comprobante enviado. Procesaremos tu pago pronto.',
        type: 'success',
      });
      updateCartCount();
      setShowTransferModal(false);
      router.push('/orders/thank-you');
    } catch (error) {
      setPopup({
        show: true,
        message: 'Error al enviar el comprobante',
        type: 'error',
      });
    } finally {
      setIsSubmittingTransfer(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d64d04]"></div>
      </div>
    );
  }

  if (!cart || !cart.detail || cart.detail.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 bg-gradient-to-b from-[#fff7f0] to-white">
        <div className="bg-white rounded-full shadow-lg p-8 mb-6 flex items-center justify-center">
          <IoCartOutline className="w-20 h-20 text-[#d64d04] opacity-80" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">¡Tu carrito está vacío!</h2>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Agrega productos increíbles y disfruta de una experiencia de compra única.
        </p>
        <button
          onClick={() => router.push('/')} 
          className="flex items-center gap-2 bg-[#d64d04] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-orange-600 transition text-lg"
        >
          <IoCartOutline className="w-6 h-6" />
          Explorar Productos
        </button>
      </div>
    );
  }

  return (
    <>
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

          <div className="bg-white rounded-lg shadow-sm p-6 h-fit animate-fade-in">
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
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Elija un método de pago</label>
              <div className="flex gap-2 mb-4">
                <button
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded border transition font-semibold ${paymentMethod === 'paypal' ? 'bg-[#ffe066] border-[#ffe066] text-[#222]' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setPaymentMethod('paypal')}
                  type="button"
                >
                  <FaPaypal className="text-[#003087]" /> PayPal
                </button>
                <button
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded border transition font-semibold ${paymentMethod === 'transfer' ? 'bg-[#d64d04] border-[#d64d04] text-white' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setPaymentMethod('transfer')}
                  type="button"
                >
                  <FaRegCreditCard className="" /> Transferencia
                </button>
              </div>
              {paymentMethod === 'paypal' && (
                <PayPalButton 
                  amount={parseFloat(cart.sub_total) + parseFloat(shippingFee)}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}
              {paymentMethod === 'transfer' && (
                <button
                  className="w-full py-2 px-4 bg-[#d64d04] text-white rounded font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2"
                  onClick={() => setShowTransferModal(true)}
                  type="button"
                >
                  <FaRegCreditCard /> Pagar con Transferencia
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Modal isOpen={showTransferModal} onClose={() => setShowTransferModal(false)}>
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Pago por Transferencia</h2>
        {loadingEntities ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#d64d04]"></div>
          </div>
        ) : (
          <BankTransferForm
            amount={parseFloat(cart.sub_total) + parseFloat(shippingFee)}
            onSubmit={handleTransferSubmit}
            isSubmitting={isSubmittingTransfer}
            entities={entities}
          />
        )}
      </Modal>
      
      <Popup 
        isOpen={popup.show}
        onClose={() => {
          setPopup(prev => ({ ...prev, show: false }));
          if (popup.type === 'success') {
            router.push('/orders/thank-you');
          }
        }}
        message={popup.message}
        type={popup.type}
      />
    </>
  );
}