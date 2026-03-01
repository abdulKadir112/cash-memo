import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import Container from '../layer/Container';
import Header from './Header';

const BANGLA_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const ENGLISH_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const toBangla = (num) => {
  if (!num && num !== 0) return '';
  return String(num)
    .split('')
    .map(d => BANGLA_DIGITS[ENGLISH_DIGITS.indexOf(d)] || d)
    .join('');
};

const toEnglish = (str) => {
  if (!str) return '';
  return String(str)
    .split('')
    .map(c => {
      const idx = BANGLA_DIGITS.indexOf(c);
      return idx !== -1 ? ENGLISH_DIGITS[idx] : c;
    })
    .join('');
};

const CashMemo = ({ className = "" }) => {
  const [items, setItems] = useState(
    Array.from({ length: 5 }, () => ({ item: '', qty: '', rate: '', amount: '' }))
  );
  const [taxDeduction, setTaxDeduction] = useState('');
  const [lang, setLang] = useState('bn'); // 'bn' or 'en'
  const olRef = useRef(null);
  const lastInputRef = useRef(null);

  const isBn = lang === 'bn';

  const addRow = () => {
    setItems(prev => [...prev, { item: '', qty: '', rate: '', amount: '' }]);
  };

  const handleChange = (index, field, value) => {
    const englishValue = toEnglish(value);

    if (['qty', 'rate', 'amount'].includes(field)) {
      if (value !== '' && !/^\d*\.?\d*$/.test(englishValue)) return;
    }

    const updated = [...items];
    updated[index][field] = englishValue;

    if (field === 'qty' || field === 'rate') {
      const qty = parseFloat(updated[index].qty) || 0;
      const rate = parseFloat(updated[index].rate) || 0;
      updated[index].amount = qty > 0 && rate > 0 ? (qty * rate).toFixed(2) : '';
    }

    setItems(updated);
  };

  const total = items.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
  const deduction = parseFloat(toEnglish(taxDeduction)) || 0;
  const net = total - deduction;

  const format = (val) => (isBn ? toBangla(val) : String(val));

  const downloadAsImage = async () => {
    if (!olRef.current) return;

    try {
      const inputs = olRef.current.querySelectorAll('input');
      inputs.forEach(el => el.classList.add('no-placeholder'));

      const dataUrl = await toPng(olRef.current, {
        quality: 0.92,
        backgroundColor: '#ffffff',
        pixelRatio: window.devicePixelRatio || 2,
      });

      saveAs(dataUrl, 'cash-memo.png');
      inputs.forEach(el => el.classList.remove('no-placeholder'));

      alert(isBn ? 'ইমেজ সফলভাবে সেভ হয়েছে!' : 'Image saved successfully!');
      return dataUrl;
    } catch (err) {
      console.error(err);
      alert(isBn ? 'ইমেজ তৈরি করতে সমস্যা হয়েছে।' : 'Failed to create image.');
    }
  };

  const shareToWhatsApp = async () => {
    const dataUrl = await downloadAsImage();
    if (!dataUrl) return;

    const text = isBn
      ? `নগদ মেমো\nমোট: ${toBangla(total.toFixed(2))} ৳\nনেট: ${toBangla(net.toFixed(2))} ৳`
      : `Cash Memo\nTotal: ${total.toFixed(2)} ৳\nNet: ${net.toFixed(2)} ৳`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    // Note: Most phones won't attach image via wa.me — better to save & share manually
  };

  useEffect(() => {
    if (lastInputRef.current) {
      lastInputRef.current.focus();
    }
  }, [items.length]);

  return (
    <div className={`min-h-screen bg-gray-50 py-5 sm:py-8 ${className}`}>
      <Container className="max-w-3xl mx-auto px-3 sm:px-4 md:px-0">

        {/* Language Toggle */}
        <div className="flex justify-end mb-4 sm:mb-5">
          <button
            onClick={() => setLang(prev => prev === 'bn' ? 'en' : 'bn')}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg shadow hover:shadow-md text-sm sm:text-base transition"
          >
            {isBn ? 'English' : 'বাংলা'}
          </button>
        </div>

        {/* Memo Paper – main printable area */}
        <div
          ref={olRef}
          className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 p-4 sm:p-6 md:p-8"
          style={{ minHeight: '580px' }}
        >
          <Header />

          {/* Items – stacked on very small screens */}
          <div className="mt-5 sm:mt-7 space-y-4 sm:space-y-5">
            {items.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-[2.5rem_1fr_5rem_5.5rem_6.5rem] sm:grid-cols-[2.8rem_1fr_6rem_7rem_8rem] gap-2 sm:gap-4 items-center"
              >
                <div className="text-center font-bold text-gray-700 text-sm sm:text-base">
                  {isBn ? toBangla(i + 1) : i + 1}.
                </div>

                <input
                  ref={i === items.length - 1 ? lastInputRef : null}
                  type="text"
                  placeholder={isBn ? 'পণ্যের নাম' : 'Item name'}
                  value={row.item}
                  onChange={e => handleChange(i, 'item', e.target.value)}
                  className="w-full px-2.5 sm:px-3 py-2.5 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                  type="text"
                  inputMode="decimal"
                  placeholder={isBn ? 'পরিমাণ' : 'Qty'}
                  value={format(row.qty)}
                  onChange={e => handleChange(i, 'qty', e.target.value)}
                  className="w-full px-1.5 sm:px-2 py-2.5 border border-gray-300 rounded-md text-center text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                  type="text"
                  inputMode="decimal"
                  placeholder={isBn ? 'দর' : 'Rate'}
                  value={format(row.rate)}
                  onChange={e => handleChange(i, 'rate', e.target.value)}
                  className="w-full px-1.5 sm:px-2 py-2.5 border border-gray-300 rounded-md text-center text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <div className="px-2 py-2.5 bg-gray-50 rounded-md text-right text-sm sm:text-base font-medium text-green-700">
                  {row.amount ? `${format(row.amount)} ৳` : '—'}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-8 sm:mt-10 border-t-2 border-gray-300 pt-5 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:justify-end sm:items-start gap-5 sm:gap-6">
              <div className="text-right sm:text-right space-y-3 sm:space-y-4 w-full sm:w-auto">
                <div className="font-semibold text-gray-700 text-sm sm:text-base">
                  {isBn ? 'ট্যাক্স / জমা / ছাড় :' : 'Tax / Deduction :'}
                </div>
                <div className="font-bold text-green-700 text-base sm:text-lg">
                  {isBn ? 'মোট মূল্য :' : 'Total Amount :'}
                </div>
                <div className={`font-bold text-lg sm:text-xl ${net < 0 ? 'text-red-600' : 'text-blue-700'}`}>
                  {isBn ? 'নেট মূল্য :' : 'Net Amount :'}
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 w-full sm:w-48 md:w-56">
                <input
                  type="text"
                  inputMode="decimal"
                  value={format(taxDeduction)}
                  onChange={e => setTaxDeduction(toEnglish(e.target.value))}
                  placeholder={isBn ? '০.০০' : '0.00'}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-right font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <div className="px-3 py-2.5 bg-green-50 text-green-800 font-bold text-right rounded-md text-base sm:text-lg">
                  {format(total.toFixed(2))} ৳
                </div>

                <div className={`px-3 py-3 font-bold text-right rounded-md text-lg sm:text-xl ${net < 0 ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-800'}`}>
                  {format(net.toFixed(2))} ৳
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="mt-10 sm:mt-12 flex justify-end">
              <div className="w-44 sm:w-52 h-20 sm:h-24 border-2 border-dashed border-gray-400 rounded flex items-end justify-center pb-3 text-gray-500 text-xs sm:text-sm">
                {isBn ? 'স্বাক্ষর ও সিল' : 'Signature & Seal'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons – stacked on mobile */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={addRow}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-lg font-medium text-base transition shadow-sm"
          >
            {isBn ? '+ আরও পণ্য যোগ করুন' : '+ Add Row'}
          </button>

          <button
            onClick={downloadAsImage}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-lg font-medium text-base transition shadow-sm"
          >
            {isBn ? 'ডাউনলোড (PNG)' : 'Download PNG'}
          </button>

          <button
            onClick={shareToWhatsApp}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-lg font-medium text-base transition shadow-sm"
          >
            {isBn ? 'হোয়াটসঅ্যাপে শেয়ার' : 'Share on WhatsApp'}
          </button>
        </div>
      </Container>

      <style jsx>{`
        .no-placeholder::placeholder {
          color: transparent !important;
        }
        input {
          -webkit-tap-highlight-color: transparent;
        }
        @media (max-width: 400px) {
          .grid-cols-\\[2\\.5rem_1fr_5rem_5\\.5rem_6\\.5rem\\] {
            grid-template-columns: 2.2rem 1fr 4.6rem 5rem 6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CashMemo;