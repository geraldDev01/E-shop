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
import { FaRegCreditCard, FaPaypal } from 'react-icons/fa';
import BankTransferForm from '@/components/ui/BankTransferForm';
import { getFinancialEntities, FinancialEntity } from '@/api/financialEntities';
import { BankTransferFormValues } from '@/components/ui/BankTransferForm';

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="card rounded-2xl p-8 max-w-md w-full relative animate-fade-in-up shadow-2xl border-2 border-yellow-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <IoClose className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl"></div>
            <IoWarning className="w-20 h-20 text-yellow-500 relative z-10" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Confirmar Eliminación
          </h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            ¿Estás seguro que deseas eliminar &ldquo;{productName}&rdquo; de tu carrito?
          </p>
          <div className="flex gap-4 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold shadow-lg"
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
      <div className="card rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-orange-200">
        <div className="flex items-start gap-4">
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{item.product_description}</h3>
                <p className="text-sm text-gray-500 mt-1">Talla: {item.presentation_description}</p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                title="Eliminar producto"
              >
                <IoTrashOutline className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-between items-end pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Cantidad:</span>
                <span className="font-semibold text-gray-900">{parseInt(item.quantity)}</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl text-[#d64d04]">${parseFloat(item.sub_total).toFixed(2)}</p>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-2 animate-fade-in">
      <div className="card rounded-2xl shadow-2xl max-w-3xl w-full relative p-8 animate-fade-in-up overflow-y-auto max-h-[90vh] border-2 border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
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

      // Calculate total amount
      const totalAmount = parseFloat(cart.sub_total) + parseFloat(shippingFee);
      
      // Generate random short reference number (4 digits, e.g., "0022")
      const randomReference = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      
      // Build PayPal payment data
      const paypalPaymentData = {
        payment_method: "PAYPAL" as const,
        reference_number: randomReference,
        financial_entity: "",
        account_reference: paypalDetails.orderID || paypalDetails.paymentID || "123123123",
        currency: "USD",
        amount: totalAmount.toFixed(2)
      };

      console.log('PayPal Order ID:', paypalDetails.orderID);
      const result = await createOrder(user.token, orderData, undefined, undefined, paypalPaymentData);
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

  const handleTransferSubmit = async (data: BankTransferFormValues & { amount: number }) => {
    if (!user?.profile || !cart || !data.file) {
      setPopup({
        show: true,
        message: 'Por favor, completa todos los campos requeridos',
        type: 'error',
      });
      return;
    }

    setIsSubmittingTransfer(true);
    try {
      // Build order data
      const orderData = {
        customer_id: user.profile.id.toString(),
        detail: cart.detail.map(item => ({
          product_id: item.product_id,
          presentation_id: item.id_presentation,
          unit_price: parseFloat(item.unit_price),
          quantity: parseInt(item.quantity)
        }))
      };

      // Find the selected entity to get account_reference and currency
      // Compare as strings to handle both string and number types (form values are always strings)
      const selectedEntity = entities.find(e => 
        String(e.financial_id) === String(data.entity)
      );
      if (!selectedEntity) {
        throw new Error('Entidad financiera no encontrada');
      }

      // Build transfer data
      const transferData = {
        entity: data.entity,
        reference: data.reference,
        date: data.date,
        observations: data.observations || undefined,
        account_reference: selectedEntity.account_reference_number,
        currency: selectedEntity.currency,
        amount: data.amount
      };

      // Call createOrder with transfer data and image file
      const result = await createOrder(user.token, orderData, transferData, data.file);
      
      if (result.success) {
        setPopup({
          show: true,
          message: 'Comprobante enviado. Procesaremos tu pago pronto.',
          type: 'success',
        });
        updateCartCount();
        setShowTransferModal(false);
        router.push('/orders/thank-you');
      } else {
        throw new Error(result.message || 'Error al enviar el comprobante');
      }
    } catch (error) {
      console.error('Error submitting transfer:', error);
      setPopup({
        show: true,
        message: (error as Error).message || 'Error al enviar el comprobante',
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
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-full shadow-xl p-10 mb-6 flex items-center justify-center">
          <IoCartOutline className="w-24 h-24 text-[#d64d04]" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3 text-center">¡Tu carrito está vacío!</h2>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
          Agrega productos increíbles y disfruta de una experiencia de compra única.
        </p>
        <button
          onClick={() => router.push('/')} 
          className="flex items-center gap-2 bg-[#d64d04] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-orange-600 hover:shadow-xl hover:scale-105 transition-all text-lg"
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
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10">Mi Carrito</h1>
        
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

          <div className="card rounded-2xl shadow-xl p-6 h-fit animate-fade-in border-2 border-orange-200">
            <h3 className="font-bold text-xl text-gray-900 mb-6">Resumen de la Orden</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({parseInt(cart.total_items)} items)</span>
                <span className="font-semibold">${parseFloat(cart.sub_total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="font-semibold">${parseFloat(shippingFee).toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-gray-200 pt-3 mt-3">
                <div className="flex justify-between font-bold text-xl text-gray-900">
                  <span>Total</span>
                  <span className="text-[#d64d04]">${(parseFloat(cart.sub_total) + parseFloat(shippingFee)).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Elija un método de pago</label>
              <div className="flex gap-3 mb-4">
                <button
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all font-semibold ${paymentMethod === 'paypal' ? 'bg-[#ffe066] border-[#ffe066] text-[#222] shadow-lg scale-105' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setPaymentMethod('paypal')}
                  type="button"
                >
                  <FaPaypal className="text-[#003087]" /> PayPal
                </button>
                <button
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all font-semibold ${paymentMethod === 'transfer' ? 'bg-[#d64d04] border-[#d64d04] text-white shadow-lg scale-105' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setPaymentMethod('transfer')}
                  type="button"
                >
                  <FaRegCreditCard /> Transferencia
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
                  className="w-full py-3 px-4 bg-[#d64d04] text-white rounded-xl font-semibold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pago por Transferencia</h2>
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