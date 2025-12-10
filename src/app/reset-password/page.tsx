'use client';

import { useState, useEffect } from 'react';
import { IoKeyOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '@/api/auth';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setApiError('Token de restablecimiento no válido o faltante');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const formik = useFormik({
    initialValues: {
      password: '',
      password_confirmation: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, 'Mínimo 8 caracteres')
        .matches(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .matches(/[a-z]/, 'Debe contener al menos una minúscula')
        .matches(/[0-9]/, 'Debe contener al menos un número')
        .matches(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial')
        .required('La contraseña es obligatoria'),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
        .required('Confirma tu contraseña'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      if (!token) {
        setApiError('Token de restablecimiento no válido');
        setSubmitting(false);
        return;
      }

      setApiError(null);
      try {
        const result = await resetPassword(token, values.password);
        if (result.success) {
          setSuccess(true);
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/auth/login');
          }, 3000);
        } else {
          setApiError(result.error || 'Error al restablecer la contraseña');
        }
      } catch (error) {
        console.error('Reset password error:', error);
        setApiError('Error al restablecer la contraseña');
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (success) {
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
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
            <IoCheckmarkCircleOutline className="w-16 h-16 text-green-500 mx-auto relative z-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">¡Contraseña restablecida!</h1>
          <p className="text-gray-500 mb-6 text-center">
            Tu contraseña ha sido restablecida exitosamente. Serás redirigido al inicio de sesión en unos segundos.
          </p>
          <Link
            href="/auth/login"
            className="w-full flex items-center justify-center gap-2 bg-[#d64d04] text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all"
          >
            Ir al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

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
          <IoKeyOutline className="w-16 h-16 text-[#d64d04] mx-auto relative z-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Restablecer Contraseña</h1>
        <p className="text-gray-500 mb-6 text-center">Ingresa tu nueva contraseña</p>
        
        {!token ? (
          <div className="w-full space-y-5">
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-700 font-medium">
                Token de restablecimiento no válido o faltante. Por favor, solicita un nuevo enlace.
              </p>
            </div>
            <Link
              href="/auth/forgot"
              className="w-full flex items-center justify-center gap-2 bg-[#d64d04] text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all"
            >
              Solicitar nuevo enlace
            </Link>
          </div>
        ) : (
          <form className="w-full space-y-5" onSubmit={formik.handleSubmit}>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Nueva Contraseña</label>
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
                  placeholder="Tu nueva contraseña"
                  autoComplete="new-password"
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
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Confirmar Contraseña</label>
              <div className="relative">
                <IoLockClosedOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPasswordConfirm ? 'text' : 'password'}
                  {...formik.getFieldProps('password_confirmation')}
                  className={`w-full pl-10 pr-10 py-3 rounded-lg border-2 bg-white text-gray-900 ${
                    formik.touched.password_confirmation && formik.errors.password_confirmation 
                      ? 'border-red-400' 
                      : 'border-gray-200'
                  } focus:border-[#d64d04] focus:ring-2 focus:ring-[#ffd6b3] outline-none transition-all`}
                  placeholder="Confirma tu nueva contraseña"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPasswordConfirm((v) => !v)}
                  tabIndex={-1}
                >
                  {showPasswordConfirm ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </button>
              </div>
              {formik.touched.password_confirmation && formik.errors.password_confirmation && (
                <p className="mt-2 text-sm text-red-500">{formik.errors.password_confirmation}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={formik.isSubmitting || !token}
              className="w-full flex items-center justify-center gap-2 bg-[#d64d04] text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IoLockClosedOutline className="w-5 h-5" />
              {formik.isSubmitting ? 'Restableciendo...' : 'Restablecer Contraseña'}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff7f0] via-white to-orange-50 px-4">
        <div className="w-full max-w-md card rounded-2xl shadow-2xl p-8 flex flex-col items-center border-2 border-white/50 bg-white/95 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d64d04]"></div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
