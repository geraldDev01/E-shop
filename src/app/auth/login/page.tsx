'use client';

import { useState } from 'react';
import { IoMailOutline, IoKeyOutline, IoLogInOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { login } from '@/api/auth';
import { useAuth } from '@/context/auth/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Email no válido')
        .required('El email es obligatorio'),
      password: Yup.string()
        .min(6, 'Mínimo 6 caracteres')
        .required('La contraseña es obligatoria'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setApiError(null);
      try {
        const result = await login(values);
        if (result.success && result.token) {
          authLogin(result.token);
          router.push('/');
        } else {
          setApiError(result.error || 'Error en la autenticación');
        }
      } catch (error) {
        console.error('Login error:', error);
        setApiError('Error en la autenticación');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff7f0] via-white to-orange-50 px-4 transition-colors duration-300">
      <div className="w-full max-w-md card rounded-2xl shadow-2xl p-8 flex flex-col items-center border-2 border-gray-200">
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl"></div>
          <IoLogInOutline className="w-16 h-16 text-[#d64d04] mx-auto relative z-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">¡Bienvenido de nuevo!</h1>
        <p className="text-gray-500 mb-6 text-center">Inicia sesión para continuar con tus compras.</p>
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
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Contraseña</label>
            <div className="relative">
              <IoKeyOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...formik.getFieldProps('password')}
                className={`w-full pl-10 pr-10 py-3 rounded-lg border-2 bg-white text-gray-900 ${
                  formik.touched.password && formik.errors.password 
                    ? 'border-red-400' 
                    : 'border-gray-200'
                } focus:border-[#d64d04] focus:ring-2 focus:ring-[#ffd6b3] outline-none transition-all`}
                placeholder="Tu contraseña"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="mt-2 text-sm text-red-500">{formik.errors.password}</p>
            )}
            <div className="text-right mt-1">
              <Link href="/auth/forgot" className="text-xs text-[#d64d04] hover:underline">¿Olvidaste tu contraseña?</Link>
            </div>
          </div>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-[#d64d04] text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoLogInOutline className="w-5 h-5" />
            {formik.isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
          {apiError && (
            <p className="mt-4 text-center text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">
              {apiError}
            </p>
          )}
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{' '}
          <Link href="/auth/register" className="font-semibold text-[#d64d04] hover:underline">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}
