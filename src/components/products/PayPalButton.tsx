/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { PayPalButtons } from "@paypal/react-paypal-js";

interface Props {
  amount: number;
  onSuccess: (data: any) => void;
  onError?: (error: any) => void;
  currency?: string;
}

export const PayPalButton = ({ 
  amount, 
  onSuccess, 
  onError,
  currency = "USD" 
}: Props) => {
  return (
    <PayPalButtons 
      createOrder={(data, actions) => {
        return actions.order.create({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: currency,
                value: amount.toFixed(2),
              },
              description: "Purchase from MOMBA Shop",
            },
          ],
        });
      }}
      onApprove={(data, actions) => {
        return actions.order!.capture().then((details) => {
          onSuccess(details);
        });
      }}
      onError={(err) => {
        console.error('PayPal Error:', err);
        onError?.(err);
      }}
      style={{ 
        layout: "horizontal",
        color: "gold",
        shape: "rect",
        label: "pay"
      }}
    />
  );
}; 