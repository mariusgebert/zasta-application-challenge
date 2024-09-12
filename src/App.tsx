import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { TransactionType, useTransactions } from './database/transactions';
import { InvoiceType, useInvoices } from './database/invoices';
import TransactionDetailView from './views/TransactionDetailView';
import TransactionsList from './views/TransactionsList';
import { LoaderCircle } from 'lucide-react';
import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './database/firebase';

type GlobalStateType = {
  invoices: InvoiceType[];
  transactions: TransactionType[];
};

//storing fetched data in global context to prevent prop drilling / fetching multiple times
export const GlobalStateContext = React.createContext<GlobalStateType>({
  invoices: [],
  transactions: [],
});

function App() {
  const transactions = useTransactions();
  const invoices = useInvoices();
  const [selectedTransaction, setSelectedTransaction] = useState<
    TransactionType | undefined
  >();

  function renderContent() {
    //currently assuming the database will always return invoices and transactions
    if (invoices.length == 0 || transactions.length == 0) {
      return (
        <div className='flex items-center justify-center my-auto'>
          <LoaderCircle className='animate-spin' />
        </div>
      );
    }

    if (selectedTransaction) {
      return (
        <TransactionDetailView
          transaction={selectedTransaction}
          close={() => setSelectedTransaction(undefined)}
        />
      );
    }

    return <TransactionsList setSelectedTransaction={setSelectedTransaction} />;
  }

  return (
    <GlobalStateContext.Provider value={{ invoices, transactions }}>
      <div className='bg-background/60 min-h-screen w-full flex'>
        <Navbar />
        <main className='flex flex-col items-center justify-center gap-4 pt-14 flex-1'>
          <div className='max-w-7xl p-4 md:p-6 flex-1 w-full flex flex-col'>
            {renderContent()}
          </div>
        </main>
      </div>
    </GlobalStateContext.Provider>
  );
}

export default App;
