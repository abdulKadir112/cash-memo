import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // যদি রাউটার ব্যবহার করেন, না হলে button দিয়ে replace করুন

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
    // লোকাল স্টোরেজ থেকে বিলগুলো নেওয়া (আপনার আগের কোডের সাথে মিল রেখে)
    const savedBills = JSON.parse(localStorage.getItem("savedCashMemos") || "[]");

    // সর্ট করে সবচেয়ে নতুনগুলো প্রথমে
    const sortedBills = savedBills.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));

    // আজকের ডেটা ফিল্টার
    const today = new Date().toISOString().split("T")[0];
    const todayBills = sortedBills.filter((bill) => bill.savedAt?.startsWith(today));

    // এই মাসের ডেটা
    const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthBills = sortedBills.filter((bill) => bill.savedAt?.startsWith(thisMonth));

    // ক্যালকুলেশন
    const todayTotal = todayBills.reduce((sum, bill) => sum + (Number(bill.net) || 0), 0);
    const monthTotal = monthBills.reduce((sum, bill) => sum + (Number(bill.net) || 0), 0);

    // টপ প্রোডাক্ট (সিম্পল ভার্সন)
    const productMap = {};
    monthBills.forEach((bill) => {
      bill.items.forEach((item) => {
        const key = item.item;
        if (!productMap[key]) {
          productMap[key] = { name: item.item, quantity: 0, total: 0 };
        }
        productMap[key].quantity += Number(item.quantity) || 0;
        productMap[key].total += Number(item.taka) || 0;
      });
    });

    const topProd = Object.values(productMap).sort((a, b) => b.total - a.total)[0] || {
      name: "কোনো বিক্রি নেই",
      quantity: 0,
      total: 0,
    };

    setStats({
      todaySales: todayTotal,
      todayOrders: todayBills.length,
      monthSales: monthTotal,
      monthOrders: monthBills.length,
      topProduct: topProd,
    });

    // সাম্প্রতিক ৮টা বিল
    setRecentBills(sortedBills.slice(0, 8));
  }, []);

  const convertToBangla = (num) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((d) => banglaDigits[parseInt(d)] || d)
      .join("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-6 sm:mb-10 text-center sm:text-left">
          সকল রিপোর্ট ও সামারি
        </h1>

        {/* কার্ড গ্রিড - সামারি */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-200">
            <p className="text-sm text-gray-600 font-medium">আজকের বিক্রি</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-700 mt-2">
              ৳ {convertToBangla(stats.todaySales)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {convertToBangla(stats.todayOrders)} টি অর্ডার
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-200">
            <p className="text-sm text-gray-600 font-medium">এই মাসের বিক্রি</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-700 mt-2">
              ৳ {convertToBangla(stats.monthSales)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {convertToBangla(stats.monthOrders)} টি অর্ডার
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-200">
            <p className="text-sm text-gray-600 font-medium">টপ প্রোডাক্ট (মাস)</p>
            <p className="text-xl sm:text-2xl font-bold text-orange-700 mt-2 truncate">
              {stats.topProduct.name}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {convertToBangla(stats.topProduct.quantity)} টি • ৳{" "}
              {convertToBangla(stats.topProduct.total)}
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-200">
            <p className="text-sm text-gray-600 font-medium">মোট বিল সংখ্যা</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-700 mt-2">
              {convertToBangla(recentBills.length + (stats.monthOrders - recentBills.length || 0))}
            </p>
            <p className="text-sm text-gray-500 mt-1">সেভ করা সব বিল</p>
          </div>
        </div>

        {/* সাম্প্রতিক বিলস */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="p-5 sm:p-6 border-b bg-orange-50 flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-orange-800">
              সাম্প্রতিক ক্যাশ মেমো
            </h2>
            <Link
              to="/bills" // আপনার CustomerBills পেজের পথ
              className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
            >
              সব দেখুন →
            </Link>
          </div>

          {recentBills.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
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
                  {recentBills.map((bill) => (
                    <tr key={bill.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">#{convertToBangla(bill.id)}</td>
                      <td className="px-4 py-3">{bill.customer?.name || "—"}</td>
                      <td className="px-4 py-3 text-center">{convertToBangla(bill.items.length)}</td>
                      <td className="px-4 py-3 text-right font-bold text-green-700">
                        ৳ {convertToBangla(bill.net)}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600 text-sm">
                        {bill.savedAt?.split("T")[0] || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* চার্টের জায়গা (ভবিষ্যতে যোগ করতে পারেন) */}
        <div className="mt-8 bg-white rounded-xl shadow-md border border-gray-200 p-6 sm:p-8 text-center text-gray-500 min-h-[300px] flex items-center justify-center">
          <div>
            <p className="text-lg font-medium">দৈনিক / মাসিক সেলস চার্ট</p>
            <p className="text-sm mt-2">(chart.js / recharts এখানে যোগ করুন)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsOverview;