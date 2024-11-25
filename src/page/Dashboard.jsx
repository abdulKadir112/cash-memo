import React, { useState } from 'react';
import Container from '../layer/Container';

const convertToBangla = (num) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => banglaDigits[digit] || digit).join('');
};

const convertToEnglish = (num) => {
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return num.toString().split('').map(digit => englishDigits[digit] || digit).join('');
};

const Dashboard = () => {
    const [items, setItems] = useState([{ item: '', quantity: '', rate: '', taka: '' }]);
    const [language, setLanguage] = useState('bn');

    const handleInputChange = (index, field, value) => {
        const updatedItems = [...items];
        
        // বাংলা সংখ্যা ইংরেজিতে কনভার্ট করার জন্য
        const convertBanglaToEnglish = (num) => {
            const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            return num
                .split('')
                .map((char) => (banglaDigits.includes(char) ? englishDigits[banglaDigits.indexOf(char)] : char))
                .join('');
        };

        // ফিল্ডে বাংলা ইনপুট থাকলে ইংরেজিতে কনভার্ট করা
        const convertedValue = field === 'quantity' || field === 'rate' ? convertBanglaToEnglish(value) : value;
        updatedItems[index][field] = convertedValue;

        // পরিমাণ ও দাম থেকে টাকা হিসাব করা
        const quantity = parseFloat(convertBanglaToEnglish(updatedItems[index].quantity)) || 0;
        const rate = parseFloat(convertBanglaToEnglish(updatedItems[index].rate)) || 0;

        if (field === 'quantity' || field === 'rate') {
            if (quantity > 0 && rate > 0) {
                updatedItems[index].taka = (quantity * rate).toFixed(2);
            } else {
                updatedItems[index].taka = '';
            }
        }

        setItems(updatedItems);
    };

    const addNewRow = () => {
        setItems([...items, { item: '', quantity: '', rate: '', taka: '' }]);
    };

    const isTakaEditable = (row) => {
        const quantity = parseFloat(row.quantity) || 0;
        const rate = parseFloat(row.rate) || 0;
        return quantity === 0 && rate === 0;
    };

    const calculateTotalPrice = () => {
        return items.reduce((total, row) => {
            const taka = parseFloat(row.taka) || 0;
            return total + taka;
        }, 0).toFixed(2);
    };

    const toggleLanguage = () => {
        setLanguage(language === 'bn' ? 'en' : 'bn');
    };

    const formatValue = (value) => {
        return language === 'bn' ? convertToBangla(value) : convertToEnglish(value);
    };

    return (
        <div>
            <Container className="bg-orange-200 p-6">
                <div className="flex justify-end mb-4">
                    <button
                        onClick={toggleLanguage}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                        {language === 'bn' ? 'বাংলা' : 'English'}
                    </button>
                </div>
                <ol className="flex flex-col gap-y-3">
                    {items.map((row, index) => (
                        <li key={index}>
                            <div className="md:w-full flex justify-between border-transparent shadow-md rounded-md md:p-2">
                                {['item', 'quantity', 'rate', 'taka'].map((field, i) => (
                                    <div
                                        key={i}
                                        className={`flex flex-col ${
                                            field === 'item' ? 'md:w-56 w-28' : field === 'quantity' ? 'md:w-28 w-16' : 'md:w-36 w-16'
                                        } gap-y-1`}
                                    >
                                        {index === 0 && (
                                            <label htmlFor={field} className="font-medium text-base capitalize">
                                                {language === 'bn' ? (field === 'item' ? 'পণ্য' : field === 'quantity' ? 'পরিমাণ' : field === 'rate' ? 'দাম' : field === 'taka' ? 'টাকা' : field) : field.charAt(0).toUpperCase() + field.slice(1)}
                                            </label>
                                        )}
                                        <input
                                            name={field}
                                            type={field === 'taka' || field === 'rate' || field === 'quantity' ? 'text' : 'text'}
                                            placeholder={language === 'bn' ? (field === 'item' ? 'পণ্য' : field === 'quantity' ? 'পরিমাণ' : field === 'rate' ? 'দাম' : field === 'taka' ? 'টাকা' : field) : field.charAt(0).toUpperCase() + field.slice(1)}
                                            value={formatValue(row[field])}
                                            onChange={(e) => handleInputChange(index, field, e.target.value)}
                                            className="outline-none md:py-2 rounded-sm md:px-3 md:rounded-md md:text-base text-sm placeholder:text-sm"
                                            readOnly={field === 'taka' && !isTakaEditable(row)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </li>
                    ))}
                </ol>
                <button
                    onClick={addNewRow}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    {language === 'bn' ? 'রো যোগ করুন' : 'Add Row'}
                </button>
                <div className="mt-6 flex justify-end">
                    <div className="text-lg font-semibold">
                        {language === 'bn' ? 'মোট মূল্য: ' : 'Total Price: '}
                        <span className="text-green-600">{formatValue(calculateTotalPrice())} ৳</span>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Dashboard;
