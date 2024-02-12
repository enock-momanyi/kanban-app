import "@/styles/globals.css";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
      if ('serviceWorker' in navigator) {
          navigator.serviceWorker
            .register('/service-worker.js')
            .then(registration => {
              console.log('Service worker registered:', registration);
            }
    )
            .catch(error => {
              console.log('Service worker registration failed:', error);
            }
    );
        }
    
  },[])
  return <Component {...pageProps} />;
}
