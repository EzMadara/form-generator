'use client';

import React, { useState } from 'react';
import { Download, FileText, Save, List } from 'lucide-react';
import Link from 'next/link';

export default function ArabicFormGenerator() {
  const generateRequestNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `M-${year}-${random}`;
  };

  const [formData, setFormData] = useState({
    requestNumber: generateRequestNumber(),
    date: new Date().toLocaleDateString('en-GB').replace(/\//g, '/'),
    purpose: 'شهادة السدار',
    entries: [
      { entity: 'مشروع الحمرأ', amount: '3,500.00' },
      { entity: '', amount: '' },
      { entity: '', amount: '' },
      { entity: '', amount: '' },
      { entity: '', amount: '' }
    ],
    recipientName: 'عبــــــد العلـــــيم علـــــي محمـــــــد',
    bankName: 'البنك الأهلي',
    accountNumber: 'SA0310000020577828000106',
    paymentMethod: 'bank',
    projectConsultant: 'م.خالد برويز',
    purchasingOfficer: 'عبدالعليم علي',
    recipientCompany: 'شركة ميتراج'
  });

  // Calculate total from all entry amounts
  const calculateTotal = (entries: { entity: string; amount: string }[]) => {
    const total = entries.reduce((sum, entry) => {
      const amount = parseFloat(entry.amount.replace(/,/g, '')) || 0;
      return sum + amount;
    }, 0);
    return total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const totalAmount = calculateTotal(formData.entries);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEntryChange = (index: number, field: 'entity' | 'amount', value: string) => {
    setFormData(prev => {
      const newEntries = [...prev.entries];
      newEntries[index] = { ...newEntries[index], [field]: value };
      return { ...prev, entries: newEntries };
    });
  };

  const generatePDF = () => {
    const content = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <style>
        @page { size: A4; margin: 2cm; }
        body { 
            font-family: 'Traditional Arabic', 'Arial', sans-serif; 
            direction: rtl;
            padding: 40px;
            line-height: 1.8;
        }
        .header { 
            text-align: center; 
            font-size: 20px; 
            font-weight: bold; 
            margin-bottom: 30px;
            text-decoration: underline;
        }
        .section { margin-bottom: 20px; }
        .label { font-weight: bold; display: inline-block; }
        .value { display: inline-block; margin: 0 10px; }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
            border: 2px solid #000;
        }
        th, td { 
            border: 1px solid #000; 
            padding: 10px; 
            text-align: center; 
        }
        th { background-color: #f0f0f0; font-weight: bold; }
        .signature-section { 
            margin-top: 40px; 
            display: flex;
            justify-content: space-between;
        }
        .signature-box {
            width: 45%;
            text-align: center;
        }
        .footer { 
            margin-top: 30px; 
            text-align: right;
        }
        .top-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            align-items: center;
        }
        .total-section {
            text-align: right;
            margin-top: 15px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        طلـــــــــب تحــــــــــــــــــــــــــويل مالــــــــــــــــــــــــــــــــــي<br>
        (دفعة تحت الحساب)
    </div>
    
    <div class="top-section">
        <div style="text-align: right;"><span class="label">رقم الطلب:</span> <span class="value">${formData.requestNumber}</span></div>
        <div style="text-align: left;"><span class="label">التاريخ:</span> <span class="value">${formData.date}</span></div>
    </div>

    <div class="section">
        <p>السادة/ الإدارة المالية ${formData.recipientCompany}</p>
        <p>كاتهورب</p>
        <p>السلام عليكم ورحمة الله وبركاته</p>
        <p>تحية طيبة وبعد،</p>
    </div>

    <div class="section">
        <p>أتقدم إليكم بهذا الخطاب بخصوص طلب تحويل مالي حسب التفاصيل التالية:</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>م</th>
                <th>الغرض من التحويل</th>
                <th>الجهة / عنوان / مشروع</th>
                <th>قيمة التحويل</th>
            </tr>
        </thead>
        <tbody>
            ${(() => {
              const validEntries = formData.entries.filter(e => e.entity || e.amount);
              return validEntries.map((entry, index) => {
                return `
                  <tr>
                      <td>${index + 1}</td>
                      <td>${formData.purpose}</td>
                      <td>${entry.entity || ''}</td>
                      <td>${entry.amount || ''}</td>
                  </tr>
                `;
              }).join('');
            })()}
        </tbody>
    </table>

    <div class="section" style="text-align: right; margin-top: 15px;">
        <p><span class="label">الأجمــــــــــــــــــالـــــــي:</span> <span class="value">${totalAmount}</span></p>
    </div>

    <div class="section">
        <p>مرفق عرض السعر</p>
    </div>

    <div class="section">
        <p><span class="label">اسم المستفيد:</span> <span class="value">${formData.recipientName}</span></p>
        <p><span class="label">طريقة الدفع:</span> <span class="value">${formData.paymentMethod === 'bank' ? 'تحويل' : 'نقدي'}</span></p>
        ${formData.paymentMethod === 'bank' ? `
        <p><span class="label">اسم البنك:</span> <span class="value">${formData.bankName}</span></p>
        <p><span class="label">رقم الحساب:</span> <span class="value">${formData.accountNumber}</span></p>
        ` : ''}
    </div>

    <div class="section">
        <p>أرجو منكم التكرم بالموافقة على هذا الطلب واتخاذ الإجراءات اللازمة لتنفيذ التحويل</p>
        <p>وأتعهد بإحضار الفواتير التي تثبت ذلك</p>
    </div>

    <div class="footer">
        <p>شاكراً لكم تعاونكم الدائم</p>
        <p>وتفضلوا بقبول فائق الاحترام والتقدير</p>
    </div>

    <div class="signature-section">
        <div class="signature-box">
            <p><strong>استشاري المشاريع</strong></p>
            <p>${formData.projectConsultant}</p>
            <p>_________________</p>
        </div>
        <div class="signature-box">
            <p><strong>مسؤول المشتريات</strong></p>
            <p>${formData.purchasingOfficer}</p>
            <p>_________________</p>
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `طلب_تحويل_مالي_${formData.requestNumber}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateExcel = () => {
    const entriesRows = formData.entries
      .map((entry, index) => `${index + 1},${formData.purpose},${entry.entity || ''},${entry.amount || ''},${index === 0 ? totalAmount : ''}`)
      .filter(row => row.split(',')[2] || row.split(',')[3]); // Only include rows with entity or amount
    
    const csvContent = `طلب تحويل مالي (دفعة تحت الحساب)

رقم الطلب,${formData.requestNumber}
التاريخ,${formData.date}

الجهة المستلمة,${formData.recipientCompany}

م,الغرض من التحويل,الجهة/مشروع/عنوان,قيمة التحويل,الإجمالي
${entriesRows.join('\n')}

اسم المستفيد,${formData.recipientName}
طريقة الدفع,${formData.paymentMethod === 'bank' ? 'تحويل' : 'نقدي'}
${formData.paymentMethod === 'bank' ? `اسم البنك,${formData.bankName}
رقم الحساب,${formData.accountNumber}` : ''}

استشاري المشاريع,${formData.projectConsultant}
مسؤول المشتريات,${formData.purchasingOfficer}`;

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `طلب_تحويل_مالي_${formData.requestNumber}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const saveInvoice = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Prepare data in the format expected by the API
      const addressProject = formData.entries.map(e => e.entity).filter(Boolean).join('; ') || ' ';
      const amount = formData.entries.map(e => e.amount).filter(Boolean).join('; ') || '0.00';
      
      const invoiceData = {
        requestNumber: formData.requestNumber || '',
        date: formData.date || '',
        purpose: formData.purpose || '',
        addressProject: addressProject,
        amount: amount,
        totalAmount: totalAmount || '0.00',
        recipientName: formData.recipientName || '',
        bankName: formData.bankName || '',
        accountNumber: formData.accountNumber || '',
        paymentMethod: formData.paymentMethod || '',
        projectConsultant: formData.projectConsultant || '',
        purchasingOfficer: formData.purchasingOfficer || '',
        recipientCompany: formData.recipientCompany || '',
      };
      
      console.log('Saving invoice data:', invoiceData);

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (response.ok) {
        setSaveMessage('تم حفظ الفاتورة بنجاح! Invoice saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || JSON.stringify(errorData);
          console.error('Save error response:', errorData);
        } catch (e) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          console.error('Failed to parse error response:', e);
        }
        setSaveMessage(`فشل حفظ الفاتورة. Failed to save invoice. ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      setSaveMessage(`حدث خطأ أثناء الحفظ. An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div className="text-center flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  مولد نموذج طلب التحويل المالي
                </h1>
                <p className="text-gray-600">Financial Transfer Request Form Generator</p>
              </div>
              <Link
                href="/invoices"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors whitespace-nowrap ml-4"
              >
                <List size={20} />
                <span>View Invoices</span>
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الطلب (Request Number)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="requestNumber"
                    value={formData.requestNumber}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    dir="ltr"
                  />
                  <button
                    onClick={() => setFormData(prev => ({...prev, requestNumber: generateRequestNumber()}))}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    title="Generate new number"
                  >
                    🔄
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التاريخ (Date)
                </label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الغرض من التحويل (Purpose)
              </label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                الجهة/مشروع/عنوان و قيمة التحويل (Entity/Project/Address & Transfer Amount)
              </label>
              <div className="space-y-4">
                {formData.entries.map((entry, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">
                        {index + 1}. الجهة/مشروع/عنوان
                      </label>
                      <input
                        type="text"
                        value={entry.entity}
                        onChange={(e) => handleEntryChange(index, 'entity', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        dir="rtl"
                        placeholder="أدخل الجهة/مشروع/عنوان"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        قيمة التحويل
                      </label>
                      <input
                        type="text"
                        value={entry.amount}
                        onChange={(e) => handleEntryChange(index, 'amount', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        dir="ltr"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الإجمالي (Total Amount)
              </label>
              <input
                type="text"
                value={totalAmount}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-semibold"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المستفيد (Beneficiary Name)
              </label>
              <input
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                طريقة الدفع (Payment Method)
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                dir="rtl"
              >
                <option value="bank">تحويل (Bank Transfer)</option>
                <option value="cash">نقدي (Cash)</option>
              </select>
            </div>

            {formData.paymentMethod === 'bank' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم البنك (Bank Name)
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الحساب (Account Number)
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                    dir="ltr"
                  />
                </div>
              </div>
            )}

            <div className="hidden">
              <input type="hidden" name="recipientCompany" value={formData.recipientCompany} />
              <input type="hidden" name="projectConsultant" value={formData.projectConsultant} />
              <input type="hidden" name="purchasingOfficer" value={formData.purchasingOfficer} />
            </div>

            <div className="space-y-4 pt-6">
              {saveMessage && (
                <div className={`p-4 rounded-lg text-center ${
                  saveMessage.includes('نجاح') || saveMessage.includes('successfully')
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {saveMessage}
                </div>
              )}
              
              <div className="flex gap-4">
                <button
                  onClick={saveInvoice}
                  disabled={isSaving}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {isSaving ? 'جاري الحفظ...' : 'Save Invoice'}
                </button>
                
                <button
                  onClick={generatePDF}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FileText size={20} />
                  Download as PDF/HTML
                </button>
                
                <button
                  onClick={generateExcel}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download as Excel/CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Fill in the form fields and click download to generate your document</p>
          <p className="mt-2">املأ حقول النموذج وانقر على التنزيل لإنشاء مستندك</p>
        </div>
      </div>
    </div>
  );
}