'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useCustomer } from '@/hooks/useCustomer';
import { shareTransactionService, SharePurchase } from '@/services/shareTransactions.service';
import { useSharePurchases } from '@/hooks/useSharePurchases';
import { Button } from '@/components/ui';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import Image from 'next/image';

export default function ShareCertificatePreview() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const customerId = params?.id as string;
  const transactionId = searchParams?.get('transactionId');
  
  const { customer, loading: customerLoading } = useCustomer(customerId);
  const { sharePurchases, loading: sharesLoading } = useSharePurchases(customerId);
  const [selectedPurchase, setSelectedPurchase] = useState<SharePurchase | null>(null);
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter approved/completed purchases
  const approvedPurchases = sharePurchases.filter(
    sp => sp.approvalStatus === 'Approved' || sp.status === 'Completed'
  );

  // Find the specific share purchase if transactionId is provided
  useEffect(() => {
    if (sharePurchases.length > 0) {
      let purchase: SharePurchase | undefined;
      let index = 0;
      
      if (transactionId) {
        purchase = sharePurchases.find(
          sp => sp.id === transactionId || 
          sp.transactionReference === transactionId || 
          sp.certificateNumber === transactionId
        );
        if (purchase) {
          index = approvedPurchases.findIndex(sp => 
            sp.id === purchase!.id || 
            sp.transactionReference === purchase!.transactionReference || 
            sp.certificateNumber === purchase!.certificateNumber
          );
        }
      } else {
        // Get the most recent approved/completed purchase
        purchase = approvedPurchases[0] || sharePurchases[0];
        index = 0;
      }
      
      setSelectedPurchase(purchase || sharePurchases[0]);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, [sharePurchases, transactionId, approvedPurchases]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevPurchase = approvedPurchases[currentIndex - 1];
      setCurrentIndex(currentIndex - 1);
      setSelectedPurchase(prevPurchase);
      router.push(`/customers/${customerId}/pdf-preview?transactionId=${prevPurchase.id || prevPurchase.transactionReference || prevPurchase.certificateNumber}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < approvedPurchases.length - 1) {
      const nextPurchase = approvedPurchases[currentIndex + 1];
      setCurrentIndex(currentIndex + 1);
      setSelectedPurchase(nextPurchase);
      router.push(`/customers/${customerId}/pdf-preview?transactionId=${nextPurchase.id || nextPurchase.transactionReference || nextPurchase.certificateNumber}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Auto-trigger print dialog when page loads
  useEffect(() => {
    if (mounted && !customerLoading && !sharesLoading && selectedPurchase) {
      // Small delay to ensure content is rendered
      const timer = setTimeout(() => {
        window.print();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [mounted, customerLoading, sharesLoading, selectedPurchase]);

  // Also listen for Ctrl+P keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        window.print();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (customerLoading || sharesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-neutral-500">Loading certificate...</p>
      </div>
    );
  }

  if (!customer || !selectedPurchase) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-neutral-500">Certificate not found</p>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const purchaseDate = selectedPurchase.purchaseDate
    ? new Date(selectedPurchase.purchaseDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : currentDate;

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body {
            margin: 0;
            padding: 0;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .certificate-container {
            page-break-after: auto;
            page-break-inside: avoid;
            margin: 0;
            padding: 2rem;
          }
          .certificate-container img {
            max-width: 300px;
            height: auto;
            display: block;
          }
          @page {
            margin: 0;
            size: A4 landscape;
          }
        }
        @media screen {
          body {
            background: #f5f5f5;
          }
          .certificate-container {
            max-width: 1200px;
            margin: 20px auto;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
        }
      `}</style>

      {/* Navigation Bar (hidden in print) */}
      <div className="no-print bg-white border-b border-neutral-200 p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/customers/${customerId}`)}
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customer
            </Button>
            <div className="text-sm text-neutral-600">
              Certificate {currentIndex + 1} of {approvedPurchases.length}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentIndex >= approvedPurchases.length - 1}
              size="sm"
            >
              Next
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
            </Button>
            <Button
              variant="primary"
              onClick={handlePrint}
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Print/Download PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="certificate-container bg-white p-12 min-h-screen">
        {/* Certificate Border */}
        <div className="border-4 border-neutral-800 p-12 min-h-[600px] flex flex-col">
          {/* Header with Logo */}
          <div className="mb-8">
            <div className="flex flex-col items-center justify-center gap-6 mb-6">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Image
                  src="/jansevalogo.jpg"
                  alt="Janseva Logo"
                  width={300}
                  height={120}
                  className="object-contain"
                  priority
                />
              </div>
              {/* Certificate Title and Company Name */}
              <div className="flex flex-col text-center">
                <h1 className="text-4xl font-bold text-neutral-900 mb-2">
                  SHARE CERTIFICATE
                </h1>
                <p className="text-xl text-neutral-700 font-semibold">
                  Janseva Private Limited
                </p>
                <p className="text-sm text-neutral-600 mt-2">
                  (A Company Incorporated under the Companies Act, 2013)
                </p>
              </div>
            </div>
          </div>

          {/* Certificate Number */}
          <div className="text-right mb-6">
            <p className="text-sm font-medium text-neutral-700">
              Certificate No: <span className="font-bold">{selectedPurchase.certificateNumber || selectedPurchase.transactionReference || selectedPurchase.id}</span>
            </p>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Certificate Text */}
            <div className="text-center space-y-4">
              <p className="text-base leading-relaxed text-neutral-800">
                This is to certify that <span className="font-bold text-lg">{customer.fullName}</span>
              </p>
              <p className="text-base leading-relaxed text-neutral-800">
                {customer.addressLine1 && (
                  <>
                    residing at <span className="font-semibold">{customer.addressLine1}</span>
                    {customer.city && <>, {customer.city}</>}
                    {customer.state && <>, {customer.state}</>}
                    {customer.postalCode && <> - {customer.postalCode}</>}
                  </>
                )}
              </p>
            </div>

            {/* Share Details Box */}
            <div className="border-2 border-neutral-300 p-6 bg-neutral-50 my-8">
              <div className="text-center space-y-3">
                <p className="text-lg font-semibold text-neutral-900">
                  is the registered holder of
                </p>
                <div className="text-4xl font-bold text-neutral-900 my-4">
                  {selectedPurchase.quantity || selectedPurchase.numberOfShares} Shares
                </div>
                <p className="text-base text-neutral-700">
                  of ₹<span className="font-bold text-lg">{selectedPurchase.pricePerShare.toLocaleString('en-IN')}</span> each
                </p>
                <p className="text-base text-neutral-700 mt-2">
                  fully paid up Equity Shares
                </p>
              </div>
            </div>

            {/* Amount and Date */}
            <div className="grid grid-cols-2 gap-8 my-8">
              <div className="text-center">
                <p className="text-sm text-neutral-600 mb-1">Total Amount</p>
                <p className="text-xl font-bold text-neutral-900">
                  ₹{selectedPurchase.totalAmount.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-neutral-600 mb-1">Date of Purchase</p>
                <p className="text-xl font-bold text-neutral-900">
                  {purchaseDate}
                </p>
              </div>
            </div>

            {/* Certificate Statement */}
            <div className="border-t-2 border-b-2 border-neutral-300 py-6 my-8">
              <p className="text-sm text-neutral-700 leading-relaxed text-center">
                This certificate is issued subject to the provisions of the Articles of Association of the Company 
                and the Companies Act, 2013. The shares represented by this certificate are transferable only in 
                accordance with the provisions of the said Act and the Articles of Association of the Company.
              </p>
            </div>
          </div>

          {/* Signatures Section */}
          <div className="mt-12 grid grid-cols-2 gap-12">
            <div className="text-center">
              <div className="border-t-2 border-neutral-800 pt-2 mt-16">
                <p className="text-sm font-semibold text-neutral-900">Director</p>
                <p className="text-xs text-neutral-600 mt-1">Janseva Private Limited</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t-2 border-neutral-800 pt-2 mt-16">
                <p className="text-sm font-semibold text-neutral-900">Director</p>
                <p className="text-xs text-neutral-600 mt-1">Janseva Private Limited</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-4 border-t border-neutral-300">
            <p className="text-xs text-neutral-500">
              Generated on: {currentDate}
            </p>
          </div>
        </div>

        {/* Print Instructions (hidden in print) */}
        <div className="no-print mt-8 text-center">
          <p className="text-sm text-neutral-600">
            The print dialog will open automatically. Press <kbd className="px-2 py-1 bg-neutral-200 rounded text-xs">Ctrl+P</kbd> to print or download as PDF.
          </p>
        </div>
      </div>
    </>
  );
}

