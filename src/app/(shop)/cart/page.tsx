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

// Bank transfer form component
const BankTransferForm = ({
  amount,
  onSubmit,
  isSubmitting
}: {
  amount: number;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}) => {
  const [reference, setReference] = useState('');
  const [date, setDate] = useState(DateTime.now().toFormat('yyyy-LL-dd'));
  const [observations, setObservations] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowed.includes(selected.type)) {
        setError('Solo se permiten imágenes (jpg, jpeg, png).');
        setFile(null);
        setPreviewUrl(null);
        return;
      }
      setError(null);
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference || !date || !file) {
      setError('Por favor, complete todos los campos obligatorios.');
      return;
    }
    setError(null);
    onSubmit({ reference, date, amount, observations, file });
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Form fields */}
        <div className="space-y-4 md:pr-6">
          <div className="flex justify-center">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 px-6 py-4 w-full max-w-xs flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-2 text-[#d64d04]">
                <FaUniversity className="w-6 h-6" />
                <span className="font-bold text-lg">Banco de Centro América BAC</span>
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                <div><span className="font-medium">N° Cuenta:</span> 0101-01-010101-0101</div>
                <div><span className="font-medium">Nombre:</span> Momba Shop</div>
                <div><span className="font-medium">RIF:</span> J0101010100</div>
                <div><span className="font-medium">Correo:</span> mombashop@gmail.com</div>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Referencia <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d64d04]"
              value={reference}
              onChange={e => setReference(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Transacción <span className="text-red-500">*</span></label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d64d04]"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500"
              value={`$${amount.toFixed(2)}`}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
            <textarea
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d64d04]"
              value={observations}
              onChange={e => setObservations(e.target.value)}
              rows={2}
            />
          </div>
        </div>
        {/* Right: Image upload/preview */}
        <div className="flex flex-col h-full justify-center md:pl-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Comprobante <span className="text-red-500">*</span></label>
          <div className="flex flex-col gap-2 h-full">
            {!previewUrl && (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#d64d04] transition">
                <span className="text-gray-400 text-sm mb-2">Haz clic para seleccionar una imagen (jpg, jpeg, png)</span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange}
                  required
                />
              </label>
            )}
            {previewUrl && (
              <div className="relative w-full bg-gray-50 border border-dashed border-[#d64d04] rounded-lg p-4 flex items-center justify-center mt-2 min-h-[300px] max-h-[400px] overflow-auto">
                <img src={previewUrl} alt="Comprobante" className="max-h-[350px] w-auto max-w-full rounded shadow object-contain mx-auto" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1 shadow hover:bg-red-100 text-red-500 border border-red-200"
                  aria-label="Eliminar imagen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <span className="text-xs text-gray-500 mt-4 block">Formatos permitidos: jpg, jpeg, png</span>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <button
          type="submit"
          className="w-full max-w-xs py-2 px-4 bg-[#d64d04] text-white rounded font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2 disabled:opacity-60"
          disabled={isSubmitting}
        >
          <FaFileUpload /> {isSubmitting ? 'Enviando...' : 'Enviar Pago'}
        </button>
      </div>
    </form>
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
        <BankTransferForm
          amount={parseFloat(cart.sub_total) + parseFloat(shippingFee)}
          onSubmit={handleTransferSubmit}
          isSubmitting={isSubmittingTransfer}
        />
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