import React, { useEffect, useState, useRef } from "react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

const convertToBangla = (num) => {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((digit) => banglaDigits[parseInt(digit)] || digit)
    .join("");
};

const CustomerBills = () => {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [shopInfo, setShopInfo] = useState({
    name: "আমার দোকান",
    address: "ঠিকানা এখানে",
    mobile: "01XXXXXXXXX",
    thanksMessage: "ধন্যবাদ!",
  });

  const billRefs = useRef({});

  useEffect(() => {
    const savedShop = JSON.parse(localStorage.getItem("shopProfile") || "{}");
    if (savedShop.name) setShopInfo(savedShop);

    const savedBills = JSON.parse(localStorage.getItem("savedCashMemos") || "[]");
    const sorted = savedBills.sort((a, b) => b.id - a.id);
    setBills(sorted);
  }, []);

  const handleDownloadImage = async (billId) => {
    const element = billRefs.current[billId];
    if (!element) return;

    try {
      const dataUrl = await toPng(element, {
        backgroundColor: "#ffffff",
        pixelRatio: 3,
        filter: (node) => !node.classList?.contains("download-actions"),
      });
      saveAs(dataUrl, `cash-memo-${billId}.png`);
    } catch (err) {
      console.error(err);
      alert("ইমেজ তৈরিতে সমস্যা");
    }
  };

  const handleDownloadPDF = async (bill) => {
    const element = billRefs.current[bill.id];
    if (!element) return;

    try {
      const dataUrl = await toPng(element, {
        backgroundColor: "#ffffff",
        pixelRatio: 3,
        filter: (node) => !node.classList?.contains("download-actions"),
      });

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`cash-memo-${bill.id}.pdf`);
    } catch (err) {
      console.error(err);
      alert("পিডিএফ তৈরিতে সমস্যা");
    }
  };

  const deleteBill = (billId) => {
    if (window.confirm("এই বিলটি পুরোপুরি মুছে ফেলতে চান?")) {
      const updatedBills = bills.filter((b) => b.id !== billId);
      setBills(updatedBills);
      localStorage.setItem("savedCashMemos", JSON.stringify(updatedBills));
      if (selectedBill && selectedBill.id === billId) {
        setSelectedBill(null);
      }
    }
  };

  const closeDetail = () => setSelectedBill(null);

  return (
    <div className="mt-8 min-h-screen bg-gray-50 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 md:pt-10">
        <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left text-blue-900 mb-6 md:mb-8">
          সেভ করা ক্যাশ মেমো / বিলসমূহ
        </h1>

        {bills.length === 0 ? (
          <div className="text-center py-16 md:py-20 text-gray-600 bg-white rounded-lg shadow mx-2 sm:mx-0">
            <p className="text-lg md:text-xl">এখনো কোনো বিল সেভ করা হয়নি।</p>
            <p className="mt-3 text-sm md:text-base">বিল তৈরি করে "ডাউনলোড করুন ।</p>
          </div>
        ) : selectedBill ? (
          // বিস্তারিত ভিউ
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
            <div className="p-4 md:p-6 border-b bg-orange-50 flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-orange-800">
                বিল বিস্তারিত
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => deleteBill(selectedBill.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm md:text-base"
                >
                  বিল মুছুন
                </button>
                <button
                  onClick={closeDetail}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm md:text-base"
                >
                  ← ফিরে যান
                </button>
              </div>
            </div>

            <div ref={(el) => (billRefs.current[selectedBill.id] = el)}>
              {/* Memo Header */}
              <div className="bg-orange-100 p-5 border-b-2 border-orange-300">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-orange-800">
                  {shopInfo.name}
                </h2>
                <p className="text-center text-sm md:text-base text-gray-700 mt-1">
                  {shopInfo.address} • মোবাইল: {shopInfo.mobile}
                </p>
                <p className="text-center text-sm text-gray-600 mt-1">
                  ক্যাশ মেমো #{convertToBangla(selectedBill.id)}
                </p>
              </div>

              {/* Customer Info */}
              <div className="p-5 border-b bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm md:text-base">
                  <div><span className="font-semibold">ক্রেতার নাম:</span> {selectedBill.customer?.name || "—"}</div>
                  <div><span className="font-semibold">মোবাইল:</span> {selectedBill.customer?.mobile || "—"}</div>
                  <div><span className="font-semibold">ঠিকানা:</span> {selectedBill.customer?.address || "—"}</div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  তারিখ: {selectedBill.savedAt || "—"}
                </div>
              </div>

              {/* Items Table */}
              <div className="p-5 overflow-x-auto">
                <table className="w-full text-sm md:text-base min-w-[500px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left">ক্রম</th>
                      <th className="px-4 py-3 text-left">পণ্যের নাম</th>
                      <th className="px-4 py-3 text-center">পরিমাণ</th>
                      <th className="px-4 py-3 text-center">দর</th>
                      <th className="px-4 py-3 text-right">টাকা</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBill.items.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{convertToBangla(idx + 1)}</td>
                        <td className="px-4 py-3">{item.item}</td>
                        <td className="px-4 py-3 text-center">{convertToBangla(item.quantity)}</td>
                        <td className="px-4 py-3 text-center">{convertToBangla(item.rate)}</td>
                        <td className="px-4 py-3 text-right font-medium">{convertToBangla(item.taka)} ৳</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mt-6 flex flex-col items-end gap-2 pr-6">
                {selectedBill.tax && Number(selectedBill.tax) > 0 && (
                  <p className="text-base">ট্যাক্স / জমা: <span className="font-semibold">{convertToBangla(selectedBill.tax)} ৳</span></p>
                )}
                <p className="text-lg font-bold text-green-700">মোট মূল্য: {convertToBangla(selectedBill.total)} ৳</p>
                <p className="text-xl font-bold text-blue-800">নেট মূল্য: {convertToBangla(selectedBill.net)} ৳</p>
              </div>

              {/* Footer */}
              <div className="p-5 bg-orange-50 text-center text-sm text-gray-700 border-t mt-6">
                {shopInfo.thanksMessage}
              </div>
            </div>

            {/* Download Buttons */}
            <div className="p-4 bg-gray-100 flex flex-wrap gap-4 justify-center md:justify-end download-actions">
              <button
                onClick={() => handleDownloadImage(selectedBill.id)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
              >
                PNG ডাউনলোড
              </button>
              <button
                onClick={() => handleDownloadPDF(selectedBill)}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
              >
                PDF ডাউনলোড
              </button>
            </div>
          </div>
        ) : (
          // কার্ড / লিস্ট ভিউ
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-xl hover:border-blue-400 hover:scale-[1.02] transition-all duration-200 relative group cursor-pointer overflow-hidden"
                onClick={(e) => {
                  if (e.target.closest('.delete-btn')) return;
                  setSelectedBill(bill);
                }}
              >
                {/* Delete Button */}
                <button
                  onClick={() => deleteBill(bill.id)}
                  className="delete-btn absolute top-3 right-3 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-2xl font-bold z-10"
                  title="বিল মুছে ফেলুন"
                >
                  ×
                </button>

                <div className="flex flex-col space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">বিল নং:</span>
                    <span className="text-lg font-bold text-indigo-700">
                      #{convertToBangla(bill.id)}
                    </span>
                  </div>

                  <p className="font-semibold text-gray-800 text-lg truncate">
                    {bill.customer?.name || "ক্রেতার নাম নেই"}
                  </p>

                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-600">মোবাইল:</span>{" "}
                    {bill.customer?.mobile || "—"}
                  </p>

                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-600">ঠিকানা:</span>{" "}
                    {bill.customer?.address || "—"}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {bill.savedAt || "তারিখ অনুপলব্ধ"}
                  </p>

                  <div className="mt-4 pt-3 border-t flex justify-between items-end">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">নেট মূল্য</p>
                      <p className="font-bold text-blue-700 text-xl">
                        {convertToBangla(bill.net)} ৳
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600 font-medium">মোট মূল্য</p>
                      <p className="font-semibold text-green-700 text-xl">
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
    </div>
  );
};

export default CustomerBills;