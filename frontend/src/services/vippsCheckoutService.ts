const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Declare VippsCheckout SDK type (loaded from CDN)
declare global {
  interface Window {
    VippsCheckout: (config: VippsCheckoutConfig) => VippsCheckoutInstance;
  }
}

export interface VippsCheckoutConfig {
  checkoutFrontendUrl: string;
  iFrameContainerId: string;
  language?: 'nb' | 'dk' | 'fi' | 'en';
  token: string;
  on?: (event: VippsCheckoutEvent) => void;
}

export interface VippsCheckoutInstance {
  // Methods available on the checkout instance
  // The SDK may provide methods like close(), etc.
}

export interface VippsCheckoutEvent {
  name: string;
  data?: any;
}

export interface CreateSessionRequest {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    size?: string;
  }>;
  customerInfo?: {
    email?: string;
    phoneNumber?: string;
  };
}

export interface CreateSessionResponse {
  success: boolean;
  reference: string;
  token: string;
  checkoutFrontendUrl: string;
  pollingUrl: string;
}

export interface SessionStatusResponse {
  sessionState: string;
  reference: string;
  paymentDetails?: {
    type: string;
    state: string;
    amount: {
      value: number;
      currency: string;
    };
  };
  subscriptionDetails?: {
    agreementId: string;
    state: string;
  };
  shippingDetails?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    streetAddress?: string;
    postalCode?: string;
    city?: string;
    country?: string;
  };
  billingDetails?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    streetAddress?: string;
    postalCode?: string;
    city?: string;
    country?: string;
  };
  userDetails?: {
    userId: string;
    email?: string;
    mobileNumber?: string;
    address?: any;
  };
}

export const vippsCheckoutService = {
  /**
   * Create a new checkout session
   */
  async createSession(request: CreateSessionRequest): Promise<CreateSessionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/vipps/checkout/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to create checkout session' }));
        throw new Error(error.message || 'Failed to create checkout session');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  },

  /**
   * Get session status by reference
   */
  async getSessionStatus(reference: string): Promise<SessionStatusResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/vipps/checkout/session/${reference}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to get session status' }));
        throw new Error(error.message || 'Failed to get session status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting session status:', error);
      throw error;
    }
  },

  /**
   * Poll session status until terminal state
   */
  async pollSessionStatus(
    reference: string,
    onUpdate?: (status: SessionStatusResponse) => void,
    maxAttempts: number = 60,
    intervalMs: number = 2000
  ): Promise<SessionStatusResponse> {
    let attempts = 0;
    const terminalStates = ['PaymentSuccessful', 'PaymentTerminated', 'PaymentInitiationFailed', 'SessionExpired'];

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          attempts++;
          const status = await this.getSessionStatus(reference);

          if (onUpdate) {
            onUpdate(status);
          }

          if (terminalStates.includes(status.sessionState)) {
            resolve(status);
            return;
          }

          if (attempts >= maxAttempts) {
            reject(new Error('Polling timeout: Session did not reach terminal state'));
            return;
          }

          setTimeout(poll, intervalMs);
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  },

  /**
   * Initialize Vipps Checkout SDK
   */
  initializeCheckout(config: VippsCheckoutConfig): VippsCheckoutInstance {
    if (!window.VippsCheckout) {
      throw new Error('Vipps Checkout SDK not loaded. Make sure the script is included in index.html');
    }

    return window.VippsCheckout(config);
  },
};

