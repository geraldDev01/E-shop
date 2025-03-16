import { Inter, Montserrat_Alternates } from "next/font/google";

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const montserrat = Montserrat_Alternates({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});