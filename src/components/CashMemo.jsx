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

    // Allow only numbers + decimal in numeric fields
    if (['qty', 'rate', 'amount'].includes(field)) {
      if (value !== '' && !/^\d*\.?\d*$/.test(englishValue)) return;
    }

    const updated = [...items];
    updated[index][field] = englishValue;

    // Auto-calculate amount
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

  const format = (val) => (isBn ? toBangla(val) : val);

  const downloadAsImage = async () => {
    if (!olRef.current) return;

    try {
      // Temporarily hide placeholders for clean image
      const inputs = olRef.current.querySelectorAll('input');
      inputs.forEach(el => el.classList.add('no-placeholder'));

      const dataUrl = await toPng(olRef.current, {
        quality: 0.95,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
      });

      saveAs(dataUrl, 'cash-memo.png');

      // Restore
      inputs.forEach(el => el.classList.remove('no-placeholder'));

      alert(isBn ? 'ইমেজ সফলভাবে সেভ হয়েছে!' : 'Image saved successfully!');
      
      return dataUrl; // for WhatsApp share
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
    const encodedImage = encodeURIComponent(dataUrl);

    window.open(`https://wa.me/?text=${encodedText}%0A${encodedImage}`, '_blank');
  };

  // Auto focus last row's item input when adding new row
  useEffect(() => {
    if (lastInputRef.current) {
      lastInputRef.current.focus();
    }
  }, [items.length]);

  return (
    <div className={`min-h-screen bg-gray-50 py-6 ${className}`}>
      <Container className="max-w-2xl mx-auto px-3 md:px-0">

        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLang(prev => prev === 'bn' ? 'en' : 'bn')}
            className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            {isBn ? 'English' : 'বাংলা'}
          </button>
        </div>

        {/* Memo Paper */}
        <div
          ref={olRef}
          className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200 p-5 md:p-8"
          style={{ minHeight: '600px' }}
        >
          <Header />

          {/* Items Table */}
          <div className="mt-6 space-y-3">
            {items.map((row, i) => (
              <div key={i} className="flex items-center gap-2 md:gap-4">
                <div className="w-8 md:w-10 text-center font-bold text-gray-700">
                  {isBn ? toBangla(i + 1) : i + 1}.
                </div>

                <input
                  ref={i === items.length - 1 ? lastInputRef : null}
                  type="text"
                  placeholder={isBn ? 'পণ্যের নাম' : 'Item name'}
                  value={isBn ? row.item : row.item}
                  onChange={e => handleChange(i, 'item', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                  type="text"
                  placeholder={isBn ? 'পরিমাণ' : 'Qty'}
                  value={format(row.qty)}
                  onChange={e => handleChange(i, 'qty', e.target.value)}
                  className="w-20 md:w-24 px-2 py-2 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                  type="text"
                  placeholder={isBn ? 'দর' : 'Rate'}
                  value={format(row.rate)}
                  onChange={e => handleChange(i, 'rate', e.target.value)}
                  className="w-24 md:w-28 px-2 py-2 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <div className="w-28 md:w-32 px-2 py-2 bg-gray-100 rounded text-right font-medium text-green-700">
                  {row.amount ? `${format(row.amount)} ৳` : '—'}
                </div>
              </div>
            ))}
          </div>

          {/* Totals Section */}
          <div className="mt-8 border-t-2 border-gray-300 pt-5">
            <div className="flex justify-end items-center gap-4">
              <div className="text-right space-y-3">
                <div className="font-bold text-gray-700">
                  {isBn ? 'ট্যাক্স / জমা / ছাড় :' : 'Tax / Deduction :'}
                </div>
                <div className="font-bold text-green-700 text-lg">
                  {isBn ? 'মোট মূল্য :' : 'Total Amount :'}
                </div>
                <div className={`font-bold text-xl ${net < 0 ? 'text-red-600' : 'text-blue-700'}`}>
                  {isBn ? 'নেট মূল্য :' : 'Net Amount :'}
                </div>
              </div>

              <div className="w-40 space-y-3">
                <input
                  type="text"
                  value={format(taxDeduction)}
                  onChange={e => setTaxDeduction(toEnglish(e.target.value))}
                  placeholder={isBn ? '০.০০' : '0.00'}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-right font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <div className="px-3 py-2 bg-green-50 text-green-800 font-bold text-right rounded">
                  {format(total.toFixed(2))} ৳
                </div>

                <div className={`px-3 py-2 font-bold text-right rounded text-xl ${net < 0 ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-800'}`}>
                  {format(net.toFixed(2))} ৳
                </div>
              </div>
            </div>

            {/* Signature area */}
            <div className="mt-10 flex justify-end">
              <div className="w-48 h-20 border-2 border-dashed border-gray-400 rounded flex items-end justify-center pb-2 text-gray-500 text-sm">
                {isBn ? 'স্বাক্ষর ও সিল' : 'Signature & Seal'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={addRow}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
          >
            {isBn ? '+ আরও পণ্য যোগ করুন' : '+ Add Row'}
          </button>

          <button
            onClick={downloadAsImage}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition"
          >
            {isBn ? 'ডাউনলোড (PNG)' : 'Download PNG'}
          </button>

          <button
            onClick={shareToWhatsApp}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition"
          >
            {isBn ? 'হোয়াটসঅ্যাপে শেয়ার' : 'Share on WhatsApp'}
          </button>
        </div>
      </Container>

      {/* Add this to App.css or component */}
      <style jsx>{`
        .no-placeholder::placeholder {
          color: transparent !important;
        }
      `}</style>
    </div>
  );
};

export default CashMemo;