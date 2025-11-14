import { useState, useEffect } from 'react';

interface ShopConfig {
  openingDate: string;
  closingDate: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function useShopConfig() {
  const [config, setConfig] = useState<ShopConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/shop/config`)
      .then((res: Response) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch shop config: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
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
