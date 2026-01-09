import Link from "next/link";
import { FileText, List, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <main className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            مولد نموذج طلب التحويل المالي
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Arabic Financial Transfer Request Form Generator
          </p>
          <p className="text-gray-500 mb-12">
            Create, save, and manage your financial transfer request forms
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link
              href="/form-generator"
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col items-center gap-3"
            >
              <FileText size={48} className="group-hover:scale-110 transition-transform" />
              <div className="text-xl">Create New Invoice</div>
              <div className="text-sm opacity-90 flex items-center gap-2">
                Generate form <ArrowRight size={16} />
              </div>
            </Link>

            <Link
              href="/invoices"
              className="group bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col items-center gap-3"
            >
              <List size={48} className="group-hover:scale-110 transition-transform" />
              <div className="text-xl">View Saved Invoices</div>
              <div className="text-sm opacity-90 flex items-center gap-2">
                Browse all <ArrowRight size={16} />
              </div>
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Fill out forms, save them to the database, and download as PDF or Excel
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
