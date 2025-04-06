import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, DollarSign, Settings, PenTool as Tool, Clock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDashboardStore } from '../store/dashboardStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    tenants,
    tickets,
    payments,
    expenses,
    pendingProperties,
    loading,
    error,
    fetchTenants,
    fetchTickets,
    fetchPayments,
    fetchExpenses,
    fetchPendingProperties,
  } = useDashboardStore();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (user.role === 'admin') {
      fetchPendingProperties();
    }

    if (user.role === 'owner' && user.subscription_status === 'active') {
      fetchTenants();
      fetchTickets();
      fetchPayments();
      fetchExpenses();
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const renderAdminDashboard = () => (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage properties and users</p>
      </header>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Building2 className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="font-semibold">Pending Properties</h3>
          <p className="text-2xl font-bold mt-2">{pendingProperties.length}</p>
        </div>
        {/* Add more admin stats */}
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Pending Approvals</h2>
        </div>
        <div className="p-6">
          {pendingProperties.length > 0 ? (
            <div className="space-y-4">
              {pendingProperties.map((property) => (
                <div key={property.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-semibold">{property.title}</h3>
                    <p className="text-gray-600">{property.type} - {property.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => useDashboardStore.getState().approveProperty(property.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => useDashboardStore.getState().rejectProperty(property.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No pending properties</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderOwnerDashboard = () => (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
        <p className="text-gray-600 mt-2">Manage your properties and tenants</p>
      </header>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Users className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="font-semibold">Active Tenants</h3>
          <p className="text-2xl font-bold mt-2">{tenants.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Tool className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="font-semibold">Open Tickets</h3>
          <p className="text-2xl font-bold mt-2">
            {tickets.filter(t => t.status === 'open').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <DollarSign className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="font-semibold">Monthly Revenue</h3>
          <p className="text-2xl font-bold mt-2">
            ${payments
              .filter(p => new Date(p.payment_date).getMonth() === new Date().getMonth())
              .reduce((sum, p) => sum + p.amount, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Clock className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="font-semibold">Upcoming Renewals</h3>
          <p className="text-2xl font-bold mt-2">
            {tenants.filter(t => {
              const daysUntilRenewal = Math.ceil(
                (new Date(t.lease_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              return daysUntilRenewal <= 30 && daysUntilRenewal > 0;
            }).length}
          </p>
        </div>
      </div>

      {user.subscription_status !== 'active' && (
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Upgrade to Property Management Pro</h2>
          <p className="text-gray-600 mb-4">
            Get access to advanced features like tenant management, maintenance tracking, and financial reports.
          </p>
          <button
            onClick={() => navigate('/subscribe')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Subscribe Now - $5/month
          </button>
        </div>
      )}

      {user.subscription_status === 'active' && (
        <>
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Recent Maintenance Tickets</h2>
            </div>
            <div className="p-6">
              {tickets.length > 0 ? (
                <div className="space-y-4">
                  {tickets.slice(0, 5).map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <h3 className="font-semibold">{ticket.title}</h3>
                        <p className="text-gray-600">{ticket.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {ticket.priority}
                        </span>
                        <select
                          value={ticket.status}
                          onChange={(e) => useDashboardStore.getState().updateTicketStatus(ticket.id, e.target.value as any)}
                          className="border rounded-lg px-2 py-1"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">No maintenance tickets</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Recent Payments</h2>
            </div>
            <div className="p-6">
              {payments.length > 0 ? (
                <div className="space-y-4">
                  {payments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <h3 className="font-semibold">${payment.amount.toLocaleString()}</h3>
                        <p className="text-gray-600">{new Date(payment.payment_date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                        {payment.receipt_url && (
                          <a
                            href={payment.receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Receipt
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">No recent payments</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderClientDashboard = () => (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your properties and requests</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Building2 className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="font-semibold">Unlocked Properties</h3>
          <p className="text-2xl font-bold mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Heart className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="font-semibold">Favorites</h3>
          <p className="text-2xl font-bold mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Settings className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="font-semibold">Role Change Request</h3>
          <button
            onClick={() => navigate('/role-change')}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Request Owner/Broker Role
          </button>
        </div>
      </div>

      {/* Add sections for unlocked properties and favorites */}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {user?.role === 'admin' && renderAdminDashboard()}
      {user?.role === 'owner' && renderOwnerDashboard()}
      {user?.role === 'client' && renderClientDashboard()}
    </div>
  );
};

export default Dashboard;