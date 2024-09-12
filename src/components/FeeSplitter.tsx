import React, { useState } from 'react';
import Card from './Card';
import formatCentsToEuroString from '../utils/formatCentsToEuroString';
import { TransactionType } from '../database/transactions';
import cn from 'classnames';
import { FeeType } from '../database/invoices';

function FeeSplitter({
  transaction,
  fees,
  setFees,
}: {
  transaction: TransactionType;
  fees: FeeType;
  setFees: React.Dispatch<React.SetStateAction<FeeType>>;
}) {
  const handleFeeChange = (key: string, value: number) => {
    setFees((prevFees) => ({
      ...prevFees,
      [key]: value,
    }));
  };

  const totalAmount = transaction.transactionAmountCents;
  const totalFees =
    fees.platformFee + fees.paymentProviderFee + fees.logisticsFee;
  const totalPayout = totalAmount - totalFees;

  return (
    <Card>
      <div className='bg-background/50 p-6'>
        <div className='flex items-center justify-between'>
          <h3 className='font-semibold leading-none tracking-tight'>
            Total amount of transaction
          </h3>
          <h3 className='font-semibold leading-none tracking-tight'>
            {formatCentsToEuroString(totalAmount)}
          </h3>
        </div>
      </div>
      <div className='p-6'>
        <h3 className='font-semibold leading-none tracking-tight'>Fees</h3>
        <p className='text-gray-400 text-sm mt-2'>
          Set the fees which will be deducted before the payout to the merchant
        </p>
        <div className='flex flex-col gap-4 mt-4'>
          <FeeInput
            totalAmount={totalAmount}
            label='Platform fee'
            onChange={(value) => handleFeeChange('platformFee', value)}
          />
          <FeeInput
            totalAmount={totalAmount}
            label='Payment provider fee'
            onChange={(value) => handleFeeChange('paymentProviderFee', value)}
          />
          <FeeInput
            totalAmount={totalAmount}
            label='Logistics fee'
            onChange={(value) => handleFeeChange('logisticsFee', value)}
          />
        </div>
        <hr className='my-4' />
        <div
          className={cn(
            'flex justify-between items-center text-gray-400 text-sm',
            { 'text-red-500': totalFees > totalAmount }
          )}
        >
          <p>Total Fees</p>
          <div className='text-right'>
            <p>{formatCentsToEuroString(totalFees)}</p>
            <div className='text-xs'>
              {((totalFees / totalAmount) * 100).toFixed(2)}% of total amount
              paid
            </div>
          </div>
        </div>

        {totalFees > totalAmount && (
          <p className='text-red-500 text-center mt-4'>
            Fees higher than payment!
          </p>
        )}
      </div>
      <div className='bg-background/40 p-6 border-border border-t'>
        <div className='flex items-center justify-between'>
          <h3 className='font-semibold leading-none tracking-tight'>
            Total payout to merchant
          </h3>
          <h3 className='font-semibold leading-none tracking-tight'>
            {formatCentsToEuroString(totalPayout)}
          </h3>
        </div>
      </div>
    </Card>
  );
}

export default FeeSplitter;

function FeeInput({ label, onChange, totalAmount }) {
  const [inputValue, setInputValue] = useState('');

  //Input needs to be parsed into cents to store it in parent state & update the current input State
  const handleInputChange = (e) => {
    const val = e.target.value;
    const centValue = Math.round((Number(val) || 0) * 100);

    setInputValue(val);
    onChange(centValue);
  };

  //Format and round the number when input is blurred
  const handleBlur = () => {
    setInputValue((Number(inputValue) || 0).toFixed(2));
  };

  // Ability to set the fees to company standard fees with one click
  const setPercent = (percent) => {
    const value = ((totalAmount * percent) / 100).toFixed(2);
    setInputValue(value);
    onChange(Math.round(totalAmount * percent));
  };

  return (
    <div className='flex flex-col gap-2'>
      <label className='text-sm text-gray-900'>{label}</label>
      <div className='relative flex items-center'>
        <input
          type='number'
          placeholder='0,00'
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className='border rounded-lg shadow p-2 pr-8 outline-none focus:ring-slate-700 focus:ring-1 w-full'
        />
        <span className='absolute right-3 text-gray-400 top-1/2 -translate-y-1/2'>
          €
        </span>
      </div>
      <div className='flex items-center gap-2'>
        {[0.0275, 0.053, 0.074].map((percent) => (
          <button
            key={percent}
            onClick={() => setPercent(percent)}
            className={cn(
              'cursor-pointer p-1 text-xs bg-gray-100 rounded-md border border-border',
              {
                'bg-gray-800 text-gray-50 border-black':
                  Math.round(Number(inputValue) * 100) ===
                  Math.round(totalAmount * percent),
              }
            )}
          >
            {`${(percent * 100).toFixed(1)}%`}
          </button>
        ))}
      </div>
    </div>
  );
}
