import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import Container from '../layer/Container';
import '../App.css';
import Header from '../components/Header';

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
        setTax(englishValue);
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
        const netPrice = totalPrice - taxValue.toFixed(2) || 0;
        return netPrice > 0 ? netPrice.toFixed(2) : '0.00';
    };

    const toggleLanguage = () => {
        setLanguage(language === 'bn' ? 'en' : 'bn' && language === 'en' ? 'bn' : 'en');
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

                const options = { quality: 1, backgroundColor: '' };
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

    const shareOnWhatsApp = (imageUrl) => {
        const encodedUrl = encodeURIComponent(imageUrl);
        window.open(`https://wa.me/?text=${encodedUrl}`, '_blank');
    };


    return (
        <div className="">
            <Container className="flex flex-col justify-center  ">
                <div className="flex justify-end ">
                    <button
                        onClick={toggleLanguage}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                        {language === 'bn' ? 'English' : 'বাংলা'}
                    </button>
                </div>

                <ol ref={olRef} className=" flex flex-col gap-y-4 pb-5 bg-orange-200 ">
                    <Header />
                    {items.map((row, index) => (
                        <li key={index}>
                            <div className="md:w-full flex justify-between border-transparent shadow-md rounded-md md:px-2">
                                <div className="w-4 text-center font-bold">{index + 1}.</div>
                                {['item', 'quantity', 'rate', 'taka'].map((field, i) => (
                                    <div
                                        key={i}
                                        className={`relative flex flex-col ${field === 'item' ? 'md:w-56 w-28' : field === 'quantity' ? 'md:w-28 w-16' : 'md:w-36 w-16'
                                            } gap-y-0.5`}
                                    >
                                        {index === 0 && (
                                            <div className='absolute -top-10  border-b-2 bg-slate-300 h-9 w-full text-center items-center'>
                                                <label htmlFor={field} className="font-bold text-base capitalize text-blue-600 ">
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
                                            className="bg-[#f5f5f533] outline-none md:py-2 rounded-sm md:px-3 md:rounded-md md:text-base text-sm placeholder:text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </li>
                    ))}

                    <div className=''>
                        <ul className='flex justify-between items-center pl-16 pr-2'>
                            <div className='w-40 h-20 border border-dashed border-[#7c7c7c7c] flex justify-center items-center '>
                                <p className='text-sm text-[#7c7c7c7c]'>Seal and signature</p>
                            </div>
                            <div className='flex items-center gap-x-6'>
                                <div className='flex flex-col gap-y-6'>
                                    <label htmlFor="tax" className='font-bold text-base text-black'>{language === 'bn' ? 'ট্যাক্স / জমা' : 'Tax / Deduction'}:</label>
                                    <label htmlFor="#" className='font-bold text-base text-green-600'>{language === 'bn' ? 'মোট মূল্য' : 'Total Price'}:</label>
                                    <label htmlFor="#" className='font-bold text-base text-blue-600'>{language === 'bn' ? 'নেট মূল্য' : 'Net Price'}:</label>
                                </div>
                                <div className='w-36 flex flex-col gap-2'>
                                <input
                                    type="text"
                                    value={formatValue(tax)}
                                    onChange={(e) => handleTaxChange(e.target.value)}
                                    className="w-36 outline-none bg-gray-100 px-4 py-2 rounded-md text-lg font-bold"
                                />
                                    <li className="bg-gray-200 pl-4  py-2 rounded-md shadow-md">
                                        {/* <span className="font-semibold">{language === 'bn' ? 'মোট মূল্য' : 'Total Price'}:</span> */}
                                        <span className="text-green-600 font-bold">{formatValue(calculateTotalPrice())} ৳</span>
                                    </li>
                                    <li className="items-center bg-gray-200 pl-4 py-2 rounded-md shadow-md">
                                        {/* <span className="font-semibold">{language === 'bn' ? 'নেট মূল্য' : 'Net Price'}:</span> */}
                                        <span className="text-blue-600 font-bold">{formatValue(calculateNetPrice())} ৳</span>
                                    </li>
                                </div>
                            </div>
                        </ul>
                    </div>

                </ol>

                <div className=''>
                    <button
                        onClick={addNewRow}
                        className="w-full mt-1.5 bg-blue-500 text-white px-4 py-2  hover:bg-blue-600"
                    >
                        {language === 'bn' ? 'রো যোগ করুন' : 'Add Row'}
                    </button>

                    <div className="mt-3 flex justify-end gap-x-4">
                        <button
                            onClick={downloadOlAsImage}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        >
                            {language === 'bn' ? 'ডাউনলোড করুন' : 'Download'}
                        </button>
                        <button
                            onClick={() => downloadOlAsImage().then(() => {
                                const imageUrl = 'data:image/png;base64,...'; // toPng থেকে জেনারেট হওয়া ডেটা URL
                                shareOnWhatsApp(imageUrl);
                            })}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        >
                            {language === 'bn' ? 'শেয়ার করুন' : 'Share'}
                        </button>

                    </div>
                </div>
            </Container>
        </div>
    );
};

export default CashMemo;
