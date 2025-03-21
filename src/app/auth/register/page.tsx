'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { IoMailOutline, IoKeyOutline, IoPersonOutline, IoPhonePortraitOutline, IoLocationOutline } from 'react-icons/io5';
import { register } from '@/api/auth';
import { useAuth } from '@/context/auth/AuthContext';
import { getDepartments, getMunicipalities } from '@/api/locations';

type FormValues = {
  full_name: string;
  phone: string;
  address: string;
  email: string;
  password: string;
  password_confirmation: string;
  id_department: string;
  id_municipality: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Array<{ id: number; description: string }>>([]);
  const [municipalities, setMunicipalities] = useState<Array<{ id: number; description: string }>>([]);
  
  useEffect(() => {
    const loadDepartments = async () => {
      const result = await getDepartments();
      if (result.success) {
        setDepartments(result.departments);
      }
    };
    loadDepartments();
  }, []);

  const handleDepartmentChange = async (departmentId: string) => {
    formik.setFieldValue('id_department', departmentId);
    formik.setFieldValue('id_municipality', '');
    
    if (departmentId) {
      const result = await getMunicipalities(Number(departmentId));
      if (result.success) {
        setMunicipalities(result.municipalities);
      } else {
        setMunicipalities([]);
      }
    } else {
      setMunicipalities([]);
    }
  };

  const formik = useFormik({
    initialValues: {
      full_name: '',
      phone: '',
      address: '',
      email: '',
      password: '',
      password_confirmation: '',
      id_department: '',
      id_municipality: '',
    },
    validationSchema: Yup.object({
      full_name: Yup.string()
        .required('El nombre es obligatorio')
        .min(3, 'Mínimo 3 caracteres'),
      phone: Yup.string()
        .required('El teléfono es obligatorio')
        .min(8, 'Mínimo 8 caracteres'),
      address: Yup.string()
        .required('La dirección es obligatoria')
        .min(5, 'Mínimo 5 caracteres'),
      email: Yup.string()
        .email('Email no válido')
        .required('El email es obligatorio'),
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
      id_department: Yup.string()
        .required('El departamento es obligatorio'),
      id_municipality: Yup.string()
        .required('El municipio es obligatorio'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setApiError(null);
      try {
        const result = await register({
          ...values,
          id_department: values.id_department ? Number(values.id_department) : null,
          id_municipality: values.id_municipality ? Number(values.id_municipality) : null,
        });
        
        if (result.success && result.token) {
          authLogin(result.token);
          router.push('/');
        } else {
          setApiError(result.error || 'Error en el registro');
        }
      } catch (error) {
        console.error('Register error:', error);
        setApiError('Error en el registro');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const renderField = (
    name: keyof FormValues,
    label: string,
    type: string,
    icon: React.ReactNode
  ) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium leading-6">
        {label}
      </label>
      <div className="relative mt-2">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </div>
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
      </div>
      {formik.touched[name] && formik.errors[name] && (
        <p className="mt-2 text-sm text-red-500">{formik.errors[name]}</p>
      )}
    </div>
  );

  const renderSelectField = (
    name: 'id_department' | 'id_municipality',
    label: string,
    options: Array<{ id: number; description: string }>,
    icon: React.ReactNode,
    onChange?: (value: string) => void
  ) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium leading-6">
        {label}
      </label>
      <div className="relative mt-2">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </div>
        <select
          id={name}
          {...formik.getFieldProps(name)}
          onChange={(e) => {
            if (onChange) {
              onChange(e.target.value);
            } else {
              formik.handleChange(e);
            }
          }}
          className={`block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset 
            ${formik.touched[name] && formik.errors[name]
              ? 'ring-red-500 focus:ring-red-500' 
              : 'ring-gray-300 focus:ring-primary-950'} 
            focus:ring-2 focus:ring-inset`}
        >
          <option value="">Seleccionar</option>
          {options.map(option => (
            <option key={option.id} value={option.id}>
              {option.description}
            </option>
          ))}
        </select>
      </div>
      {formik.touched[name] && formik.errors[name] && (
        <p className="mt-2 text-sm text-red-500">{formik.errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-center text-2xl font-bold leading-9 tracking-tight text-[#d64d04]">
          Crear Cuenta
        </h1>
        {apiError && (
          <p className="mt-4 text-center text-sm text-red-500 bg-red-50 p-2 rounded-md">
            {apiError}
          </p>
        )}
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-2xl">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField('full_name', 'Nombre Completo', 'text', <IoPersonOutline className="text-gray-500" />)}
            {renderField('phone', 'Teléfono', 'tel', <IoPhonePortraitOutline className="text-gray-500" />)}
            {renderField('email', 'Email', 'email', <IoMailOutline className="text-gray-500" />)}
            {renderField('address', 'Dirección', 'text', <IoLocationOutline className="text-gray-500" />)}
            {renderField('password', 'Contraseña', 'password', <IoKeyOutline className="text-gray-500" />)}
            {renderField('password_confirmation', 'Confirmar Contraseña', 'password', <IoKeyOutline className="text-gray-500" />)}
            {renderSelectField(
              'id_department',
              'Departamento',
              departments,
              <IoLocationOutline className="text-gray-500" />,
              handleDepartmentChange
            )}
            {renderSelectField(
              'id_municipality',
              'Municipio',
              municipalities,
              <IoLocationOutline className="text-gray-500" />
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="btn-primary mt-8 w-full md:w-auto md:min-w-[200px] md:mx-auto block"
          >
            {formik.isSubmitting ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-10 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <Link 
            href="/auth/login" 
            className="font-semibold text-primary-950 hover:text-primary-800"
          >
            Inicia Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
