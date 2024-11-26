import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import Container from '../layer/Container';
import '../App.css';

const convertToBangla = (num) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => banglaDigits[digit] || digit).join('');
};

const convertToEnglish = (num) => {
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return num.toString().split('').map(digit => englishDigits[digit] || digit).join('');
};

const CashMemo = () => {
    const [items, setItems] = useState(
        Array.from({ length: 5 }, () => ({ item: '', quantity: '', rate: '', taka: '' }))
    );
    const [tax, setTax] = useState("");
    const [language, setLanguage] = useState('bn');
    const olRef = useRef(null);

    const handleInputChange = (index, field, value) => {
        const updatedItems = [...items];
        const convertBanglaToEnglish = (num) => {
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            return num.split('').map((char) =>
                (banglaDigits.includes(char) ? englishDigits[banglaDigits.indexOf(char)] : char)).join('');
        };

        const convertedValue = field === 'quantity' || field === 'rate' || field === 'taka' ? convertBanglaToEnglish(value) : value;
        updatedItems[index][field] = convertedValue;

        const quantity = parseFloat(convertBanglaToEnglish(updatedItems[index].quantity)) || 0;
        const rate = parseFloat(convertBanglaToEnglish(updatedItems[index].rate)) || 0;

        if (field === 'quantity' || field === 'rate') {
            updatedItems[index].taka = quantity > 0 && rate > 0 ? (quantity * rate).toFixed(2) : '';
        }

        setItems(updatedItems);
    };

    const handleTaxChange = (value) => {
        const englishValue = convertToEnglish(value);
        const formattedValue = convertToBangla(englishValue);
        const taxValue = parseFloat(englishValue) || formattedValue;
        setTax(taxValue);
    };

    const addNewRow = () => {
        setItems([...items, { item: '', quantity: '', rate: '', taka: '' }]);
    };

    const calculateTotalPrice = () => {
        return items.reduce((total, row) => {
            const quantity = parseFloat(row.quantity) || 0;
            const rate = parseFloat(row.rate) || 0;
            const taka = parseFloat(row.taka) || 0;

            if (quantity === 0 && rate === 0 && taka > 0) {
                return total + taka;
            } else if (quantity > 0 && rate > 0) {
                return total + (quantity * rate);
            }
            return total;
        }, 0).toFixed(2);
    };

    const calculateNetPrice = () => {
        const totalPrice = parseFloat(calculateTotalPrice()) || 0;
        const taxValue = parseFloat(tax) || 0;
        const netPrice = totalPrice - taxValue;
        return netPrice > 0 ? netPrice.toFixed(2) : '0.00';
    };

    const toggleLanguage = () => {
        setLanguage(language === 'bn' ? 'en' : 'bn');
    };

    const formatValue = (value) => {
        return language === 'bn' ? convertToBangla(value) : convertToEnglish(value);
    };

    const downloadOlAsImage = async () => {
        if (olRef.current) {
            try {
                const inputs = olRef.current.querySelectorAll('input');
                inputs.forEach(input => {
                    input.classList.add('placeholder-light');
                });

                const options = { quality: 1, backgroundColor: 'white' };
                const dataUrl = await toPng(olRef.current, options);

                saveAs(dataUrl, 'cash-memo.png');

                inputs.forEach(input => {
                    input.classList.remove('placeholder-light');
                });

                alert(language === 'bn' ? 'ইমেজ সফলভাবে ডাউনলোড হয়েছে।' : 'Image downloaded successfully.');
            } catch (error) {
                console.error('Could not generate image', error);
                alert(language === 'bn' ? 'ইমেজ ডাউনলোড ব্যর্থ।' : 'Image download failed.');
            }
        }
    };

    return (
        <div className="p-6">
            <Container>
                <div className="flex justify-end mb-4">
                    <button
                        onClick={toggleLanguage}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                        {language === 'bn' ? 'English' : 'বাংলা'}
                    </button>
                </div>

                <ol ref={olRef} className="relative flex flex-col gap-y-3 bg-orange-200">
                    <div className='w-48'>
                        <h1 className='text-2xl text-slate-200 bg-rose-400 px-3 py-1 rounded-md '>Cash Memo</h1>
                    </div>
                    {items.map((row, index) => (
                        <li key={index}>
                            <div className="md:w-full flex justify-between border-transparent shadow-md rounded-md md:p-2">
                                <div className="w-4 text-center font-bold">{index + 1}.</div>
                                {['item', 'quantity', 'rate', 'taka'].map((field, i) => (
                                    <div
                                        key={i}
                                        className={`flex flex-col ${field === 'item' ? 'md:w-56 w-28' : field === 'quantity' ? 'md:w-28 w-16' : 'md:w-36 w-16'
                                            } gap-y-1`}
                                    >
                                        {index === 0 && (
                                            <div>
                                                <label htmlFor={field} className="font-medium text-base capitalize">
                                                    {language === 'bn'
                                                        ? (field === 'item' ? 'পণ্য' : field === 'quantity' ? 'পরিমাণ' : field === 'rate' ? 'দাম' : 'টাকা')
                                                        : field.charAt(0).toUpperCase() + field.slice(1)}
                                                </label>
                                            </div>
                                        )}
                                        <input
                                            name={field}
                                            type="text"
                                            placeholder={language === 'bn'
                                                ? (field === 'item' ? 'পণ্য' : field === 'quantity' ? 'পরিমাণ' : field === 'rate' ? 'দাম' : 'টাকা')
                                                : field.charAt(0).toUpperCase() + field.slice(1)}
                                            value={formatValue(row[field])}
                                            onChange={(e) => handleInputChange(index, field, e.target.value)}
                                            className="outline-none md:py-2 rounded-sm md:px-3 md:rounded-md md:text-base text-sm placeholder:text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </li>
                    ))}

                    <ul className='flex flex-col justify-end items-end'>
                        <li className="flex gap-7">
                            <label htmlFor="tax">{language === 'bn' ? 'ট্যাক্স / জমা' : 'Tax / Deduction'}:</label>
                            <input
                                type="text"
                                value={formatValue(tax)}
                                onChange={(e) => handleTaxChange(e.target.value)}
                                className="outline-none bg-gray-100 px-4 py-2 rounded-md"
                            />
                        </li>
                        <li className="mt-4 flex gap-7 items-center bg-gray-200 px-4 py-2 rounded-md shadow-md">
                            <span className="font-semibold">{language === 'bn' ? 'মোট মূল্য' : 'Total Price'}:</span>
                            <span className="text-green-600 font-bold">{formatValue(calculateTotalPrice())} ৳</span>
                        </li>
                        <li className="mt-2 flex gap-7 items-center bg-gray-200 px-4 py-2 rounded-md shadow-md">
                            <span className="font-semibold">{language === 'bn' ? 'নেট মূল্য' : 'Net Price'}:</span>
                            <span className="text-blue-600 font-bold">{formatValue(calculateNetPrice())} ৳</span>
                        </li>
                    </ul>

                </ol>

                <button
                    onClick={addNewRow}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    {language === 'bn' ? 'রো যোগ করুন' : 'Add Row'}
                </button>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={downloadOlAsImage}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                        {language === 'bn' ? 'ডাউনলোড করুন' : 'Download'}
                    </button>
                </div>
            </Container>
        </div>
    );
};

export default CashMemo;
