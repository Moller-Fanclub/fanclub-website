import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession, signOut } from '../../lib/auth-client';

interface Order {
  id: string;
  reference: string;
  status: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress: {
    firstName?: string;
    lastName?: string;
    street?: string;
    postalCode?: string;
    city?: string;
    country?: string;
  };
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    productImage?: string;
    size?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  itemsTotal: number;
  shippingPrice: number;
  totalAmount: number;
  paymentMethod?: string;
  paymentState?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  shippedAt?: string;
}

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  paidOrders: number;
  shippedOrders: number;
  cancelledOrders: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

type SortField = 'reference' | 'customerName' | 'status' | 'totalAmount' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export default function AdminDashboardPage() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [hidePending, setHidePending] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isPending && !session) {
      navigate('/admin/login');
    }
  }, [session, isPending, navigate]);

  useEffect(() => {
    if (session) {
      fetchOrders();
      fetchStats();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders?limit=100`, {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/admin/login');
          return;
        }
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const formatPrice = (ore: number) => {
    return `${(ore / 100).toFixed(0)} kr`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('no-NO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-500/20 text-green-300 border-green-500';
      case 'SHIPPED':
        return 'bg-blue-500/20 text-blue-300 border-blue-500';
      case 'DELIVERED':
        return 'bg-purple-500/20 text-purple-300 border-purple-500';
      case 'PENDING':
      case 'PAYMENT_PENDING':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-red-500/20 text-red-300 border-red-500';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500';
    }
  };

  // Sorting and filtering logic
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortedAndFilteredOrders = () => {
    let filtered = [...orders];

    // Filter out PENDING orders if hidePending is true
    if (hidePending) {
      filtered = filtered.filter(
        (order) => order.status !== 'PENDING' && order.status !== 'PAYMENT_PENDING'
      );
    }

    // Sort orders
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'reference':
          aValue = a.reference;
          bValue = b.reference;
          break;
        case 'customerName':
          aValue = a.customerName.toLowerCase();
          bValue = b.customerName.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'totalAmount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <span className="ml-1 text-gray-400">
          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </span>
      );
    }
    return (
      <span className="ml-1 text-blue-400">
        {sortDirection === 'asc' ? (
          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </span>
    );
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-300 text-sm">Møller Fanclub Orders</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-300 text-sm">{session.user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
              <div className="text-gray-300 text-sm">Total Orders</div>
              <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
              <div className="text-gray-300 text-sm">Total Revenue</div>
              <div className="text-2xl font-bold text-white">{formatPrice(stats.totalRevenue)}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
              <div className="text-gray-300 text-sm">Pending</div>
              <div className="text-2xl font-bold text-yellow-300">{stats.pendingOrders}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
              <div className="text-gray-300 text-sm">Paid</div>
              <div className="text-2xl font-bold text-green-300">{stats.paidOrders}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
              <div className="text-gray-300 text-sm">Shipped</div>
              <div className="text-2xl font-bold text-blue-300">{stats.shippedOrders}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
              <div className="text-gray-300 text-sm">Cancelled</div>
              <div className="text-2xl font-bold text-red-300">{stats.cancelledOrders}</div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/20 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Orders</h2>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hidePending}
                  onChange={(e) => setHidePending(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Hide PENDING orders</span>
              </label>
            </div>
          </div>
          {error && (
            <div className="px-6 py-4 bg-red-500/20 border-b border-red-500 text-red-200">
              {error}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => handleSort('reference')}
                  >
                    <div className="flex items-center">
                      Reference
                      <SortIcon field="reference" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => handleSort('customerName')}
                  >
                    <div className="flex items-center">
                      Customer
                      <SortIcon field="customerName" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      <SortIcon field="status" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Items
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => handleSort('totalAmount')}
                  >
                    <div className="flex items-center">
                      Total
                      <SortIcon field="totalAmount" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Date
                      <SortIcon field="createdAt" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {getSortedAndFilteredOrders().map((order) => (
                  <tr key={order.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{order.reference}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{order.customerName}</div>
                      <div className="text-sm text-gray-400">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{formatPrice(order.totalAmount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Order Details: {selectedOrder.reference}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Customer Information</h4>
                <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white ml-2">{selectedOrder.customerName}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white ml-2">{selectedOrder.customerEmail}</span>
                  </div>
                  {selectedOrder.customerPhone && (
                    <div className="text-sm">
                      <span className="text-gray-400">Phone:</span>
                      <span className="text-white ml-2">{selectedOrder.customerPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress.street && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Shipping Address</h4>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-sm text-white">
                      {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                      <br />
                      {selectedOrder.shippingAddress.street}
                      <br />
                      {selectedOrder.shippingAddress.postalCode} {selectedOrder.shippingAddress.city}
                      <br />
                      {selectedOrder.shippingAddress.country}
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="bg-gray-900/50 rounded-lg p-4 flex justify-between">
                      <div>
                        <div className="text-white font-medium">{item.productName}</div>
                        {item.size && (
                          <div className="text-gray-400 text-sm">Size: {item.size}</div>
                        )}
                        <div className="text-gray-400 text-sm">Quantity: {item.quantity}</div>
                      </div>
                      <div className="text-white font-medium">{formatPrice(item.totalPrice)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Order Summary</h4>
                <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Items Total:</span>
                    <span className="text-white">{formatPrice(selectedOrder.itemsTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping:</span>
                    <span className="text-white">{formatPrice(selectedOrder.shippingPrice)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-700 pt-2 mt-2">
                    <span className="text-white">Total:</span>
                    <span className="text-white">{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Payment Information</h4>
                <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
                  {selectedOrder.paymentMethod && (
                    <div className="text-sm">
                      <span className="text-gray-400">Method:</span>
                      <span className="text-white ml-2">{selectedOrder.paymentMethod}</span>
                    </div>
                  )}
                  {selectedOrder.paymentState && (
                    <div className="text-sm">
                      <span className="text-gray-400">State:</span>
                      <span className="text-white ml-2">{selectedOrder.paymentState}</span>
                    </div>
                  )}
                  {selectedOrder.paidAt && (
                    <div className="text-sm">
                      <span className="text-gray-400">Paid At:</span>
                      <span className="text-white ml-2">{formatDate(selectedOrder.paidAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

