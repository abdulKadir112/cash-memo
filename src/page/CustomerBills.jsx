import React, { useEffect, useState, useRef } from "react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

const convertToBangla = (num) => {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num.toString().split("").map((digit) => banglaDigits[parseInt(digit)] || digit).join("");
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
        pixelRatio: Math.min(window.devicePixelRatio * 1.5, 3),
        width: element.offsetWidth,
        height: element.offsetHeight,
        filter: (node) => node && !node.classList?.contains("download-actions"),
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
        pixelRatio: Math.min(window.devicePixelRatio * 1.5, 3),
        width: element.offsetWidth,
        height: element.offsetHeight,
        filter: (node) => node && !node.classList?.contains("download-actions"),
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
      if (selectedBill?.id === billId) setSelectedBill(null);
    }
  };

  const closeDetail = () => setSelectedBill(null);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          {selectedBill && (
            <button
              onClick={closeDetail}
              className="text-2xl text-gray-700 hover:text-gray-900 sm:hidden"
              aria-label="ফিরে যান"
            >
              ←
            </button>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
            {selectedBill ? "বিল বিস্তারিত" : "সেভ করা ক্যাশ মেমো / বিলসমূহ"}
          </h1>
        </div>

        {bills.length === 0 ? (
          <div className="text-center py-16 text-gray-600 bg-white rounded-xl shadow mx-2">
            <p className="text-lg sm:text-xl">এখনো কোনো বিল সেভ করা হয়নি।</p>
          </div>
        ) : selectedBill ? (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
            <div className="p-4 sm:p-6 border-b bg-orange-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-orange-800">বিল বিস্তারিত</h2>
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <button
                  onClick={() => deleteBill(selectedBill.id)}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm sm:text-base flex-1 sm:flex-none"
                >
                  বিল মুছুন
                </button>
                <button
                  onClick={closeDetail}
                  className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm sm:text-base flex-1 sm:flex-none"
                >
                  ফিরে যান
                </button>
              </div>
            </div>

            <div ref={(el) => (billRefs.current[selectedBill.id] = el)}>
              {/* হেডার, কাস্টমার ইনফো, টেবিল, টোটাল, ফুটার — আগের মতোই রাখা আছে, শুধু responsive padding/font বাড়ানো */}
              <div className="bg-orange-100 p-5 sm:p-6 border-b-2 border-orange-300">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-orange-800">{shopInfo.name}</h2>
                <p className="text-center text-sm sm:text-base text-gray-700 mt-1">
                  {shopInfo.address} • মোবাইল: {shopInfo.mobile}
                </p>
                <p className="text-center text-sm text-gray-600 mt-1">ক্যাশ মেমো #{convertToBangla(selectedBill.id)}</p>
              </div>

              <div className="p-4 sm:p-6 border-b bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm sm:text-base">
                  <div><span className="font-semibold">ক্রেতার নাম:</span> {selectedBill.customer?.name || "—"}</div>
                  <div><span className="font-semibold">মোবাইল:</span> {selectedBill.customer?.mobile || "—"}</div>
                  <div><span className="font-semibold">ঠিকানা:</span> {selectedBill.customer?.address || "—"}</div>
                </div>
                <div className="mt-3 text-sm text-gray-600">তারিখ: {selectedBill.savedAt || "—"}</div>
              </div>

              <div className="p-4 sm:p-6 overflow-x-auto">
                <div className="min-w-[340px]">
                  <table className="w-full text-sm sm:text-base">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs sm:text-sm">ক্রম</th>
                        <th className="px-3 py-3 text-left text-xs sm:text-sm">পণ্য</th>
                        <th className="px-3 py-3 text-center text-xs sm:text-sm">পরিমাণ</th>
                        <th className="px-3 py-3 text-center text-xs sm:text-sm">দর</th>
                        <th className="px-3 py-3 text-right text-xs sm:text-sm">টাকা</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBill.items.map((item, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="px-3 py-3 text-xs sm:text-sm">{convertToBangla(idx + 1)}</td>
                          <td className="px-3 py-3 text-xs sm:text-sm break-words">{item.item}</td>
                          <td className="px-3 py-3 text-center text-xs sm:text-sm">{convertToBangla(item.quantity)}</td>
                          <td className="px-3 py-3 text-center text-xs sm:text-sm">{convertToBangla(item.rate)}</td>
                          <td className="px-3 py-3 text-right text-xs sm:text-sm">{convertToBangla(item.taka)} ৳</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 px-6 flex flex-col items-end gap-2">
                {selectedBill.tax && Number(selectedBill.tax) > 0 && (
                  <p>ট্যাক্স: <span className="font-semibold">{convertToBangla(selectedBill.tax)} ৳</span></p>
                )}
                <p className="text-lg font-bold text-green-700">মোট: {convertToBangla(selectedBill.total)} ৳</p>
                <p className="text-xl font-bold text-blue-800">নেট: {convertToBangla(selectedBill.net)} ৳</p>
              </div>

              <div className="p-5 bg-orange-50 text-center text-sm sm:text-base border-t mt-6">
                {shopInfo.thanksMessage}
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-gray-100 flex flex-col sm:flex-row gap-4 justify-center sm:justify-end download-actions">
              <button onClick={() => handleDownloadImage(selectedBill.id)} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md min-w-[140px]">
                PNG ডাউনলোড
              </button>
              <button onClick={() => handleDownloadPDF(selectedBill)} className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md min-w-[140px]">
                PDF ডাউনলোড
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className="bg-white border rounded-xl p-5 shadow hover:shadow-xl hover:border-blue-400 transition-all cursor-pointer relative group"
                onClick={() => setSelectedBill(bill)}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); deleteBill(bill.id); }}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 text-2xl"
                >
                  ×
                </button>
                {/* কার্ড কন্টেন্ট আগের মতো */}
                <div className="space-y-3">
                  <p className="font-bold text-indigo-700">#{convertToBangla(bill.id)}</p>
                  <p className="font-semibold">{bill.customer?.name || "ক্রেতার নাম নেই"}</p>
                  <p className="text-sm">মোবাইল: {bill.customer?.mobile || "—"}</p>
                  <p className="text-sm">নেট মূল্য: <span className="font-bold text-blue-700">{convertToBangla(bill.net)} ৳</span></p>
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