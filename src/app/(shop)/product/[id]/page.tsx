'use client'
import { useEffect, useState, use } from 'react';
import { notFound } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';
import { IoCartOutline, IoArrowBack, IoCheckmarkCircle, IoClose } from "react-icons/io5";
import { getProductById } from '@/api/products';
import type { Product } from '@/api/products';
import { addToCart } from '@/api/cart';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth/AuthContext';
import { useCart } from '@/context/cart/CartContext';

// Separate client component
function ProductDetailContent({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
          notFound();
          return;
        }

        const result = await getProductById(productId);
        if (result.success && result.product) {
          setProduct(result.product);
        } else {
          notFound();
        }
      } catch (error: unknown) {
        console.error('Failed to load product:', error instanceof Error ? error.message : 'Unknown error');
        notFound();
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

  // Error state
  if (!product) {
    return notFound();
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full relative animate-fade-in">
          <button 
            onClick={() => setShowSuccessModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <IoClose className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              <IoCheckmarkCircle className="w-16 h-16 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              ¡Producto Agregado!
            </h3>
            <p className="text-gray-600 mb-6">
              El producto ha sido agregado exitosamente a tu carrito
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Seguir Comprando
              </button>
              <button
                onClick={() => router.push('/cart')}
                className="flex-1 py-2 px-4 bg-[#d64d04] text-white rounded-md hover:bg-[#b54403] transition-colors"
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
        className="inline-flex items-center text-gray-600 hover:text-[#d64d04] mb-6 transition-colors"
      >
        <IoArrowBack className="mr-2" />
        Volver a productos
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm">
          <Image
            src={product.img_url}
            alt={product.name}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <span className="text-sm text-gray-500">{product.clasification}</span>
            <h1 className="text-3xl font-bold text-gray-800 mt-1">{product.name}</h1>
            <p className="text-2xl font-bold text-[#d64d04] mt-2">
              ${parseFloat(product.price).toFixed(2)}
            </p>
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-4">Tallas Disponibles</h3>
            <div className="flex flex-wrap gap-2">
              {product.presentations.map((presentation) => (
                <button
                  key={presentation.presentation_id}
                  onClick={() => handleSizeChange(presentation.presentation_description)}
                  disabled={parseInt(presentation.quantity) === 0}
                  className={`
                    w-14 h-14 rounded-full border-2 flex items-center justify-center
                    transition-all
                    ${parseInt(presentation.quantity) === 0 
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      : selectedSize === presentation.presentation_description
                        ? 'border-[#d64d04] bg-[#d64d04] text-white'
                        : 'border-gray-300 hover:border-[#d64d04]'
                    }
                  `}
                >
                  {presentation.presentation_description}
                </button>
              ))}
            </div>
            {showSizeError && (
              <p className="text-red-500 text-sm mt-2">
                * Por favor seleccione una talla
              </p>
            )}
          </div>

          {/* Quantity */}
          {selectedSize && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-4">Cantidad</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center
                    hover:border-[#d64d04] disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= getCurrentStock()}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center
                    hover:border-[#d64d04] disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
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
            className="btn-primary mb-5 w-full flex items-center justify-center gap-2 
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoCartOutline size={20} />
            {getAvailableSizes().length > 0 ? 'Agregar al Carrito' : 'No Disponible'}
          </button>

          {/* Stock Status */}
          <div className="flex items-center mt-2 mb-6">
            <IoCheckmarkCircle 
              className={`mr-2 text-xl ${
                getAvailableSizes().length > 0 ? 'text-green-500' : 'text-red-500'
              }`} 
            />
            <span className="text-sm">
              {selectedSize 
                ? `${getCurrentStock()} unidades disponibles en talla ${selectedSize}`
                : getAvailableSizes().length > 0
                  ? 'Seleccione una talla'
                  : 'Producto agotado'
              }
            </span>
          </div>

          {/* Description */}
          <div className="border-t pt-6">
            <h3 className="font-bold text-gray-800 mb-2">Descripción</h3>
            <p className="text-gray-600">{product.description}</p>
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