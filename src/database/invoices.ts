import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './firebase';

export type FeeType = {
  platformFee: number;
  paymentProviderFee: number;
  logisticsFee: number;
};

export type InvoiceType = {
  invoiceId: string | undefined; //the id in the database, undefined if invoice is not in database
  invoiceReferenceNumber: string;
  recipientFirstName: string;
  recipientLastName: string;
  merchantName: string;
  totalAmountCents: number;
  transactionId?: string;
  fees?: FeeType; //Fee splits are currently stored within invoice, depending on use case it could be better to store the fees inside the transaction doc
};

//Real time data fetching of invoice data, so multiple exmployees could use the application at once
export const useInvoices = () => {
  const [invoices, setInvoices] = useState<InvoiceType[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'invoices'), (snapshot) => {
      const updatedInvoices = snapshot.docs.map((doc) => ({
        ...(doc.data() as InvoiceType),
        invoiceId: doc.id,
      }));
      setInvoices(updatedInvoices);
    });

    return () => unsubscribe();
  }, []);

  return invoices;
};

//Update the data of an existing invoice in the database
export const updateInvoice = async (
  invoice: InvoiceType & { invoiceId: string }
) => {
  try {
    const { invoiceId, ...invoiceData } = invoice;
    const docRef = doc(collection(db, 'invoices'), invoiceId);

    await updateDoc(docRef, invoiceData);

    return true;
  } catch (error) {
    console.error('Error while updating invoice doc:', error);
    return false;
  }
};

//Create a new doc for an invoice when user uploads new invoice
export const addInvoice = async (
  invoice: InvoiceType & { invoiceId: undefined }
) => {
  try {
    const { invoiceId, ...invoiceData } = invoice;
    const docRef = await addDoc(collection(db, 'invoices'), invoiceData);

    return true;
  } catch (error) {
    console.error('Error while adding invoice doc:', error);
    return false;
  }
};
