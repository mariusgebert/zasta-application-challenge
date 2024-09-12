import { Search, X, File, User } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { GlobalStateContext } from '../App';
import { InvoiceType } from '../database/invoices';
import formatCentsToEuroString from '../utils/formatCentsToEuroString';

function SearchModal({
  closeModal,
  selectedInvoice,
  setSelectedInvoice,
}: {
  closeModal: () => void;
  selectedInvoice: InvoiceType | undefined;
  setSelectedInvoice: React.Dispatch<
    React.SetStateAction<InvoiceType | undefined>
  >;
}) {
  const { invoices } = useContext(GlobalStateContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter((invoice) => {
    const searchLower = searchTerm.toLowerCase().trim();
    const fullName =
      `${invoice.recipientFirstName} ${invoice.recipientLastName}`.toLowerCase();

    return (
      invoice.invoiceReferenceNumber.toLowerCase().includes(searchLower) ||
      fullName.includes(searchLower)
    );
  });

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/80 z-10 blend-in'>
      <div className='bg-white rounded-lg pt-1 max-w-lg w-full relative slide-in-bottom'>
        <div className='flex items-center border-b px-3 gap-2 '>
          <Search className='size-4 text-gray-500' />
          <input
            autoFocus
            placeholder='Search for name or reference number...'
            className='h-10 flex flex-1 py-3 text-sm outline-none'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={closeModal}
          className='absolute right-4 top-4 opacity-70 '
        >
          <X className='size-4' />
        </button>

        <div className='max-h-[300px] overflow-y-auto overflow-x-hidden px-2 py-4'>
          {filteredInvoices.map((invoice) => (
            <div
              key={invoice.invoiceId}
              onClick={() => {
                setSelectedInvoice(invoice);
                closeModal();
              }}
              className='relative flex items-center gap-4 rounded-md px-2 py-4 text-sm outline-none hover:bg-gray-100 cursor-pointer'
            >
              <div className='flex items-center gap-2'>
                <File className='size-5' />
                <p className='text-gray-900'>
                  {invoice.invoiceReferenceNumber}
                </p>
              </div>
              <div className='flex items-center gap-1 text-gray-400'>
                <User className='size-4' />
                <p className=''>
                  {invoice.recipientFirstName} {invoice.recipientLastName}
                </p>
              </div>
              <p className='ml-auto'>
                {formatCentsToEuroString(invoice.totalAmountCents)}
              </p>
            </div>
          ))}
          {filteredInvoices.length == 0 && (
            <div className='text-center text-gray-400 my-4'>
              No invoices found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
