import React, { useState } from 'react';
import cn from 'classnames';
import {
  addInvoice,
  FeeType,
  InvoiceType,
  updateInvoice,
} from '../database/invoices';
import { TransactionType } from '../database/transactions';
import formatCentsToEuroString from '../utils/formatCentsToEuroString';
import { LoaderCircle } from 'lucide-react';

function ConfirmationModal({
  closeModal,
  selectedInvoice,
  transaction,
  fees,
}: {
  closeModal: () => void;
  fees: FeeType;
  transaction: TransactionType;
  selectedInvoice: InvoiceType;
}) {
  const [loading, setLoading] = useState(false);
  const {
    senderFirstName,
    senderLastName,
    transactionReference,
    transactionDate,
    paymentMethod,
    transactionAmountCents,
  } = transaction;

  const {
    invoiceReferenceNumber,
    totalAmountCents,
    recipientFirstName,
    recipientLastName,
    merchantName,
  } = selectedInvoice;

  const { platformFee, paymentProviderFee, logisticsFee } = fees;

  const payoutToMerchant =
    transactionAmountCents - platformFee - paymentProviderFee - logisticsFee;

  const submitChanges = async () => {
    //If an Invoice is uploaded, it will not contain an id (because it is not in the database yet), thus we will add a new doc to db if invoideId is undefined
    //In a real application the user would be able to upload invoices in an extra interface, while simultaneously storing them in the database
    setLoading(true);
    if (selectedInvoice.invoiceId === undefined) {
      if (
        await addInvoice({
          ...selectedInvoice,
          fees: fees,
          transactionId: transaction.id,
        } as InvoiceType & {
          invoiceId: undefined;
        })
      ) {
        setLoading(false);
        window.location.href = '/';
      }
    } else {
      if (
        await updateInvoice({
          ...selectedInvoice,
          fees: fees,
          transactionId: transaction.id,
        } as InvoiceType & {
          invoiceId: string;
        })
      ) {
        setLoading(false);
        window.location.href = '/';
      }
    }
  };

  return (
    <div className='fixed inset-0 flex flex-col items-end justify-center bg-black/60 z-10 p-2 md:p-6 blend-in blend-in'>
      <div className='flex-1 w-full flex flex-col gap-8 max-w-md bg-white rounded-lg overflow-y-auto shadow-lg p-4 md:p-6 slide-in-right'>
        <div>
          <h3 className='text-lg font-bold leading-none tracking-tight'>
            Review changes
          </h3>
          <p className='text-gray-500 text-sm mt-2'>
            Please review your changes before submitting the data to our live
            database.
          </p>
        </div>

        <div>
          <h3 className='text-base font-semibold leading-none tracking-tight'>
            Transaction Details
          </h3>
          <div className='flex flex-col gap-2 mt-4'>
            <DetailRow
              label='Sender'
              value={`${senderFirstName} ${senderLastName}`}
            />
            <DetailRow label='Ref. No.' value={transactionReference} />
            <DetailRow
              label='Date'
              value={transactionDate.toDate().toLocaleDateString()}
            />
            <DetailRow label='Payment Method' value={paymentMethod} />
          </div>
        </div>

        <hr className='border-gray-400' />

        <div>
          <h3 className='text-base font-semibold leading-none tracking-tight'>
            Amount & Fees
          </h3>
          <div className='flex flex-col gap-2 border p-4 rounded-lg mt-4'>
            <DetailRow
              label='Total'
              value={formatCentsToEuroString(transactionAmountCents)}
            />
            <hr className='my-2' />
            <DetailRow
              label='Platform fee'
              value={`-${formatCentsToEuroString(platformFee)}`}
              muted
            />
            <DetailRow
              label='Payment Provider Fee'
              value={`-${formatCentsToEuroString(paymentProviderFee)}`}
              muted
            />
            <DetailRow
              label='Logistics fee'
              value={`-${formatCentsToEuroString(logisticsFee)}`}
              muted
            />
            <hr className='my-2' />
            <DetailRow
              label='Payout to Merchant'
              value={formatCentsToEuroString(payoutToMerchant)}
              bold
            />
          </div>
        </div>

        <hr className='border-gray-400' />

        <div>
          <h3 className='text-base font-semibold leading-none tracking-tight'>
            Invoice Details
          </h3>
          <div className='flex flex-col gap-2 mt-4'>
            <DetailRow
              label='Invoice Number'
              value={invoiceReferenceNumber}
              muted
            />
            <DetailRow
              label='Invoice amount'
              value={formatCentsToEuroString(totalAmountCents)}
              muted
            />
            <DetailRow
              label='Recipient'
              value={`${recipientFirstName} ${recipientLastName}`}
              muted
            />
            <DetailRow label='Merchant' value={merchantName} muted />
          </div>
        </div>

        <div className='mt-auto'>
          <hr className='border-gray-400' />
          <div className='flex justify-between items-center mt-4'>
            <button
              onClick={closeModal}
              className='text-gray-500 hover:text-gray-700'
            >
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={submitChanges}
              className='flex items-center w-40 justify-center rounded-md text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 hover:bg-slate-900/90 h-10 px-4 py-2 text-slate-50'
            >
              {loading ? (
                <LoaderCircle className='size-4 text-gray-50 animate-spin' />
              ) : (
                'Submit Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, muted = false, bold = false }) {
  return (
    <div className='flex justify-between items-center'>
      <p
        className={cn(
          'text-sm',
          { 'text-gray-500': muted },
          { 'font-semibold': bold }
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          'text-sm',
          { 'text-gray-500': muted },
          { 'font-semibold': bold }
        )}
      >
        {value}
      </p>
    </div>
  );
}

export default ConfirmationModal;
