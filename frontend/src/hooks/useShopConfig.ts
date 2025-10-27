import { useState, useEffect } from 'react';

interface ShopConfig {
  openingDate: string;
  closingDate: string;
}

export function useShopConfig() {
  const [config, setConfig] = useState<ShopConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/shop/config`)
      .then((res: Response) => res.json())
      .then((data: ShopConfig) => {
        setConfig(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error('Failed to load shop config:', err);
        setLoading(false);
      });
  }, []);

  const now = new Date();
  const isOpen = config ? 
    now >= new Date(config.openingDate) && now <= new Date(config.closingDate) : 
    false;
  const isBeforeOpening = config ? now < new Date(config.openingDate) : false;

  return {
    config,
    loading,
    isOpen,
    isBeforeOpening
  };
}
