import React, { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import Container from '../layer/Container';
import '../App.css';
import Header from './Header';

// বাংলা সংখ্যা কনভার্ট
const convertToBangla = (num) => {
  const banglaDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  return num
    .toString()
    .split('')
    .map((digit) => banglaDigits[parseInt(digit)] || digit)
    .join('');
};

const convertBanglaToEnglish = (str) => {
  const banglaDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  const englishDigits = ['0','1','2','3','4','5','6','7','8','9'];

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
    Array.from({ length: 5 }, () => ({
      item: '',
      quantity: '',
      rate: '',
      taka: ''
    }))
  );

  const [tax, setTax] = useState('');
  const [availableItems, setAvailableItems] = useState([]);

  const [rowSuggestions, setRowSuggestions] = useState(
    Array.from({ length: 5 }, () => [])
  );

  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(
    Array.from({ length: 5 }, () => -1)
  );

  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // ক্রমিক বিল নম্বর
  const [currentBillNo, setCurrentBillNo] = useState(1);

  const olRef = useRef(null);
  const lastRowRef = useRef(null);

  // JSON Load + Last Bill Number Load
  useEffect(() => {
    fetch('/item.json')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const unique = [...new Set(data)];
          setAvailableItems(unique);
        }
      })
      .catch(() => {
        setAvailableItems([]);
      });

    // শেষ বিল নম্বর লোড
    const lastNo = localStorage.getItem('lastBillNo');
    if (lastNo) {
      setCurrentBillNo(parseInt(lastNo) + 1);
    }
  }, []);

  const formatValue = (value) => (value ? convertToBangla(value) : '');

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

    if (field === 'item') {
      const searchTerm = convertedValue.trim();

      if (searchTerm === '') {
        const newSuggestions = [...rowSuggestions];
        newSuggestions[index] = [];
        setRowSuggestions(newSuggestions);
        setItems(updatedItems);
        return;
      }

      const filtered = availableItems.filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const limited = filtered.slice(0, 5);

      const newSuggestions = [...rowSuggestions];
      newSuggestions[index] = limited;
      setRowSuggestions(newSuggestions);

      const newActive = [...activeSuggestionIndex];
      newActive[index] = -1;
      setActiveSuggestionIndex(newActive);
    }

    const quantity = parseFloat(convertBanglaToEnglish(updatedItems[index].quantity)) || 0;
    const rate = parseFloat(convertBanglaToEnglish(updatedItems[index].rate)) || 0;

    updatedItems[index].taka =
      quantity > 0 && rate > 0 ? (quantity * rate).toFixed(2) : '';

    setItems(updatedItems);
  };

  const handleSuggestionClick = (rowIndex, selectedItem) => {
    const updatedItems = [...items];
    updatedItems[rowIndex].item = selectedItem;
    setItems(updatedItems);

    const newSuggestions = [...rowSuggestions];
    newSuggestions[rowIndex] = [];
    setRowSuggestions(newSuggestions);

    const newActive = [...activeSuggestionIndex];
    newActive[rowIndex] = -1;
    setActiveSuggestionIndex(newActive);
  };

  const handleKeyDown = (e, rowIndex) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newActive = [...activeSuggestionIndex];
      newActive[rowIndex] = Math.min(newActive[rowIndex] + 1, rowSuggestions[rowIndex].length - 1);
      setActiveSuggestionIndex(newActive);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newActive = [...activeSuggestionIndex];
      newActive[rowIndex] = Math.max(newActive[rowIndex] - 1, -1);
      setActiveSuggestionIndex(newActive);
    } else if (e.key === 'Enter' && activeSuggestionIndex[rowIndex] >= 0) {
      e.preventDefault();
      handleSuggestionClick(rowIndex, rowSuggestions[rowIndex][activeSuggestionIndex[rowIndex]]);
    }
  };

  const handleTaxChange = (value) => {
    setTax(convertBanglaToEnglish(value));
  };

  const addNewRow = () => {
    setItems((prev) => [...prev, { item: '', quantity: '', rate: '', taka: '' }]);
    setRowSuggestions((prev) => [...prev, []]);
    setActiveSuggestionIndex((prev) => [...prev, -1]);

    setTimeout(() => {
      if (lastRowRef.current) {
        lastRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
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
    setRowSuggestions((prev) => prev.filter((_, i) => i !== index));
    setActiveSuggestionIndex((prev) => prev.filter((_, i) => i !== index));
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

  // নতুন ফাংশন: শুধু সেভ করবে (ডাউনলোড ছাড়া)
  const saveBill = () => {
    const billData = {
      id: currentBillNo,
      savedAt: new Date().toLocaleString('bn-BD'),
      customer: {
        name: customerName.trim() || "নাম দেয়া হয়নি",
        mobile: customerMobile.trim() || "—",
        address: customerAddress.trim() || "—"
      },
      items: items
        .filter(row => row.item.trim() !== '' && row.quantity.trim() !== '')
        .map(row => ({
          item: row.item,
          quantity: row.quantity,
          rate: row.rate,
          taka: row.taka
        })),
      tax: tax,
      total: calculateTotalPrice(),
      net: calculateNetPrice()
    };

    const previousBills = JSON.parse(localStorage.getItem('savedCashMemos') || '[]');
    previousBills.push(billData);
    localStorage.setItem('savedCashMemos', JSON.stringify(previousBills));

    // পরবর্তী নম্বরের জন্য আপডেট
    localStorage.setItem('lastBillNo', currentBillNo.toString());
    setCurrentBillNo(prev => prev + 1);

    alert(`বিল নং ${convertToBangla(currentBillNo)} সফলভাবে সেভ হয়েছে!`);
  };

  const downloadOlAsImage = async () => {
    if (!olRef.current) return;

    try {
      const dataUrl = await toPng(olRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
      });

      saveAs(dataUrl, `cash-memo-${currentBillNo}.png`);

      const billData = {
        id: currentBillNo,
        savedAt: new Date().toLocaleString('bn-BD'),
        customer: {
          name: customerName.trim() || "নাম দেয়া হয়নি",
          mobile: customerMobile.trim() || "—",
          address: customerAddress.trim() || "—"
        },
        items: items
          .filter(row => row.item.trim() !== '' && row.quantity.trim() !== '')
          .map(row => ({
            item: row.item,
            quantity: row.quantity,
            rate: row.rate,
            taka: row.taka
          })),
        tax: tax,
        total: calculateTotalPrice(),
        net: calculateNetPrice()
      };

      const previousBills = JSON.parse(localStorage.getItem('savedCashMemos') || '[]');
      previousBills.push(billData);
      localStorage.setItem('savedCashMemos', JSON.stringify(previousBills));

      localStorage.setItem('lastBillNo', currentBillNo.toString());
      setCurrentBillNo(prev => prev + 1);

      alert('বিল ডাউনলোড হয়েছে এবং localStorage-এ সেভ হয়েছে!');

    } catch (err) {
      console.error('সমস্যা:', err);
      alert('ইমেজ তৈরি/সেভ করতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className={`${className}`}>
      <Container className="bg-orange-200 pt-16 md:w-[700px] flex flex-col">

        <ol ref={olRef} className="flex flex-col gap-y-4 mb-28 pb-8">

          <Header
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerMobile={customerMobile}
            setCustomerMobile={setCustomerMobile}
            customerAddress={customerAddress}
            setCustomerAddress={setCustomerAddress}
            serialNumber={currentBillNo}
          />

          {items.map((row, index) => (
            <li
              key={index}
              ref={index === items.length - 1 ? lastRowRef : null}
            >
              <div className="md:w-full flex justify-between shadow-md rounded-md px-2">
                <div className="w-4 text-center font-bold">
                  {convertToBangla(index + 1)}.
                </div>

                {['item', 'quantity', 'rate', 'taka'].map((field, i) => (
                  <div
                    key={i}
                    className={`relative flex flex-col
                      ${field === 'item' ? 'md:w-56 w-28' : field === 'quantity' ? 'md:w-28 w-16' : 'md:w-36 w-16'}
                      gap-y-0.5`}
                  >
                    <input
                      type="text"
                      placeholder={
                        field === 'item' ? 'পণ্য' :
                        field === 'quantity' ? 'পরিমাণ' :
                        field === 'rate' ? 'দাম' : 'টাকা'
                      }
                      value={formatValue(row[field])}
                      onChange={(e) => handleInputChange(index, field, e.target.value)}
                      onKeyDown={(e) => (field === 'item' ? handleKeyDown(e, index) : null)}
                      onBlur={() => {
                        setTimeout(() => {
                          const newSuggestions = [...rowSuggestions];
                          newSuggestions[index] = [];
                          setRowSuggestions(newSuggestions);
                        }, 150);
                      }}
                      className="bg-[#f5f5f533] outline-none md:py-2 rounded-sm md:px-3 md:text-base text-sm"
                    />

                    {field === 'item' && rowSuggestions[index]?.length > 0 && (
                      <ul className="absolute z-10 bg-white border w-52 md:w-full max-h-48 h-auto mt-10 rounded-md shadow-lg">
                        {rowSuggestions[index].map((sug, sugIndex) => (
                          <li
                            key={sug}
                            onClick={() => handleSuggestionClick(index, sug)}
                            className={`px-4 py-2 cursor-pointer hover:bg-blue-50
                              ${sugIndex === activeSuggestionIndex[index] ? 'bg-blue-100 font-medium' : ''}`}
                          >
                            {sug}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                <button
                  onClick={() => removeRow(index)}
                  className={`text-red-600 font-bold text-xl px-2 self-center
                    ${isRowEmpty(index) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                  ×
                </button>
              </div>
            </li>
          ))}

          {/* Total / Net / Tax */}
          <div className="flex justify-end md:justify-between items-start pl-16 pr-2 mt-4 gap-x-6">
            <div className="hidden md:flex md:w-40 md:h-20 border border-dashed border-[#7c7c7c7c] justify-center items-center">
              <p className="text-sm text-[#7c7c7c7c]">সীল ও স্বাক্ষর</p>
            </div>

            <div className="flex flex-col gap-y-2 md:gap-y-4">
              <label htmlFor="tax" className="font-bold text-[12px] md:text-base text-black">
                ট্যাক্স / জমা:
              </label>
              <label className="font-bold text-[12px] md:text-base text-green-600">
                মোট মূল্য:
              </label>
              <label className="font-bold text-[12px] md:text-base text-blue-600">
                নেট মূল্য:
              </label>
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

              <div className={`bg-gray-200 pl-4 md:py-2 rounded-md shadow-md font-bold ${
                Number(calculateNetPrice()) < 0 ? 'text-red-600' : 'text-blue-600'
              }`}>
                {formatValue(calculateNetPrice())} ৳
              </div>
            </div>
          </div>
        </ol>

        {/* নিচের ফিক্সড বাটনগুলো — এখানে নতুন "বিল সেভ করুন" বাটন যোগ করা হয়েছে */}
        <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-[700px] w-full bg-orange-200 z-10 p-4 flex flex-col gap-2">
          <button
            onClick={addNewRow}
            className="w-full bg-blue-500 text-white py-3 rounded-md"
          >
            রো যোগ করুন
          </button>

          <div className="flex gap-2">
            <button
              onClick={saveBill}
              className="w-1/2 bg-purple-600 text-white py-3 rounded-md"
            >
              বিল সেভ করুন
            </button>

            <button
              onClick={downloadOlAsImage}
              className="w-1/2 bg-green-500 text-white py-3 rounded-md"
            >
              ডাউনলোড করুন
            </button>
          </div>
        </div>

      </Container>
    </div>
  );
};

export default CashMemo;