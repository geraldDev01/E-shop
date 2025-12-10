'use client';

import { useState } from 'react';
import { IoMailOutline, IoLockClosedOutline, IoArrowBackOutline } from 'react-icons/io5';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { requestPasswordReset } from '@/api/auth';

export default function ForgotPasswordPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Email no válido')
        .required('El email es obligatorio'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setApiError(null);
      setSuccess(false);
      try {
        const result = await requestPasswordReset(values.email);
        if (result.success) {
          setSuccess(true);
        } else {
          setApiError(result.error || 'Error al solicitar el restablecimiento de contraseña');
        }
      } catch (error) {
        console.error('Request password reset error:', error);
        setApiError('Error al solicitar el restablecimiento de contraseña');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 overflow-hidden">
      {/* Modern gradient background with decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-orange-300/15 to-orange-100/10"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-orange-200/10 to-orange-400/15"></div>
      
      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-300/5 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md card rounded-2xl shadow-2xl p-8 flex flex-col items-center border-2 border-white/50 bg-white/95 backdrop-blur-sm relative z-10">
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl"></div>
          <IoLockClosedOutline className="w-16 h-16 text-[#d64d04] mx-auto relative z-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">¿Olvidaste tu contraseña?</h1>
        <p className="text-gray-500 mb-6 text-center">
          {success 
            ? 'Revisa tu correo electrónico para restablecer tu contraseña.'
            : 'Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.'
          }
        </p>
        
        {success ? (
          <div className="w-full space-y-5">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-700 font-medium">
                Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.
              </p>
            </div>
            <Link
              href="/auth/login"
              className="w-full flex items-center justify-center gap-2 bg-[#d64d04] text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all"
            >
              <IoArrowBackOutline className="w-5 h-5" />
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <form className="w-full space-y-5" onSubmit={formik.handleSubmit}>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
              <div className="relative">
                <IoMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  {...formik.getFieldProps('email')}
                  className={`w-full pl-10 pr-3 py-3 rounded-lg border-2 bg-white text-gray-900 ${
                    formik.touched.email && formik.errors.email 
                      ? 'border-red-400' 
                      : 'border-gray-200'
                  } focus:border-[#d64d04] focus:ring-2 focus:ring-[#ffd6b3] outline-none transition-all`}
                  placeholder="tu@email.com"
                  autoComplete="email"
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-2 text-sm text-red-500">{formik.errors.email}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#d64d04] text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IoMailOutline className="w-5 h-5" />
              {formik.isSubmitting ? 'Enviando...' : 'Enviar enlace de restablecimiento'}
            </button>
            {apiError && (
              <p className="mt-4 text-center text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">
                {apiError}
              </p>
            )}
          </form>
        )}
        
        <div className="mt-6 text-center text-sm text-gray-500">
          ¿Recordaste tu contraseña?{' '}
          <Link href="/auth/login" className="font-semibold text-[#d64d04] hover:underline">
            Inicia Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}


