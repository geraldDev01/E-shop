'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { IoMailOutline, IoPersonOutline, IoPhonePortraitOutline, IoChatboxOutline, IoCheckmarkCircleOutline, IoHomeOutline } from 'react-icons/io5';
import { sendContactForm } from '@/api/contact';
import Link from 'next/link';

type FormValues = {
  name: string;
  phone: string;
  email: string;
  description: string;
};

export default function ContactPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      description: ''
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('El nombre es obligatorio')
        .min(3, 'Mínimo 3 caracteres'),
      phone: Yup.string()
        .required('El teléfono es obligatorio')
        .min(8, 'Mínimo 8 caracteres'),
      email: Yup.string()
        .email('Email no válido')
        .required('El email es obligatorio'),
      description: Yup.string()
        .required('El mensaje es obligatorio')
        .min(10, 'El mensaje debe tener al menos 10 caracteres')
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setApiError(null);
      try {
        const result = await sendContactForm({
          message: values
        });
        if (result.success) {
          setSuccessMessage(result.message);
          resetForm();
        } else {
          setApiError(result.message);
        }
      } catch {
        setApiError('Error al enviar el mensaje');
      } finally {
        setSubmitting(false);
      }
    }
  });

  const renderField = (
    name: keyof FormValues,
    label: string,
    type: string,
    icon: React.ReactNode,
    isTextarea: boolean = false
  ) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium leading-6">
        {label}
      </label>
      <div className="relative mt-2">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </div>
        {isTextarea ? (
          <textarea
            id={name}
            {...formik.getFieldProps(name)}
            rows={4}
            className={`block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset 
              ${formik.touched[name] && formik.errors[name]
                ? 'ring-red-500 focus:ring-red-500'
                : 'ring-gray-300 focus:ring-primary-950'} 
              focus:ring-2 focus:ring-inset`}
          />
        ) : (
          <input
            id={name}
            type={type}
            {...formik.getFieldProps(name)}
            className={`block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset 
              ${formik.touched[name] && formik.errors[name]
                ? 'ring-red-500 focus:ring-red-500'
                : 'ring-gray-300 focus:ring-primary-950'} 
              focus:ring-2 focus:ring-inset`}
          />
        )}
      </div>
      {formik.touched[name] && formik.errors[name] && (
        <p className="mt-2 text-sm text-red-500">{formik.errors[name]}</p>
      )}
    </div>
  );

  if (successMessage) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="text-center">
          <IoCheckmarkCircleOutline className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            {successMessage}
          </h2>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#d64d04] px-6 py-3 text-white hover:bg-[#b33f03] transition-colors"
          >
            <IoHomeOutline className="h-5 w-5" />
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-center text-2xl font-bold leading-9 tracking-tight text-[#d64d04]">
          Contáctanos
        </h1>
        {apiError && (
          <p className="mt-4 text-center text-sm text-red-500 bg-red-50 p-2 rounded-md">
            {apiError}
          </p>
        )}
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {renderField('name', 'Nombre', 'text', <IoPersonOutline className="text-gray-500" />)}
          {renderField('phone', 'Teléfono', 'tel', <IoPhonePortraitOutline className="text-gray-500" />)}
          {renderField('email', 'Email', 'email', <IoMailOutline className="text-gray-500" />)}
          {renderField('description', 'Mensaje', 'text', <IoChatboxOutline className="text-gray-500" />, true)}

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="btn-primary mt-8 w-full"
          >
            {formik.isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
          </button>
        </form>
      </div>
    </div>
  );
}