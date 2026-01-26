import React, { useState } from 'react';
import { DollarSign, Plus, Search, Download, AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  studentName: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: string;
}

interface Payment {
  id: string;
  receiptNumber: string;
  studentName: string;
  amount: number;
  paymentDate: string;
  method: 'cash' | 'cheque' | 'online' | 'transfer';
  createdAt: string;
}

export const FeeManagement: React.FC = () => {
  const [view, setView] = useState<'invoices' | 'payments' | 'defaulters'>('invoices');
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      studentName: 'Ritik Koley',
      amount: 150000,
      dueDate: '2024-02-15',
      status: 'pending',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      studentName: 'Aditya Singh',
      amount: 150000,
      dueDate: '2024-01-20',
      status: 'overdue',
      createdAt: '2024-01-10'
    }
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      receiptNumber: 'REC-2024-001',
      studentName: 'Priya Kumar',
      amount: 150000,
      paymentDate: '2024-01-10',
      method: 'online',
      createdAt: '2024-01-10'
    }
  ]);

  const [invoiceForm, setInvoiceForm] = useState({
    studentName: '',
    amount: '',
    dueDate: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    studentName: '',
    amount: '',
    method: 'online' as const,
    receiptNumber: ''
  });

  const handleCreateInvoice = () => {
    if (invoiceForm.studentName && invoiceForm.amount && invoiceForm.dueDate) {
      const newInvoice: Invoice = {
        id: String(invoices.length + 1),
        invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
        studentName: invoiceForm.studentName,
        amount: parseFloat(invoiceForm.amount),
        dueDate: invoiceForm.dueDate,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setInvoices([...invoices, newInvoice]);
      setInvoiceForm({ studentName: '', amount: '', dueDate: '' });
      setShowInvoiceForm(false);
    }
  };

  const handleCreatePayment = () => {
    if (paymentForm.studentName && paymentForm.amount && paymentForm.receiptNumber) {
      const newPayment: Payment = {
        id: String(payments.length + 1),
        receiptNumber: paymentForm.receiptNumber,
        studentName: paymentForm.studentName,
        amount: parseFloat(paymentForm.amount),
        paymentDate: new Date().toISOString().split('T')[0],
        method: paymentForm.method,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPayments([...payments, newPayment]);
      setPaymentForm({ studentName: '', amount: '', method: 'online', receiptNumber: '' });
      setShowPaymentForm(false);
    }
  };

  const collectedThisMonth = payments
    .filter(p => new Date(p.paymentDate).getMonth() === new Date().getMonth())
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = invoices
    .filter(i => i.status === 'pending' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.amount, 0);

  const defaultersCount = invoices.filter(i => i.status === 'overdue').length;

  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Fee Management
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Invoicing, payments, and collection tracking
              </p>
            </div>
          </div>
          {view === 'invoices' && (
            <button
              onClick={() => setShowInvoiceForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Generate Invoice</span>
            </button>
          )}
          {view === 'payments' && (
            <button
              onClick={() => setShowPaymentForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Record Payment</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Collected This Month</p>
          <p className="text-2xl font-bold text-green-500">₹{(collectedThisMonth / 100000).toFixed(1)}L</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Pending Collection</p>
          <p className="text-2xl font-bold text-orange-500">₹{(pendingAmount / 100000).toFixed(1)}L</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Fee Defaulters</p>
          <p className="text-2xl font-bold text-red-500">{defaultersCount}</p>
        </div>
      </div>

      <div className="apple-card p-6">
        <div className="flex items-center space-x-4 mb-6">
          {['invoices', 'payments', 'defaulters'].map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab as any)}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                view === tab
                  ? 'bg-apple-blue-500 text-white'
                  : 'bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-apple-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {view === 'invoices' && (
          <div className="space-y-3">
            {invoices.map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-apple-gray-600 dark:text-white">{invoice.studentName}</p>
                  <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">{invoice.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-apple-gray-600 dark:text-white">₹{invoice.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    invoice.status === 'overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}>
                    {invoice.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'payments' && (
          <div className="space-y-3">
            {payments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-4 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-apple-gray-600 dark:text-white">{payment.studentName}</p>
                  <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">{payment.receiptNumber} • {payment.method}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600 dark:text-green-400">₹{payment.amount}</p>
                  <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300">{payment.paymentDate}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'defaulters' && (
          <div className="space-y-3">
            {invoices.filter(i => i.status === 'overdue').map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900/50">
                <div>
                  <p className="font-medium text-red-700 dark:text-red-400">{invoice.studentName}</p>
                  <p className="text-sm text-red-600 dark:text-red-300">Due: {invoice.dueDate}</p>
                </div>
                <p className="font-bold text-red-700 dark:text-red-400">₹{invoice.amount}</p>
              </div>
            ))}
            {invoices.filter(i => i.status === 'overdue').length === 0 && (
              <p className="text-center py-8 text-apple-gray-400">No defaulters</p>
            )}
          </div>
        )}
      </div>

      {showInvoiceForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="apple-card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-apple-gray-600 dark:text-white">Generate Invoice</h2>
              <button onClick={() => setShowInvoiceForm(false)} className="text-apple-gray-400 hover:text-apple-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Student Name"
                value={invoiceForm.studentName}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, studentName: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <input
                type="number"
                placeholder="Amount"
                value={invoiceForm.amount}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <input
                type="date"
                value={invoiceForm.dueDate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleCreateInvoice}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowInvoiceForm(false)}
                  className="flex-1 px-4 py-2 bg-apple-gray-200 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-white rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPaymentForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="apple-card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-apple-gray-600 dark:text-white">Record Payment</h2>
              <button onClick={() => setShowPaymentForm(false)} className="text-apple-gray-400 hover:text-apple-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Receipt Number"
                value={paymentForm.receiptNumber}
                onChange={(e) => setPaymentForm({ ...paymentForm, receiptNumber: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <input
                type="text"
                placeholder="Student Name"
                value={paymentForm.studentName}
                onChange={(e) => setPaymentForm({ ...paymentForm, studentName: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <input
                type="number"
                placeholder="Amount"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <select
                value={paymentForm.method}
                onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value as any })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              >
                <option value="online">Online</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
                <option value="transfer">Bank Transfer</option>
              </select>
              <div className="flex space-x-3">
                <button
                  onClick={handleCreatePayment}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="flex-1 px-4 py-2 bg-apple-gray-200 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-white rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
