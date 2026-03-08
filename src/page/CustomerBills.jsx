import React, { useEffect, useState } from "react";

// বাংলা সংখ্যা কনভার্ট ফাংশন
const convertToBangla = (num) => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .split('')
    .map((digit) => banglaDigits[parseInt(digit)] || digit)
    .join('');
};

const CustomerBills = () => {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    // তোমার আগের কোডে localStorage-এ "savedCashMemos" নামে সেভ হচ্ছিল
    // এখানে সেই নামটাই ব্যবহার করা হলো — যদি অন্য নাম হয় তাহলে পরিবর্তন করে নিও
    const savedBills = JSON.parse(localStorage.getItem("savedCashMemos")) || [];
    // নতুন থেকে পুরোনোতে সাজানো (সাম্প্রতিক বিল প্রথমে)
    const sortedBills = savedBills.sort((a, b) => b.id - a.id);
    setBills(sortedBills);
  }, []);

  const handleSelectBill = (bill) => {
    setSelectedBill(bill);
  };

  const closeDetail = () => {
    setSelectedBill(null);
  };

  return (
    <div className="mt-16 p-4 md:p-6 max-w-5xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left text-blue-800">
        সেভ করা কাস্টমার বিলসমূহ
      </h1>

      {bills.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">এখনো কোনো বিল সেভ করা হয়নি।</p>
          <p className="mt-2">নতুন বিল তৈরি করে "ডাউনলোড করুন" বাটনে ক্লিক করুন।</p>
        </div>
      ) : selectedBill ? (
        // বিস্তারিত ভিউ
        <div className="bg-white shadow-lg rounded-xl p-5 md:p-8 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-blue-700">
              বিল বিস্তারিত
            </h2>
            <button
              onClick={closeDetail}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
            >
              ← ফিরে যান
            </button>
          </div>

          <div className="mb-6 space-y-2">
            <p><strong>তারিখ:</strong> {selectedBill.savedAt || selectedBill.date}</p>
            <p><strong>ক্রেতার নাম:</strong> {selectedBill.customer?.name || "—"}</p>
            <p><strong>মোবাইল:</strong> {selectedBill.customer?.mobile || "—"}</p>
            <p><strong>ঠিকানা:</strong> {selectedBill.customer?.address || "—"}</p>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm md:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">ক্রম</th>
                  <th className="border px-4 py-2 text-left">পণ্য</th>
                  <th className="border px-4 py-2 text-center">পরিমাণ</th>
                  <th className="border px-4 py-2 text-center">দর</th>
                  <th className="border px-4 py-2 text-right">টাকা</th>
                </tr>
              </thead>
              <tbody>
                {selectedBill.items.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="border px-4 py-2">{convertToBangla(index + 1)}</td>
                    <td className="border px-4 py-2">{item.item}</td>
                    <td className="border px-4 py-2 text-center">{convertToBangla(item.quantity)}</td>
                    <td className="border px-4 py-2 text-center">{convertToBangla(item.rate)}</td>
                    <td className="border px-4 py-2 text-right font-medium">
                      {convertToBangla(item.taka)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-8 text-right">
            <div>
              <p className="text-gray-700">
                ট্যাক্স / জমা: {convertToBangla(selectedBill.tax || "0")} ৳
              </p>
              <p className="text-lg font-bold text-green-700 mt-1">
                মোট মূল্য: {convertToBangla(selectedBill.total)} ৳
              </p>
              <p className="text-xl font-bold text-blue-800 mt-2">
                নেট মূল্য: {convertToBangla(selectedBill.net)} ৳
              </p>
            </div>
          </div>
        </div>
      ) : (
        // লিস্ট ভিউ
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bills.map((bill) => (
            <div
              key={bill.id}
              onClick={() => handleSelectBill(bill)}
              className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
            >
              <div className="flex flex-col">
                <p className="font-medium text-gray-800">
                  {bill.customer?.name || "ক্রেতার নাম নেই"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {bill.savedAt || bill.date || "তারিখ অনুপলব্ধ"}
                </p>
                <div className="mt-3 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-600">নেট</p>
                    <p className="font-bold text-blue-700">
                      {convertToBangla(bill.net)} ৳
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">মোট</p>
                    <p className="font-semibold text-green-700">
                      {convertToBangla(bill.total)} ৳
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerBills;