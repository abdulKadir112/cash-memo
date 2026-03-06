import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import Container from '../layer/Container';
import '../App.css';
import Header from './Header';

// বাংলা সংখ্যা কনভার্ট
const convertToBangla = (num) => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .split('')
    .map((digit) => banglaDigits[parseInt(digit)] || digit)
    .join('');
};

const convertBanglaToEnglish = (str) => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  return str
    .split('')
    .map((char) => {
      const idx = banglaDigits.indexOf(char);
      return idx !== -1 ? englishDigits[idx] : char;
    })
    .join('');
};

const CashMemo = ({ className }) => {
  const [items, setItems] = useState(
    Array.from({ length: 5 }, () => ({ item: '', quantity: '', rate: '', taka: '' }))
  );
  const [tax, setTax] = useState('');
  const olRef = useRef(null);
  const lastRowRef = useRef(null);

  const isRowEmpty = (index) => {
    const row = items[index];
    return (
      row.item.trim() === '' &&
      row.quantity.trim() === '' &&
      row.rate.trim() === '' &&
      row.taka.trim() === ''
    );
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...items];

    const convertedValue =
      field === 'quantity' || field === 'rate' || field === 'taka'
        ? convertBanglaToEnglish(value)
        : value;

    updatedItems[index][field] = convertedValue;

    const quantity = parseFloat(convertBanglaToEnglish(updatedItems[index].quantity)) || 0;
    const rate = parseFloat(convertBanglaToEnglish(updatedItems[index].rate)) || 0;
    updatedItems[index].taka = quantity > 0 && rate > 0 ? (quantity * rate).toFixed(2) : '';

    setItems(updatedItems);
  };

  const handleTaxChange = (value) => {
    setTax(convertBanglaToEnglish(value));
  };

  const addNewRow = () => {
    setItems((prevItems) => {
      const newItems = [...prevItems, { item: '', quantity: '', rate: '', taka: '' }];

      setTimeout(() => {
        if (lastRowRef.current) {
          lastRowRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 100);

      return newItems;
    });
  };

  const removeRow = (index) => {
    if (items.length <= 1) {
      alert('অন্তত একটা রো থাকতে হবে');
      return;
    }
    if (!isRowEmpty(index)) {
      alert('শুধু খালি রো মুছে ফেলা যাবে');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotalPrice = () => {
    return items
      .reduce((total, row) => total + (parseFloat(row.taka) || 0), 0)
      .toFixed(2);
  };

  const calculateNetPrice = () => {
    const total = parseFloat(calculateTotalPrice()) || 0;
    const joma = parseFloat(tax) || 0;
    return (total - joma).toFixed(2);
  };

  const formatValue = (value) => (value ? convertToBangla(value) : '');

  const downloadOlAsImage = async () => {
    if (!olRef.current) return;

    try {
      // remove button লুকানো
      const removeBtns = olRef.current.querySelectorAll('[data-remove-btn]');
      removeBtns.forEach((btn) => (btn.style.display = 'none'));

      // সব input
      const inputs = olRef.current.querySelectorAll('input');

      // placeholder হালকা করা (শুধু placeholder, value এর রং বদলাবে না)
      inputs.forEach((input) => {
        input.classList.add('placeholder-light-download');
      });

      // স্টাইল apply হওয়ার জন্য ছোট অপেক্ষা
      await new Promise((resolve) => setTimeout(resolve, 80));

      const dataUrl = await toPng(olRef.current, {
        quality: 0.98,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
      });

      saveAs(dataUrl, 'cash-memo.png');

      // cleanup
      inputs.forEach((input) => {
        input.classList.remove('placeholder-light-download');
      });

      removeBtns.forEach((btn) => (btn.style.display = ''));

      alert('ইমেজ সফলভাবে ডাউনলোড হয়েছে।');
    } catch (error) {
      console.error('Image download error:', error);
      alert('ইমেজ ডাউনলোড করতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className={`${className}`}>
      <Container className="md:w-[700px] flex flex-col">
        <ol ref={olRef} className="flex flex-col gap-y-4 pb-40 bg-orange-200">
          <Header />

          {items.map((row, index) => (
            <li
              key={index}
              ref={index === items.length - 1 ? lastRowRef : null}
            >
              <div className="md:w-full flex justify-between border-transparent shadow-md rounded-md px-2">
                <div className="w-4 text-center font-bold">{convertToBangla(index + 1)}.</div>

                {['item', 'quantity', 'rate', 'taka'].map((field, i) => (
                  <div
                    key={i}
                    className={`relative flex flex-col ${
                      field === 'item' ? 'md:w-56 w-28' : field === 'quantity' ? 'md:w-28 w-16' : 'md:w-36 w-16'
                    } gap-y-0.5`}
                  >
                    {index === 0 && (
                      <div className="absolute -top-9 md:-top-10 border-blue-600 border-b-2 bg-blue-100 h-7 md:h-9 w-full text-center items-center">
                        <label htmlFor={field} className="font-bold text-[12px] md:text-base capitalize text-blue-600">
                          {field === 'item' ? 'পণ্য' : field === 'quantity' ? 'পরিমাণ' : field === 'rate' ? 'দাম' : 'টাকা'}
                        </label>
                      </div>
                    )}
                    <input
                      name={field}
                      type="text"
                      placeholder={field === 'item' ? 'পণ্য' : field === 'quantity' ? 'পরিমাণ' : field === 'rate' ? 'দাম' : 'টাকা'}
                      value={formatValue(row[field])}
                      onChange={(e) => handleInputChange(index, field, e.target.value)}
                      className="bg-[#f5f5f533] outline-none md:py-2 rounded-sm px-2 md:px-3 md:rounded-md md:text-base text-sm text-black placeholder:text-gray-400 placeholder:text-sm"
                    />
                  </div>
                ))}

                <button
                  data-remove-btn="true"
                  onClick={() => removeRow(index)}
                  className={`text-red-600 hover:text-red-800 font-bold text-xl px-2 self-center ${
                    isRowEmpty(index) ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  title="এই রো মুছে ফেলুন"
                  disabled={!isRowEmpty(index)}
                >
                  ×
                </button>
              </div>
            </li>
          ))}

          {/* Total / Net / Tax */}
          <div className="flex justify-end md:justify-between items-start pl-16 pr-2 mt-4 gap-x-6">
            <div className=" md:flex md:w-40 md:h-20 border border-dashed border-[#7c7c7c7c] justify-center items-center">
              <p className="text-sm text-[#7c7c7c7c]">সীল ও স্বাক্ষর</p>
            </div>
            <div className="flex flex-col gap-y-2 md:gap-y-4">
              <label htmlFor="tax" className="font-bold text-[12px] md:text-base text-black">ট্যাক্স / জমা:</label>
              <label className="font-bold text-[12px] md:text-base text-green-600">মোট মূল্য:</label>
              <label className="font-bold text-[12px] md:text-base text-blue-600">নেট মূল্য:</label>
            </div>
            <div className="w-28 md:w-36 flex flex-col gap-y-1">
              <input
                type="text"
                value={formatValue(tax)}
                onChange={(e) => handleTaxChange(e.target.value)}
                className="md:w-36 outline-none bg-gray-100 px-4 md:py-2 rounded-md md:text-lg font-bold text-black placeholder:text-gray-500"
              />
              <div className="bg-gray-200 pl-4 md:py-2 rounded-md shadow-md text-green-600 font-bold">
                {formatValue(calculateTotalPrice())} ৳
              </div>
              <div className={`bg-gray-200 pl-4 md:py-2 rounded-md shadow-md font-bold ${Number(calculateNetPrice()) < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                {formatValue(calculateNetPrice())} ৳
              </div>
            </div>
          </div>
        </ol>

        {/* Fixed bottom buttons */}
        <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-[700px] w-full bg-orange-200 z-10 p-4 flex flex-col gap-2">
          <div>
            <button
              onClick={addNewRow}
              className="w-full bg-blue-500 text-white px-4 py-2 md:py-3 hover:bg-blue-600 rounded-md"
            >
              রো যোগ করুন
            </button>
          </div>

          <div className="w-full flex gap-2">
            <button
              onClick={downloadOlAsImage}
              className="flex-1 bg-green-500 text-white py-2 md:py-3 hover:bg-green-600 rounded-md"
            >
              ডাউনলোড করুন
            </button>
            <button
              onClick={() => {
                downloadOlAsImage();
                alert('প্রথমে ডাউনলোড করে ছবিটি WhatsApp-এ শেয়ার করুন');
              }}
              className="flex-1 bg-green-500 text-white py-2 md:py-3 hover:bg-green-600 rounded-md"
            >
              শেয়ার করুন
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CashMemo;