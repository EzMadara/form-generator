'use client';

import React, { useEffect, useState } from 'react';
import { Trash2, Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Invoice {
  id: string;
  requestNumber: string;
  date: string;
  purpose: string;
  addressProject: string;
  amount: string;
  totalAmount: string;
  recipientName: string;
  bankName: string;
  accountNumber: string;
  paymentMethod: string;
  projectConsultant: string;
  purchasingOfficer: string;
  recipientCompany: string;
  createdAt: string;
  updatedAt: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices');
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setInvoices(invoices.filter(inv => inv.id !== id));
        if (selectedInvoice?.id === id) {
          setSelectedInvoice(null);
        }
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Failed to delete invoice');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading invoices...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/form-generator"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Form Generator</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">
            Saved Invoices ({invoices.length})
          </h1>
        </div>

        {invoices.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <p className="text-xl text-gray-600 mb-4">No invoices saved yet</p>
            <Link
              href="/form-generator"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Create Your First Invoice
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Invoice List */}
            <div className="lg:col-span-1 space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg ${
                    selectedInvoice?.id === invoice.id
                      ? 'ring-2 ring-blue-500'
                      : ''
                  }`}
                  onClick={() => setSelectedInvoice(invoice)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {invoice.requestNumber}
                      </h3>
                      <p className="text-sm text-gray-600">{invoice.date}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(invoice.id);
                      }}
                      disabled={deletingId === invoice.id}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 mb-1" dir="rtl">
                    {invoice.purpose}
                  </p>
                  <p className="text-sm font-medium text-green-600">
                    {invoice.totalAmount} SAR
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Created: {formatDate(invoice.createdAt)}
                  </p>
                </div>
              ))}
            </div>

            {/* Invoice Details */}
            <div className="lg:col-span-2">
              {selectedInvoice ? (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Invoice Details
                    </h2>
                    <button
                      onClick={() => setSelectedInvoice(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Request Number
                      </label>
                      <p className="text-gray-900">{selectedInvoice.requestNumber}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <p className="text-gray-900">{selectedInvoice.date}</p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Purpose (الغرض من التحويل)
                      </label>
                      <p className="text-gray-900" dir="rtl">
                        {selectedInvoice.purpose}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Entity/Project/Address (الجهة/مشروع/عنوان)
                      </label>
                      <p className="text-gray-900" dir="rtl">
                        {selectedInvoice.addressProject}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transfer Amount
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {selectedInvoice.amount} SAR
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Amount
                      </label>
                      <p className="text-gray-900 font-semibold text-green-600">
                        {selectedInvoice.totalAmount} SAR
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Beneficiary Name (اسم المستفيد)
                      </label>
                      <p className="text-gray-900" dir="rtl">
                        {selectedInvoice.recipientName}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Name (اسم البنك)
                      </label>
                      <p className="text-gray-900" dir="rtl">
                        {selectedInvoice.bankName}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number
                      </label>
                      <p className="text-gray-900 font-mono">
                        {selectedInvoice.accountNumber}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method (طريقة الدفع)
                      </label>
                      <p className="text-gray-900" dir="rtl">
                        {selectedInvoice.paymentMethod}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Recipient Company (الجهة المستلمة)
                      </label>
                      <p className="text-gray-900" dir="rtl">
                        {selectedInvoice.recipientCompany}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Consultant (استشاري المشاريع)
                      </label>
                      <p className="text-gray-900" dir="rtl">
                        {selectedInvoice.projectConsultant}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Purchasing Officer (مسؤول المشتريات)
                      </label>
                      <p className="text-gray-900" dir="rtl">
                        {selectedInvoice.purchasingOfficer}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Created: {formatDate(selectedInvoice.createdAt)}
                    </p>
                    {selectedInvoice.updatedAt !== selectedInvoice.createdAt && (
                      <p className="text-sm text-gray-500">
                        Updated: {formatDate(selectedInvoice.updatedAt)}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                  <Eye size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-xl text-gray-600">
                    Select an invoice to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

