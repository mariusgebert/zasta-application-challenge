import React, { useRef } from 'react';
import { File } from 'lucide-react';
import { InvoiceType } from '../database/invoices';

function InvoiceInput({
  selectedInvoice,
  setSelectedInvoice,
}: {
  selectedInvoice: InvoiceType | undefined;
  setSelectedInvoice: React.Dispatch<
    React.SetStateAction<InvoiceType | undefined>
  >;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type === 'application/pdf') {
      //Possible Future Feature: Parse Invoice Data with OCR or create additional information input modal
      //For now take example data
      setSelectedInvoice({
        invoiceId: undefined,
        invoiceReferenceNumber: 'RE-00001',
        recipientFirstName: 'Uwe',
        recipientLastName: 'Upload',
        merchantName: 'Clothing GmbH',
        totalAmountCents: 6781,
      });
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleDropOrSelect = (event) => {
    event.preventDefault();
    const uploadedFile = event.dataTransfer
      ? event.dataTransfer.files[0]
      : event.target.files[0];
    handleFile(uploadedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='flex flex-col gap-4'>
      <div
        className='flex flex-col text-center justify-center gap-8 rounded-lg items-center border-2 hover:bg-gray-100 border-dashed p-8 cursor-pointer'
        onDrop={handleDropOrSelect}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        <File className='size-7' />
        <p className='text-gray-900'>
          Drag and drop any file related to this claim
          <br />
          or{' '}
          <span className='border-b border-b-black font-bold border-dashed'>
            click here to upload
          </span>
        </p>
        <p className='text-gray-400'>.pdf Files only</p>
      </div>
      <input
        ref={fileInputRef}
        id='fileInput'
        type='file'
        accept='.pdf'
        style={{ display: 'none' }}
        onChange={handleDropOrSelect} // Event-Handler hinzugefügt
      />
    </div>
  );
}

export default InvoiceInput;
