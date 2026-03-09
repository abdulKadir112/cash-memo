import React from 'react';

const Header = ({
  customerName = "",
  setCustomerName = () => {},
  customerMobile = "",
  setCustomerMobile = () => {},
  customerAddress = "",
  setCustomerAddress = () => {},
  serialNumber = 1
}) => {
  const today = new Date();

  const toBanglaNumber = (number) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return number.toString().replace(/\d/g, (digit) => banglaDigits[digit]);
  };

  const day   = toBanglaNumber(today.getDate().toString().padStart(2, "0"));
  const month = toBanglaNumber((today.getMonth() + 1).toString().padStart(2, "0"));
  const year  = toBanglaNumber(today.getFullYear());

  const displaySerial = toBanglaNumber(serialNumber.toString().padStart(6, '0'));

  return (
    <div className='pb-2 md:pb-2'>

      {/* Top Line */}
      <div className='flex justify-between pt-2.5 px-3'>
        <p className='text-center text-[10px] md:text-sm font-normal text-blue-600 tracking-widest'>আপনার প্রয়োজন</p>
        <p className='text-center text-[10px] md:text-sm font-normal text-blue-600 tracking-widest'>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
        <p className='text-center text-[10px] md:text-sm font-normal text-blue-600 tracking-widest'>আমাদের অঙ্গীকার</p>
      </div>

      {/* Company Name */}
      <div className='flex justify-center shadow-lg md:py-4 py-2'>
        <h1 className='font-bold text-blue-600 text-xl md:text-4xl'>
          ভিশন ফ্লো সার্ভিসেস লিমিটেড
        </h1>
      </div>

      {/* Customer + Company Info */}
      <div className='flex justify-between bg-[#9b9b9b2c] shadow-md px-3 py-2'>
        <div className='flex items-center gap-x-2 md:gap-x-5'>
          <div className='flex flex-col gap-y-2 md:gap-y-5 md:text-bold text-blue-600'>
            <label className='text-[12px] md:text-base'>নাম:</label>
            <label className='text-[12px] md:text-base'>মোবাইল:</label>
            <label className='text-[12px] md:text-base'>ঠিকানা:</label>
          </div>

          <div className='w-24 md:w-60 flex flex-col items-center gap-x-2'>
            <input 
              type="text" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="ক্রেতার নাম"
              className='w-full md:text-base text-[12px] px-1 md:px-3 md:py-1 bg-transparent outline-none border-b-2 border-[#7c7c7c5c] border-dashed' 
            />
            <input 
              type="tel" 
              value={customerMobile}
              onChange={(e) => setCustomerMobile(e.target.value)}
              placeholder="মোবাইল নম্বর"
              className='w-full text-[12px] md:text-base md:px-3 md:py-1 bg-transparent outline-none border-b-2 border-[#7c7c7c5c] border-dashed' 
            />
            <input 
              type="text" 
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="ঠিকানা (ঐচ্ছিক)"
              className='w-full px-1 md:px-3 md:py-1 text-[12px] md:text-base bg-transparent outline-none border-b-2 border-[#7c7c7c5c] border-dashed' 
            />
          </div>
        </div>

        <div className='w-80 text-end'>
          <p className='font-semibold text-blue-600 text-[12px] md:text-lg'>
            হেমায়েতপুর বটতলা বাজার, দামুড়হুদা, চুয়াডাঙ্গা
          </p>
          <p className='md:font-bold text-sm md:text-lg text-blue-400'>
            মোবাইল: ০১৭২৯-৬২৮৪০২
          </p>
          <p className='md:font-bold text-sm md:text-lg text-blue-400'>
            ফ্যাক্স: ০১৯১৪-৬৬৫৯৪৬
          </p>
          <p className='md:font-bold text-[10px] md:text-sm text-blue-400'>
            ওয়েবসাইট: www.example.com
          </p>
        </div>
      </div>

      {/* Serial + Date */}
      <div className='flex justify-between items-center py-1 px-3'>
        <div>
          <p className='md:text-lg text-[12px] font-semibold text-blue-600 md:font-bold'>
            সিরিয়াল নং: <span className='font-semibold'>{displaySerial}</span>
          </p>
        </div>

        <div className='flex'>
          <div className='w-7 md:w-10 h-5 md:h-8 text-blue-600 text-[10px] md:text-base border border-r-transparent border-[#7c7c7c] flex justify-center items-center'>
            {day}
          </div>
          <div className='w-7 md:w-10 h-5 md:h-8 text-blue-600 text-[10px] md:text-base border border-[#7c7c7c] flex justify-center items-center'>
            {month}
          </div>
          <div className='w-10 md:w-20 h-5 md:h-8 text-blue-600 text-[10px] md:text-base border border-l-transparent border-[#7c7c7c] flex justify-center items-center'>
            {year}
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className='mt-1 text-[12px] md:text-xl text-center text-slate-100 bg-blue-500 py-1 md:py-2 shadow-lg'>
        নগদ রসিদ
      </h1>

    </div>
  );
};

export default Header;