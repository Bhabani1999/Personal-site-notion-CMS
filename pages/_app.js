// pages/_app.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const lang = 'en'; // Set your language code here
    document.documentElement.lang = lang;
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
