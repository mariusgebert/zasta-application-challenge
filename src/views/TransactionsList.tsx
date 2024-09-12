import React, { useContext } from 'react';
import { GlobalStateContext } from '../App';
import Card from '../components/Card';
import { ChevronRight } from 'lucide-react';
import { TransactionType } from '../database/transactions';

function TransactionsList({
  setSelectedTransaction,
}: {
  setSelectedTransaction: React.Dispatch<
    React.SetStateAction<undefined | TransactionType>
  >;
}) {
  const { transactions, invoices } = useContext(GlobalStateContext);

  //currently an invoice can have a key to a transaction. When a transaction is assigned to an invoice,
  //the transactionId will be stored in the invoice doc, linking both together
  //For this small coding challenge querying of transactions with no matching invoice is done in frontend here

  const openTransactions = transactions.filter(
    (transaction) =>
      !invoices.some((invoice) => invoice.transactionId == transaction.id)
  );

  return (
    <div>
      <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 mb-8'>
        Unallocated Transactions
      </h1>
      {openTransactions.map((transaction) => (
        <Card
          onClick={() => setSelectedTransaction(transaction)}
          className='p-6 flex items-center justify-between mb-2 md:mb-4 hover:bg-gray-50 cursor-pointer'
          key={transaction.id}
        >
          <h3 className='font-semibold leading-none tracking-tight'>
            Transaction {transaction.transactionReference}
          </h3>

          <ChevronRight />
        </Card>
      ))}
    </div>
  );
}

export default TransactionsList;
