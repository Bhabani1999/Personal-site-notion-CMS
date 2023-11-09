// pages/_app.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { IBM_Plex_Sans } from '@next/font/google';
import localfont from '@next/font/local';

export const fontLoader = IBM_Plex_Sans({
  variable: "--font-ibmplexsans",
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const hatton = localfont({
  src: '../fonts/hatton-regular.otf',
  variable: "--font-hatton",
  weight: '300',


});

export const Supply = localfont({
  src: '../fonts/PPSupplyMono-Regular.otf',
  variable: "--font-supply",
});

export const neue = localfont({
  src: '../fonts/PPNeueMontreal-Book.otf',
  variable: "--font-neue",
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const lang = 'en'; // Set your language code here
    document.documentElement.lang = lang;
  }, [router]);

  return (
    <main className={`${fontLoader.variable} ${hatton.variable} ${Supply.variable} ${neue.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;
