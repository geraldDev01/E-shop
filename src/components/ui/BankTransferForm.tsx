import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaUniversity, FaFileUpload } from 'react-icons/fa';
import type { FinancialEntity } from '@/api/financialEntities';
import Image from 'next/image';

export interface BankTransferFormValues {
  entity: string;
  reference: string;
  date: string;
  observations: string;
  file: File | null;
}

interface BankTransferFormProps {
  amount: number;
  onSubmit: (data: BankTransferFormValues & { amount: number }) => void;
  isSubmitting: boolean;
  entities: FinancialEntity[];
}

export default function BankTransferForm({ amount, onSubmit, isSubmitting, entities }: BankTransferFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const formik = useFormik<BankTransferFormValues>({
    initialValues: {
      entity: '',
      reference: '',
      date: '',
      observations: '',
      file: null,
    },
    validationSchema: Yup.object({
      entity: Yup.string().required('Seleccione una entidad bancaria'),
      reference: Yup.string().required('La referencia es obligatoria'),
      date: Yup.string().required('La fecha es obligatoria'),
      file: Yup.mixed().required('El comprobante es obligatorio'),
    }),
    onSubmit: (values) => {
      setFileError(null);
      onSubmit({ ...values, amount });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowed.includes(selected.type)) {
        setFileError('Solo se permiten imágenes (jpg, jpeg, png).');
        formik.setFieldValue('file', null);
        setPreviewUrl(null);
        return;
      }
      setFileError(null);
      formik.setFieldValue('file', selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleRemoveImage = () => {
    formik.setFieldValue('file', null);
    setPreviewUrl(null);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Form fields */}
        <div className="space-y-5 md:pr-6">
          <div className="flex justify-center">
            <div className="card rounded-xl shadow-lg border-2 border-orange-200 px-6 py-5 w-full max-w-xs flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-3 text-[#d64d04]">
                <FaUniversity className="w-7 h-7" />
                <span className="font-bold text-lg">Seleccione Banco</span>
              </div>
              <div className="text-sm text-gray-700 space-y-2 w-full">
                <select
                  name="entity"
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d64d04] focus:border-transparent transition-all"
                  value={formik.values.entity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Seleccione una entidad</option>
                  {entities.map((e) => (
                    <option key={e.financial_id} value={e.financial_id}>
                      {e.financial_description} - {e.account_reference_name} ({e.currency})
                    </option>
                  ))}
                </select>
                {formik.touched.entity && formik.errors.entity && (
                  <div className="text-red-500 text-xs mt-1 font-medium">{formik.errors.entity}</div>
                )}
                {/* Mostrar detalles de la cuenta seleccionada */}
                {formik.values.entity && (
                  <>
                    {(() => {
                      const selected = entities.find(e => e.financial_id === Number(formik.values.entity));
                      if (!selected) return null;
                      return (
                        <div className="mt-3 p-3 bg-orange-50 rounded-lg text-left text-xs text-gray-700 space-y-1 border border-orange-200">
                          <div><span className="font-semibold">N° Cuenta:</span> {selected.account_reference_number}</div>
                          <div><span className="font-semibold">Nombre:</span> {selected.account_reference_name}</div>
                          <div><span className="font-semibold">Moneda:</span> {selected.currency}</div>
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Referencia <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="reference"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d64d04] focus:border-transparent transition-all"
              value={formik.values.reference}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.reference && formik.errors.reference && (
              <div className="text-red-500 text-xs mt-1 font-medium">{formik.errors.reference}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Transacción <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="date"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d64d04] focus:border-transparent transition-all"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.date && formik.errors.date && (
              <div className="text-red-500 text-xs mt-1 font-medium">{formik.errors.date}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Monto</label>
            <input
              type="text"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-500 cursor-not-allowed"
              value={`$${amount.toFixed(2)}`}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Observaciones</label>
            <textarea
              name="observations"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#d64d04] focus:border-transparent transition-all resize-none"
              value={formik.values.observations}
              onChange={formik.handleChange}
              rows={3}
            />
          </div>
        </div>
        {/* Right: Image upload/preview */}
        <div className="flex flex-col h-full justify-center md:pl-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Comprobante <span className="text-red-500">*</span></label>
          <div className="flex flex-col gap-2 h-full">
            {!previewUrl && (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#d64d04] hover:bg-orange-50/50 transition-all bg-gray-50">
                <FaFileUpload className="w-12 h-12 text-gray-400 mb-3" />
                <span className="text-gray-500 text-sm text-center px-4">Haz clic para seleccionar una imagen (jpg, jpeg, png)</span>
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
              <div className="relative w-full bg-gray-50 border-2 border-dashed border-[#d64d04] rounded-xl p-4 flex items-center justify-center mt-2 min-h-[300px] max-h-[400px] overflow-auto">
                <Image
                  src={previewUrl}
                  alt="Comprobante"
                  width={350}
                  height={350}
                  className="max-h-[350px] w-auto max-w-full rounded-lg shadow-lg object-contain mx-auto"
                  style={{ objectFit: 'contain' }}
                  unoptimized
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:bg-red-100 text-red-500 border-2 border-red-200 transition-all"
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
          {(fileError || (formik.touched.file && formik.errors.file)) && (
            <div className="text-red-500 text-sm mt-2 font-medium">{fileError || formik.errors.file as string}</div>
          )}
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <button
          type="submit"
          className="w-full max-w-xs py-3 px-6 bg-[#d64d04] text-white rounded-lg font-semibold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg hover:shadow-xl disabled:shadow-none"
          disabled={isSubmitting}
        >
          <FaFileUpload /> {isSubmitting ? 'Enviando...' : 'Enviar Pago'}
        </button>
      </div>
    </form>
  );
} 