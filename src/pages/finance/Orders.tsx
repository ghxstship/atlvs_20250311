import React, { useState } from 'react';
import { ShoppingCart, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Phone, Mail, Building, Star, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import OrderForm from '../../components/forms/OrderForm';
import useModal from '../../hooks/useModal';
import EmptyState from '../../components/EmptyState';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Orders() {
  const { isOpen, openModal, closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      closeModal();
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const orders = [
    {
      id: 1,
      orderNumber: 'ORD-2024-001',
      description: 'Stage Equipment',
      supplier: 'Pro Audio Systems',
      amount: 12500,
      orderDate: '2024-03-15',
      requiredDate: '2024-03-30',
      status: 'Delivered',
      project: 'Summer Music Festival',
      category: 'Equipment',
      items: [
        { name: 'Line Array Speakers', quantity: 8, price: 1000, total: 8000 },
        { name: 'Subwoofers', quantity: 4, price: 750, total: 3000 },
        { name: 'Monitor Speakers', quantity: 6, price: 250, total: 1500 }
      ],
      shipping: {
        method: 'Ground',
        tracking: 'TRK123456789',
        carrier: 'FedEx',
        cost: 350
      },
      contact: {
        name: 'John Smith',
        email: 'john.smith@proaudio.com',
        phone: '(555) 123-4567'
      },
      notes: 'Rush order for festival setup. Delivery required before setup date.',
      documents: [
        { name: 'purchase_order.pdf', size: '1.2 MB', date: '2024-03-15' },
        { name: 'invoice.pdf', size: '0.8 MB', date: '2024-03-15' }
      ]
    }
  ];

  const statusBoxes = [
    {
      title: 'Total Orders',
      value: orders.length.toString(),
      subtitle: 'All orders',
      icon: 'package'
    },
    {
      title: 'Delivered',
      value: orders.filter(o => o.status === 'Delivered').length.toString(),
      subtitle: 'Completed orders',
      icon: 'check',
      type: 'success'
    },
    {
      title: 'Processing',
      value: orders.filter(o => o.status === 'Processing').length.toString(),
      subtitle: 'In progress',
      icon: 'clock',
      type: 'info'
    },
    {
      title: 'Pending',
      value: orders.filter(o => o.status === 'Pending').length.toString(),
      subtitle: 'Awaiting processing',
      icon: 'alert',
      type: 'warning'
    }
  ];

  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(order => {
        if (activeFilter === 'completed') {
          return order.status === 'Delivered';
        } else if (activeFilter === 'processing') {
          return order.status === 'Processing';
        } else if (activeFilter === 'pending') {
          return order.status === 'Pending';
        }
        return true;
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Purchase Orders</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
            />
            <Search className="w-5 h-5 text-mono-400 absolute left-3 top-2.5" />
          </div>
          <button className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent hover:text-white">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button 
            onClick={openModal}
            className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent hover:text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Create New Order"
      >
        <OrderForm
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <div className="mb-6">
        <div className="flex space-x-2 border-b border-mono-200">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 ${activeFilter === 'all' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            All Orders
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-4 py-2 ${activeFilter === 'completed' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Delivered
          </button>
          <button
            onClick={() => setActiveFilter('processing')}
            className={`px-4 py-2 ${activeFilter === 'processing' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Processing
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-4 py-2 ${activeFilter === 'pending' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Pending
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-12 gap-4 p-4 font-medium text-mono-700 border-b">
            <div className="col-span-2">Order ID</div>
            <div>Project</div>
            <div>Category</div>
            <div className="col-span-2">Description</div>
            <div className="col-span-2 text-right">Amount</div>
            <div>Status</div>
            <div></div>
          </div>
          
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <React.Fragment key={order.id}>
                <div 
                  className={`grid grid-cols-12 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === order.id ? 'bg-mono-50' : ''}`}
                  onClick={() => toggleExpand(order.id)}
                >
                  <div className="col-span-2 font-mono text-sm text-mono-600">{order.orderNumber}</div>
                  <div className="text-mono-600">{order.project}</div>
                  <div className="text-mono-600">{order.category}</div>
                  <div className="col-span-2 text-mono-600 truncate">{order.description}</div>
                  <div className="col-span-2 text-right">${order.amount.toLocaleString()}</div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    {expandedId === order.id ? (
                      <ChevronUp className="w-5 h-5 text-mono-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-mono-400" />
                    )}
                  </div>
                </div>

                {expandedId === order.id && (
                  <div className="col-span-12 bg-mono-50 p-6 border-b">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-2">
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Order Items</h3>
                          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="grid grid-cols-4 gap-4 p-3 font-medium text-mono-700 border-b">
                              <div>Item</div>
                              <div className="text-right">Quantity</div>
                              <div className="text-right">Price</div>
                              <div className="text-right">Total</div>
                            </div>
                            {order.items.map((item, index) => (
                              <div key={index} className="grid grid-cols-4 gap-4 p-3 border-b last:border-0">
                                <div className="text-sm text-mono-600">{item.name}</div>
                                <div className="text-right text-sm text-mono-600">{item.quantity}</div>
                                <div className="text-right text-sm text-mono-600">${item.price.toLocaleString()}</div>
                                <div className="text-right text-sm font-medium text-mono-900">${item.total.toLocaleString()}</div>
                              </div>
                            ))}
                            <div className="grid grid-cols-4 gap-4 p-3 bg-mono-50">
                              <div className="font-medium text-mono-900">Total</div>
                              <div></div>
                              <div></div>
                              <div className="text-right font-medium text-mono-900">
                                ${order.items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Shipping Information</h3>
                          <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-mono-500 mb-1">Method</p>
                                <p className="text-sm font-medium text-mono-900">{order.shipping.method}</p>
                              </div>
                              {order.shipping.tracking && (
                                <div>
                                  <p className="text-xs text-mono-500 mb-1">Tracking Number</p>
                                  <p className="text-sm font-medium text-mono-900">{order.shipping.tracking}</p>
                                </div>
                              )}
                              <div>
                                <p className="text-xs text-mono-500 mb-1">Carrier</p>
                                <p className="text-sm font-medium text-mono-900">{order.shipping.carrier}</p>
                              </div>
                              <div>
                                <p className="text-xs text-mono-500 mb-1">Shipping Cost</p>
                                <p className="text-sm font-medium text-mono-900">${order.shipping.cost}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Notes</h3>
                          <p className="text-sm text-mono-600 bg-white p-3 rounded-lg shadow-sm">{order.notes}</p>
                        </div>
                      </div>

                      <div>
                        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Contact Information</h3>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 text-mono-400 mr-2" />
                              <span className="text-sm text-mono-900">{order.contact.name}</span>
                            </div>
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 text-mono-400 mr-2" />
                              <a href={`mailto:${order.contact.email}`} className="text-sm text-accent hover:underline">
                                {order.contact.email}
                              </a>
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 text-mono-400 mr-2" />
                              <a href={`tel:${order.contact.phone}`} className="text-sm text-accent hover:underline">
                                {order.contact.phone}
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                          <div className="space-y-2">
                            {order.documents.map((doc, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <FileText className="w-4 h-4 text-mono-400 mr-2" />
                                  <span className="text-sm text-accent hover:underline cursor-pointer">{doc.name}</span>
                                </div>
                                <span className="text-xs text-mono-500">{doc.size}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-mono-200 flex justify-end space-x-3">
                      <ActionButtons />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))
          ) : (
            <EmptyState
              icon={ShoppingCart}
              title="No orders found"
              message={
                activeFilter === 'all' 
                  ? "No purchase orders have been created yet."
                  : "No orders found matching the selected filter."
              }
              action={{
                label: "Create Order",
                onClick: openModal
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}