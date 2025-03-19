'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoMailOutline, IoKeyOutline, IoLogInOutline } from 'react-icons/io5';
import { login } from '@/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  
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
          localStorage.setItem('token', result.token);
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
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-center text-2xl font-bold leading-9 tracking-tight text-[#d64d04]">
          Iniciar Sesión
        </h1>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form 
          onSubmit={formik.handleSubmit}
          className="space-y-6"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6">
              Email
            </label>
            <div className="relative mt-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <IoMailOutline className="text-gray-500" />
              </div>
              <input
                id="email"
                type="email"
                {...formik.getFieldProps('email')}
                className={`block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset 
                  ${formik.touched.email && formik.errors.email 
                    ? 'ring-red-500 focus:ring-red-500' 
                    : 'ring-gray-300 focus:ring-primary-950'} 
                  focus:ring-2 focus:ring-inset`}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="mt-2 text-sm text-red-500">{formik.errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6">
              Contraseña
            </label>
            <div className="relative mt-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <IoKeyOutline className="text-gray-500" />
              </div>
              <input
                id="password"
                type="password"
                {...formik.getFieldProps('password')}
                className={`block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset 
                  ${formik.touched.password && formik.errors.password 
                    ? 'ring-red-500 focus:ring-red-500' 
                    : 'ring-gray-300 focus:ring-primary-950'} 
                  focus:ring-2 focus:ring-inset`}
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="mt-2 text-sm text-red-500">{formik.errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="btn-primary mt-8"
          >
            <IoLogInOutline size={20} />
            {formik.isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
          {apiError && (
          <p className="mt-4 text-center text-sm text-red-500 bg-red-50 p-2 rounded-md">
            {apiError}
          </p>
        )}
        </form>

        {/* Links */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <div className="mt-2">
            ¿No tienes cuenta?{' '}
            <Link 
              href="/auth/register" 
              className="font-semibold text-primary-950 hover:text-primary-800"
            >
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
