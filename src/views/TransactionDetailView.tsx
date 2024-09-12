import { ChevronLeft, Hash, ReceiptEuro, User, X } from 'lucide-react';
import React, { useState } from 'react';
import Card from '../components/Card';
import FeeSplitter from '../components/FeeSplitter';
import InvoiceSelector from '../components/InvoiceSelector';
import { TransactionType } from '../database/transactions';
import ConfirmationModal from '../components/ConfirmationModal';
import { FeeType, InvoiceType } from '../database/invoices';
import formatCentsToEuroString from '../utils/formatCentsToEuroString';

function TransactionDetailView({
  transaction,
  close,
}: {
  close: () => void;
  transaction: TransactionType;
}) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<
    InvoiceType | undefined
  >();
  const [fees, setFees] = useState<FeeType>({
    platformFee: 0,
    paymentProviderFee: 0,
    logisticsFee: 0,
  });
  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <button
            onClick={close}
            className='h-7 w-7 border rounded-md flex items-center justify-center bg-white hover:bg-gray-50 shadow'
          >
            <ChevronLeft className='h-4 w-4' />
          </button>
          <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
            Allocate Transaction
          </h1>
        </div>
        <button
          onClick={() => setShowConfirmationModal(true)}
          disabled={
            !selectedInvoice ||
            fees.logisticsFee + fees.paymentProviderFee + fees.platformFee >
              transaction.transactionAmountCents
          }
          className='flex items-center justify-center rounded-md text-sm font-medium  disabled:opacity-50 bg-slate-900 hover:bg-slate-900/90 h-10 px-4 py-2 text-slate-50 z-0'
        >
          Save Changes
        </button>
      </div>
      <div className='w-full grid grid-cols-1 md:grid-cols-5 mt-4 gap-4 lg:gap-8'>
        <div className='grid grid-cols-1 md:col-span-3 gap-4 auto-rows-max'>
          <Card className='p-6 '>
            <h3 className='font-semibold leading-none tracking-tight'>
              Transaction details
            </h3>
            <div className='flex gap-8 mt-6 overflow-x-auto'>
              <div className='flex flex-col'>
                <p className='text-xs text-gray-400'>SENDER</p>
                <p>
                  {transaction.senderFirstName} {transaction.senderLastName}
                </p>
              </div>
              <div className='flex flex-col'>
                <p className='text-xs text-gray-400'>REF. NO</p>
                <p>{transaction.transactionReference}</p>
              </div>
              <div className='flex flex-col'>
                <p className='text-xs text-gray-400'>DATE</p>
                <p>
                  {transaction.transactionDate.toDate().toLocaleDateString()}
                </p>
              </div>
              <div className='flex flex-col'>
                <p className='text-xs text-gray-400'>METHOD</p>
                <p>{transaction.paymentMethod}</p>
              </div>
              <div className='flex flex-col'>
                <p className='text-xs text-gray-400'>INVOICE</p>
                {selectedInvoice ? (
                  <p>{selectedInvoice.invoiceReferenceNumber}</p>
                ) : (
                  <p className=' text-orange-700'>Missing</p>
                )}
              </div>
            </div>
          </Card>
          {selectedInvoice ? (
            <Card className='slide-in-bottom'>
              <div className='bg-background/30 flex items-center justify-between p-6'>
                <div>
                  <h3 className='font-semibold leading-none tracking-tight'>
                    Selected Invoice
                  </h3>
                  <div className='flex items-center gap-4 mt-2'>
                    <div className='flex items-center gap-1 text-gray-400'>
                      <Hash className='size-4' />
                      <p>{selectedInvoice.invoiceReferenceNumber}</p>
                    </div>
                    <div className='flex items-center gap-1 text-gray-400'>
                      <User className='size-4' />
                      <p>
                        {selectedInvoice.recipientFirstName}{' '}
                        {selectedInvoice.recipientLastName}
                      </p>
                    </div>
                    <div className='flex items-center gap-1 text-gray-400'>
                      <ReceiptEuro className='size-4' />
                      <p>
                        {formatCentsToEuroString(
                          selectedInvoice.totalAmountCents
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <X
                  className='size-5 text-gray-600 hover:text-gray-900 cursor-pointer '
                  onClick={() => setSelectedInvoice(undefined)}
                />
              </div>
            </Card>
          ) : (
            <InvoiceSelector
              selectedInvoice={selectedInvoice}
              setSelectedInvoice={setSelectedInvoice}
              transaction={transaction}
            />
          )}
        </div>
        <div className='grid grid-cols-1 md:col-span-2 gap-4 auto-rows-max'>
          <FeeSplitter
            transaction={transaction}
            fees={fees}
            setFees={setFees}
          />
        </div>
        {showConfirmationModal && selectedInvoice && (
          <ConfirmationModal
            fees={fees}
            selectedInvoice={selectedInvoice}
            transaction={transaction}
            closeModal={() => setShowConfirmationModal(false)}
          />
        )}
      </div>
    </>
  );
}

export default TransactionDetailView;
