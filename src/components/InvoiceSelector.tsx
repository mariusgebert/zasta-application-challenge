import React, { useCallback, useContext, useEffect, useState } from 'react';
import Card from './Card';
import { Command, File, User } from 'lucide-react';
import SearchModal from './SearchModal';
import { GlobalStateContext } from '../App';
import { InvoiceType } from '../database/invoices';
import { TransactionType } from '../database/transactions';
import InvoiceInput from './InvoiceInput';
import formatCentsToEuroString from '../utils/formatCentsToEuroString';

function InvoiceSelector({
  transaction,
  selectedInvoice,
  setSelectedInvoice,
}: {
  transaction: TransactionType;
  selectedInvoice: InvoiceType | undefined;
  setSelectedInvoice: React.Dispatch<
    React.SetStateAction<InvoiceType | undefined>
  >;
}) {
  const { invoices } = useContext(GlobalStateContext);
  const [showSearchModal, setShowSearchModal] = useState(false);

  //enable opening/closing  the search modal with  cmd+k shortcut and Esc key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'k' && e.metaKey) {
      setShowSearchModal((prev) => !prev);
    }

    if (e.key == 'Escape') setShowSearchModal(false);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  //simple rating to check how good an invoice matches a transaction
  //for every match in firstName, lastName or Amount with a transaction
  //the  invoice will get 1 point. Invoices are then sorted by matchingScore
  function getSuggestedInvoices(
    invoices: InvoiceType[],
    transaction: TransactionType
  ): InvoiceType[] {
    const scoredInvoices = invoices.map((invoice) => {
      let matchingScore = 0;
      if (invoice.recipientFirstName === transaction.senderFirstName) {
        matchingScore += 1;
      }
      if (invoice.recipientLastName === transaction.senderLastName) {
        matchingScore += 1;
      }
      if (invoice.totalAmountCents === transaction.transactionAmountCents) {
        matchingScore += 1;
      }
      return { ...invoice, matchingScore };
    });

    scoredInvoices.sort((a, b) => b.matchingScore - a.matchingScore);

    //remove matchingScore before returning the array
    return scoredInvoices
      .slice(0, 4)
      .map(({ matchingScore, ...invoice }) => invoice);
  }

  return (
    <Card className='p-6'>
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between'>
          <h3 className='font-semibold leading-none tracking-tight'>
            Suggested Invoices
          </h3>
          <button
            onClick={() => setShowSearchModal(true)}
            className='flex items-center gap-2 text-gray-400 border-b border-dashed text-sm'
          >
            Search invoices{' '}
            <span className='hidden md:flex'>
              (
              <span className='flex items-center gap-1 justify-center border rounded px-2 text-xs '>
                <Command className='size-3' />
                <p>K</p>
              </span>
              )
            </span>
          </button>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  gap-4'>
          {getSuggestedInvoices(invoices, transaction).map((invoice) => (
            <div
              key={invoice.invoiceId}
              className='flex flex-col justify-between border border-border rounded-lg p-4 aspect-square cursor-pointer hover:border-gray-400 hover:bg-gray-50'
              onClick={() => setSelectedInvoice(invoice)}
            >
              <File className='size-5' />
              <div className='mt-top'>
                <p>{invoice.invoiceReferenceNumber}</p>
                <div className='flex items-center gap-1 text-sm text-gray-400'>
                  <User className='size-4' />
                  <p>
                    {invoice.recipientFirstName} {invoice.recipientLastName}
                  </p>
                </div>
                <p className='text-sm mt-1 text-gray-400'>
                  ({formatCentsToEuroString(invoice.totalAmountCents)})
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='flex items-center justify-center gap-4 my-4'>
        <div className='h-[1px] bg-border flex-1' />
        <p className='text-gray-400'>or upload new invoice</p>
        <div className='h-[1px] bg-border flex-1' />
      </div>
      <InvoiceInput
        selectedInvoice={selectedInvoice}
        setSelectedInvoice={setSelectedInvoice}
      />
      {showSearchModal && (
        <SearchModal
          selectedInvoice={selectedInvoice}
          setSelectedInvoice={setSelectedInvoice}
          closeModal={() => setShowSearchModal(false)}
        />
      )}
    </Card>
  );
}

export default InvoiceSelector;
