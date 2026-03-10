import React, { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState({
    shopName: "ভিশন ফ্লো সার্ভিসেস লিমিটেড",
    ownerName: "আব্দুল কাদির",
    mobile: "০১৭২৯-৬২৮৪০২",
    address: " হেমায়েতপুর বটতলা বাজার, দামুড়হুদা, চুয়াডাঙ্গা",
    description: "আমাদের দোকানে সব ধরনের দৈনন্দিন পণ্য পাওয়া যায়। সাশ্রয়ী মূল্যে ভালো মানের পণ্য।",
    logoUrl: "/public/myPic.jpeg", // পরে আপনার লোগো URL দিন
  });

  const [stats, setStats] = useState({
    totalBills: 0,
    totalSales: 0,
    thisMonthSales: 0,
  });

  useEffect(() => {
    // লোকাল স্টোরেজ থেকে দোকানের প্রোফাইল লোড
    const savedProfile = JSON.parse(localStorage.getItem("shopProfile") || "{}");
    if (savedProfile.shopName) {
      setProfile((prev) => ({ ...prev, ...savedProfile }));
    }

    // বিল থেকে স্ট্যাটিসটিক্স ক্যালকুলেট
    const savedBills = JSON.parse(localStorage.getItem("savedCashMemos") || "[]");
    const totalBills = savedBills.length;
    const totalSales = savedBills.reduce((sum, bill) => sum + Number(bill.net || 0), 0);

    const thisMonth = new Date().toISOString().slice(0, 7);
    const monthSales = savedBills
      .filter(bill => bill.savedAt?.startsWith(thisMonth))
      .reduce((sum, bill) => sum + Number(bill.net || 0), 0);

    setStats({ totalBills, totalSales, thisMonthSales: monthSales });
  }, []);

  const convertToBangla = (num) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num.toString().split("").map(d => banglaDigits[parseInt(d)] || d).join("");
  };

  const goBack = () => window.history.back();

  const handleEditProfile = () => {
    // এখানে Edit Profile পেজে নিয়ে যান বা modal খুলুন
    alert("এডিট প্রোফাইল ফিচার শীঘ্রই যোগ করা হবে!");
    // অথবা: window.location.href = "/edit-profile";
  };

  const handleLogout = () => {
    if (window.confirm("আপনি কি লগআউট করতে চান?")) {
      // লগআউট লজিক (localStorage.clear() বা auth signOut)
      localStorage.clear();
      window.location.href = "/login"; // বা আপনার লগইন পেজ
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">

        {/* হেডার + ব্যাক বাটন (মোবাইলে) */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <button
            onClick={goBack}
            className="text-3xl text-gray-700 hover:text-gray-900 sm:hidden"
            aria-label="ফিরে যান"
          >
            ←
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
            আমার প্রোফাইল
          </h1>
        </div>

        {/* প্রোফাইল কার্ড */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 mb-8">
          {/* কভার / প্রোফাইল হেডার */}
          <div className="h-32 sm:h-40 bg-gradient-to-r from-orange-400 to-orange-600 relative">
            <div className="absolute -bottom-12 left-6 sm:left-8">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                <img
                  src={profile.logoUrl}
                  alt="দোকানের লোগো"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* প্রোফাইল ইনফো */}
          <div className="pt-16 sm:pt-20 px-6 sm:px-8 pb-6 sm:pb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {profile.shopName}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              মালিক: {profile.ownerName}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm sm:text-base">
              <div className="flex items-center gap-3">
                <span className="text-gray-500">📱</span>
                <div>
                  <p className="font-medium">মোবাইল</p>
                  <p>{profile.mobile}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500">📍</span>
                <div>
                  <p className="font-medium">ঠিকানা</p>
                  <p>{profile.address}</p>
                </div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              {profile.description}
            </p>

            {/* স্ট্যাটিসটিক্স */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-b">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-blue-700">
                  {convertToBangla(stats.totalBills)}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">মোট বিল</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-green-700">
                  ৳{convertToBangla(Math.round(stats.totalSales))}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">মোট বিক্রি</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-orange-700">
                  ৳{convertToBangla(Math.round(stats.thisMonthSales))}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">এই মাস</p>
              </div>
            </div>

            {/* অ্যাকশন বাটন */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleEditProfile}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-md"
              >
                প্রোফাইল এডিট করুন
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-md"
              >
                লগআউট
              </button>
            </div>
          </div>
        </div>

        {/* অতিরিক্ত অপশন (যেমন: পাসওয়ার্ড চেঞ্জ, সাপোর্ট ইত্যাদি) */}
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-600">
          <p>অন্যান্য অপশন শীঘ্রই যোগ করা হবে (পাসওয়ার্ড পরিবর্তন, সাপোর্ট, ইত্যাদি)</p>
        </div>

      </div>
    </div>
  );
};

export default Profile;