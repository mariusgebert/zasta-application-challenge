import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './firebase';

export type TransactionType = {
  id: string;
  senderFirstName: string;
  senderLastName: string;
  transactionReference: string;
  transactionDate: Timestamp;
  paymentMethod: 'PayPal' | 'Card' | 'Bank Transfer' | 'Cash';
  transactionAmountCents: number;
};

//Real time data fetching of transaction data, so multiple exmployees could use the application at once
export const useTransactions = () => {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'transactions'),
      (snapshot) => {
        const updatedTransactions = snapshot.docs.map((doc) => ({
          ...(doc.data() as TransactionType),
          id: doc.id,
        }));
        setTransactions(updatedTransactions);
      }
    );

    return () => unsubscribe();
  }, []);

  return transactions;
};
