'use client'
import { useAuth } from '@/context/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { IoPersonCircleOutline, IoMailOutline, IoCallOutline, IoLocationOutline } from 'react-icons/io5';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.replace('/auth/login');
    }
  }, [user, router]);

  if (!user || !user.profile) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d64d04]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Mi Perfil</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center mb-8">
          <div className="w-32 h-32 bg-[#d64d04] rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-white">
              {user.profile.full_name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <IoPersonCircleOutline className="text-2xl text-[#d64d04]" />
              <div>
                <p className="text-sm text-gray-500">Nombre Completo</p>
                <p className="font-medium">{user.profile.full_name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <IoMailOutline className="text-2xl text-[#d64d04]" />
              <div>
                <p className="text-sm text-gray-500">Correo Electrónico</p>
                <p className="font-medium">{user.profile.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <IoCallOutline className="text-2xl text-[#d64d04]" />
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium">{user.profile.phone || 'No especificado'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <IoLocationOutline className="text-2xl text-[#d64d04]" />
              <div>
                <p className="text-sm text-gray-500">Dirección</p>
                <p className="font-medium">{user.profile.address || 'No especificada'}</p>
              </div>
            </div>
          </div>
        </div>

        {user.profile.department_description && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-bold text-gray-800 mb-2">Ubicación</h3>
            <p className="text-gray-600">
              {user.profile.department_description}
              {user.profile.municipality_description && 
                `, ${user.profile.municipality_description}`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}