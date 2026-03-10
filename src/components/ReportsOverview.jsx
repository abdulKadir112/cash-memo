import React, { useEffect, useState } from "react";

const ReportsOverview = () => {
  const [stats, setStats] = useState({
    todaySales: 0,
    todayOrders: 0,
    monthSales: 0,
    monthOrders: 0,
    topProduct: { name: "—", quantity: 0, total: 0 },
  });

  const [recentBills, setRecentBills] = useState([]);

  useEffect(() => {
    const savedBills = JSON.parse(localStorage.getItem("savedCashMemos") || "[]");

    // সর্ট: সবচেয়ে নতুন প্রথমে
    const sortedBills = savedBills.sort((a, b) => {
      const dateA = new Date(a.savedAt || 0);
      const dateB = new Date(b.savedAt || 0);
      return dateB - dateA;
    });

    const todayStr = new Date().toISOString().split("T")[0];
    const thisMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM

    const todayBills = sortedBills.filter(bill => bill.savedAt?.startsWith(todayStr));
    const monthBills = sortedBills.filter(bill => bill.savedAt?.startsWith(thisMonthStr));

    // টোটাল ক্যালকুলেশন
    const todayTotal = todayBills.reduce((sum, b) => sum + Number(b.net || 0), 0);
    const monthTotal = monthBills.reduce((sum, b) => sum + Number(b.net || 0), 0);

    // টপ প্রোডাক্ট (সিম্পল)
    const productMap = {};
    monthBills.forEach(bill => {
      bill.items?.forEach(item => {
        const key = item.item;
        if (!productMap[key]) {
          productMap[key] = { name: item.item, quantity: 0, total: 0 };
        }
        productMap[key].quantity += Number(item.quantity || 0);
        productMap[key].total += Number(item.taka || 0);
      });
    });

    const topProd = Object.values(productMap)
      .sort((a, b) => b.total - a.total)[0] || { name: "কোনো বিক্রি নেই", quantity: 0, total: 0 };

    setStats({
      todaySales: todayTotal,
      todayOrders: todayBills.length,
      monthSales: monthTotal,
      monthOrders: monthBills.length,
      topProduct: topProd,
    });

    setRecentBills(sortedBills.slice(0, 8));
  }, []);

  const convertToBangla = (num) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num.toString().split("").map(d => banglaDigits[parseInt(d)] || d).join("");
  };

  const goBack = () => window.history.back();

  const goToAllBills = () => {
    window.location.href = "/customer"; // আপনার বিল লিস্ট পেজের পথ দিন
    // অথবা react-router থাকলে: navigate("/customer-bills")
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        
        {/* হেডার + মোবাইল ব্যাক বাটন */}
        <div className="flex items-center gap-3 mb-6 sm:mb-10">
          <button
            onClick={goBack}
            className="text-3xl text-gray-700 hover:text-gray-900 sm:hidden"
            aria-label="ফিরে যান"
          >
            ←
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
            রিপোর্ট ও সামারি
          </h1>
        </div>

        {/* সামারি কার্ডস */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow border border-gray-200">
            <p className="text-sm text-gray-600 font-medium">আজকের বিক্রি</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-700 mt-1">
              ৳ {convertToBangla(Math.round(stats.todaySales))}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {convertToBangla(stats.todayOrders)} টি অর্ডার
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-xl shadow border border-gray-200">
            <p className="text-sm text-gray-600 font-medium">এই মাসের বিক্রি</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-700 mt-1">
              ৳ {convertToBangla(Math.round(stats.monthSales))}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {convertToBangla(stats.monthOrders)} টি অর্ডার
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-xl shadow border border-gray-200">
            <p className="text-sm text-gray-600 font-medium">টপ প্রোডাক্ট (মাস)</p>
            <p className="text-xl sm:text-2xl font-bold text-orange-700 mt-1 truncate">
              {stats.topProduct.name}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {convertToBangla(stats.topProduct.quantity)} টি • ৳ {convertToBangla(Math.round(stats.topProduct.total))}
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-xl shadow border border-gray-200">
            <p className="text-sm text-gray-600 font-medium">মোট বিল</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-700 mt-1">
              {convertToBangla(recentBills.length)}
            </p>
            <p className="text-sm text-gray-500 mt-1">সাম্প্রতিক দেখানো হচ্ছে</p>
          </div>
        </div>

        {/* সাম্প্রতিক বিলস */}
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="p-5 sm:p-6 border-b bg-orange-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-orange-800">
              সাম্প্রতিক ক্যাশ মেমো
            </h2>
            <button
              onClick={goToAllBills}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base flex items-center gap-1 whitespace-nowrap"
            >
              সব দেখুন →
            </button>
          </div>

          {recentBills.length === 0 ? (
            <div className="p-8 text-center text-gray-600 py-12">
              এখনো কোনো বিল সেভ করা হয়নি
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base min-w-[600px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">বিল নং</th>
                    <th className="px-4 py-3 text-left">ক্রেতা</th>
                    <th className="px-4 py-3 text-center">আইটেম</th>
                    <th className="px-4 py-3 text-right">নেট মূল্য</th>
                    <th className="px-4 py-3 text-center">তারিখ</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBills.map(bill => (
                    <tr key={bill.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">#{convertToBangla(bill.id)}</td>
                      <td className="px-4 py-3">{bill.customer?.name || "—"}</td>
                      <td className="px-4 py-3 text-center">{convertToBangla(bill.items?.length || 0)}</td>
                      <td className="px-4 py-3 text-right font-bold text-green-700">
                        ৳ {convertToBangla(Math.round(Number(bill.net) || 0))}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600 text-sm">
                        {bill.savedAt ? bill.savedAt.split("T")[0] : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* চার্ট / অতিরিক্ত সেকশনের জায়গা */}
        <div className="mt-8 bg-white rounded-xl shadow border p-6 sm:p-8 text-center text-gray-600 min-h-[280px] flex items-center justify-center">
          <div>
            <p className="text-lg font-medium mb-2">দৈনিক / সাপ্তাহিক / মাসিক সেলস চার্ট</p>
            <p className="text-sm">(পরে chart.js বা recharts যোগ করতে পারেন)</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportsOverview;