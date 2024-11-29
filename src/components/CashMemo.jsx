import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import Container from '../layer/Container';
import '../App.css';
import Header from './Header';

const convertToBangla = (num) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num
        .toString()
        .split('')
        .map((digit) => banglaDigits[digit] || digit)
        .join('');
};

const convertToEnglish = (num) => {
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return num
        .toString()
        .split('')
        .map((digit) => englishDigits[digit] || digit)
        .join('');
};

const CashMemo = ( {className}) => {
    const [items, setItems] = useState(
        Array.from({ length: 5 }, () => ({ item: '', quantity: '', rate: '', taka: '' }))
    );
    const [tax, setTax] = useState('');
    const [language, setLanguage] = useState('en');
    const olRef = useRef(null);

    // Handle input changes
    const handleInputChange = (index, field, value) => {
        const updatedItems = [...items];
        const convertBanglaToEnglish = (num) => {
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            return num
                .split('')
                .map((char) =>
                    banglaDigits.includes(char) ? englishDigits[banglaDigits.indexOf(char)] : char
                )
                .join('');
        };

        const convertedValue =
            field === 'quantity' || field === 'rate' || field === 'taka'
                ? convertBanglaToEnglish(value)
                : value;
        updatedItems[index][field] = convertedValue;

        // Calculate Taka
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

        if(olRef.current){
            olRef.current.scrollIntoView({ 
                behavior: 'smooth',
                block: 'end',
            
            });
        }
    };

    const calculateTotalPrice = () => {
        return items
            .reduce((total, row) => {
                const taka = parseFloat(row.taka) || 0;
                return total + taka;
            }, 0)
            .toFixed(2);
    };

    const calculateNetPrice = () => {
        const totalPrice = parseFloat(calculateTotalPrice()) || 0;
        const taxValue = parseFloat(tax) || 0;
        const netPrice = totalPrice - taxValue;
        
        
        return netPrice > 0 || netPrice < 0 ? netPrice.toFixed(2) : '0.00';
    };

    const toggleLanguage = () => {
        setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'bn' : 'en'));
    };

    const formatValue = (value) => {
        return language === 'en' ? convertToEnglish(value) : convertToBangla(value);
    };

    const downloadOlAsImage = async () => {
        if (olRef.current) {
            try {
                const inputs = olRef.current.querySelectorAll('input');
                inputs.forEach(input => {
                    input.classList.add('placeholder-light');
                });

                const options = { quality: 2, backgroundColor: '' };
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
        <div className={`${className}`}>
            <Container className="md:w-[700px] flex flex-col justify-center">
                <div className="flex justify-end ">
                    <button
                        onClick={toggleLanguage}
                        className="md:absolute top-4 text-[12px] md:text-base right-4 bg-gray-500 text-white px-4 py-1 md:py-2 rounded-md"
                    >
                        {language === 'bn' ? 'English' : 'বাংলা'}
                    </button>
                </div>

                <ol ref={olRef} className=" flex flex-col gap-y-4 pb-5 bg-orange-200 ">
                    <Header />
                    {items.map((row, index) => (
                        <li key={index}>
                            <div className="md:w-full flex justify-between border-transparent shadow-md rounded-md px-2">
                                <div className="w-4 text-center font-bold">{index + 1}.</div>
                                {['item', 'quantity', 'rate', 'taka'].map((field, i) => (
                                    <div
                                        key={i}
                                        className={`relative flex flex-col ${field === 'item' ? 'md:w-56 w-28' : field === 'quantity' ? 'md:w-28 w-16' : 'md:w-36 w-16'
                                            } gap-y-0.5`}
                                    >
                                        {index === 0 && (
                                            <div className='absolute -top-9 md:-top-10 border-blue-600 border-b-2 bg-blue-100 h-7 md:h-9 w-full text-center items-center'>
                                                <label htmlFor={field} className="font-bold text-[12px] md:text-base capitalize text-blue-600 ">
                                                    {language === 'bn'
                                                        ?(field === 'item' ? 'পণ্য' : field === 'quantity' ? 'পরিমাণ' : field === 'rate' ? 'দাম' : 'টাকা')
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
                        <ul className='flex justify-end md:justify-between md:items-center pl-16 pr-2'>
                            <div className='hidden  md:w-40 md:h-20 border border-dashed border-[#7c7c7c7c] md:flex justify-center items-center '>
                                <p className='text-sm text-[#7c7c7c7c]'>Seal and signature</p>
                            </div>
                            <div className='flex items-center gap-x-3 md:gap-x-6'>
                                <div className='flex flex-col gap-y-2 md:gap-y-4'>
                                    <label htmlFor="tax" className='font-bold text-[12px] md:text-base text-black'>{language === 'bn' ? 'ট্যাক্স / জমা' : 'Tax / Deduction'}:</label>
                                    <label htmlFor="#" className='font-bold text-[12px] md:text-base text-green-600'>{language === 'bn' ? 'মোট মূল্য' : 'Total Price'}:</label>
                                    <label htmlFor="#" className='font-bold text-[12px] md:text-base text-blue-600'>{language === 'bn' ? 'নেট মূল্য' : 'Net Price'}:</label>
                                </div>
                                <div className='w-28 md:w-36 flex flex-col gap-y-1'>
                                <input
                                    type="text"
                                    value={formatValue(tax)}
                                    onChange={(e) => handleTaxChange(e.target.value)}
                                    className="md:w-36 outline-none bg-gray-100 px-4 md:py-2 rounded-md md:text-lg font-bold"
                                />
                                    <li className="bg-gray-200 pl-4  md:py-2 rounded-md shadow-md">
                                        {/* <span className="font-semibold">{language === 'bn' ? 'মোট মূল্য' : 'Total Price'}:</span> */}
                                        <span className="text-green-600 font-bold">{formatValue(calculateTotalPrice())} ৳</span>
                                    </li>
                                    <li className={`items-center bg-gray-200 pl-4 md:py-2 rounded-md shadow-md text-blue-600 font-bold ${calculateNetPrice() < 0 ? 'text-red-600' : ''}`}>
                                        {/* <span className="font-semibold">{language === 'bn' ? 'নেট মূল্য' : 'Net Price'}:</span> */}
                                        {formatValue(calculateNetPrice())} ৳
                                    </li>
                                </div>
                            </div>
                        </ul>
                    </div>

                </ol>

                <div className=''>
                    <button
                        onClick={addNewRow}
                        className="w-full  bg-blue-500 text-white px-4 py-1 md:py-4  hover:bg-blue-600"
                    >
                        {language === 'bn' ? 'রো যোগ করুন' : 'Add Row'}
                    </button>

                    <div className=" pb-3 mt-2 md:mt-2 w-full flex justify-between">
                        <button
                            onClick={downloadOlAsImage}
                            className="w-full bg-green-500 text-white py-1 md:py-3  hover:bg-green-600"
                        >
                            {language === 'bn' ? 'ডাউনলোড করুন' : 'Download'}
                        </button>
                        <button
                            onClick={() => downloadOlAsImage().then(() => {
                                const imageUrl = 'data:image/png;base64,...'; // toPng থেকে জেনারেট হওয়া ডেটা URL
                                shareOnWhatsApp(imageUrl);
                            })}
                            className="w-full border-l-2 bg-green-500 text-white  py-1 md:py-3 hover:bg-green-600"
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
