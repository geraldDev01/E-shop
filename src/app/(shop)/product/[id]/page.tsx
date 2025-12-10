'use client'
import { useEffect, useState, use } from 'react';
import { notFound } from "next/navigation";
import Link from 'next/link';
import { IoCartOutline, IoArrowBack, IoCheckmarkCircle, IoClose } from "react-icons/io5";
import { getProductById } from '@/api/products';
import type { Product } from '@/api/products';
import { addToCart } from '@/api/cart';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth/AuthContext';
import { useCart } from '@/context/cart/CartContext';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

// Separate client component
function ProductDetailContent({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [showSizeError, setShowSizeError] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { updateCartCount } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productId = parseInt(id);
        if (isNaN(productId)) {
          setNotFoundError(true);
          setIsLoading(false);
          return;
        }

        const result = await getProductById(productId);
        console.log('Product API result:', { success: result.success, hasProduct: !!result.product, message: result.message });
        if (result.success && result.product) {
          setProduct(result.product);
          setNotFoundError(false);
        } else {
          console.error('Product not found or API error:', result.message);
          setNotFoundError(true);
        }
      } catch (error: unknown) {
        console.error('Failed to load product:', error instanceof Error ? error.message : 'Unknown error');
        setNotFoundError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d64d04]"></div>
      </div>
    );
  }

  // Error state - call notFound() during render, not in effect
  // Only call it after loading is complete and we know the product doesn't exist
  if (!isLoading && (notFoundError || !product)) {
    notFound();
  }

  // This should never be reached if notFound() is called, but TypeScript needs it
  if (!product) {
    return null;
  }

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    setShowSizeError(false);
    setQuantity(1); // Reset quantity when size changes
  };

  const getCurrentStock = () => {
    const presentation = product.presentations.find(
      p => p.presentation_description === selectedSize
    );
    return presentation ? parseInt(presentation.quantity) : 0;
  };

  const handleQuantityChange = (value: number) => {
    const maxStock = getCurrentStock();
    setQuantity(Math.max(1, Math.min(value, maxStock)));
  };

  const getAvailableSizes = () => {
    return product.presentations
      .filter(p => parseInt(p.quantity) > 0)
      .map(p => ({
        size: p.presentation_description,
        stock: parseInt(p.quantity)
      }));
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }

    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const selectedPresentation = product.presentations.find(
      p => p.presentation_description === selectedSize
    );

    if (!selectedPresentation) return;

    try {
      const cartData = {
        product_id: product.id,
        presentation_id: selectedPresentation.presentation_id,
        quantity: quantity
      };

      const result = await addToCart(user!.token, cartData);

      if (result.success) {
        // Reset form
        setSelectedSize("");
        setQuantity(1);
        setShowSizeError(false);
        // Update cart count
        await updateCartCount();
        // Show success modal
        setShowSuccessModal(true);
      } else {
        console.error('Failed to add product to cart:', result.message);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const SuccessModal = () => {
    if (!showSuccessModal) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
        <div className="card rounded-2xl p-8 max-w-md w-full relative animate-fade-in-up shadow-2xl border-2 border-green-200">
          <button 
            onClick={() => setShowSuccessModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoClose className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
              <IoCheckmarkCircle className="w-20 h-20 text-green-500 relative z-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              ¡Producto Agregado!
            </h3>
            <p className="text-gray-600 mb-8">
              El producto ha sido agregado exitosamente a tu carrito
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
              >
                Seguir Comprando
              </button>
              <button
                onClick={() => router.push('/cart')}
                className="flex-1 py-3 px-4 bg-[#d64d04] text-white rounded-lg hover:bg-[#b54403] transition-colors font-semibold shadow-lg"
              >
                Ver Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link 
        href="/"
        className="inline-flex items-center text-gray-600 hover:text-[#d64d04] mb-8 transition-colors font-medium"
      >
        <IoArrowBack className="mr-2" />
        Volver a productos
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden card shadow-xl">
          <ImageWithFallback
            src={product.img_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 mb-3">
              {product.clasification}
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-[#d64d04]">
              ${parseFloat(product.price).toFixed(2)}
            </p>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Tallas Disponibles</h3>
            <div className="flex flex-wrap gap-3">
              {product.presentations.map((presentation) => (
                <button
                  key={presentation.presentation_id}
                  onClick={() => handleSizeChange(presentation.presentation_description)}
                  disabled={parseInt(presentation.quantity) === 0}
                  className={`
                    w-16 h-16 rounded-xl border-2 flex items-center justify-center font-semibold
                    transition-all duration-200
                    ${parseInt(presentation.quantity) === 0 
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      : selectedSize === presentation.presentation_description
                        ? 'border-[#d64d04] bg-[#d64d04] text-white shadow-lg scale-105'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-[#d64d04] hover:scale-105'
                    }
                  `}
                >
                  {presentation.presentation_description}
                </button>
              ))}
            </div>
            {showSizeError && (
              <p className="text-red-500 text-sm mt-3 font-medium">
                * Por favor seleccione una talla
              </p>
            )}
          </div>

          {/* Quantity */}
          {selectedSize && (
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Cantidad</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-12 h-12 rounded-xl border-2 border-gray-300 bg-white flex items-center justify-center font-bold text-lg
                    hover:border-[#d64d04] hover:bg-orange-50
                    disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
                >
                  -
                </button>
                <span className="w-16 text-center font-bold text-xl text-gray-900">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= getCurrentStock()}
                  className="w-12 h-12 rounded-xl border-2 border-gray-300 bg-white flex items-center justify-center font-bold text-lg
                    hover:border-[#d64d04] hover:bg-orange-50
                    disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize || getCurrentStock() === 0}
            className="btn-primary mb-2 w-full flex items-center justify-center gap-2 text-lg py-4
              disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <IoCartOutline size={24} />
            {getAvailableSizes().length > 0 ? 'Agregar al Carrito' : 'No Disponible'}
          </button>


          {/* Description */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">Descripción</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>
      <SuccessModal />
    </div>
  );
}

// Main page component
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <ProductDetailContent id={resolvedParams.id} />;
} 