import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ← যদি react-router ব্যবহার করেন

const Profile = () => {
  const navigate = useNavigate(); // ← যদি router থাকে, না থাকলে comment out করুন

  const [profile, setProfile] = useState({
    shopName: "ভিশন ফ্লো সার্ভিসেস লিমিটেড",
    ownerName: "আব্দুল কাদির",
    mobile: "০১৭২৯-৬২৮৪০২",
    address: "হেমায়েতপুর বটতলা বাজার, দামুড়হুদা, চুয়াডাঙ্গা",
    description:
      "আমাদের দোকানে সব ধরনের দৈনন্দিন পণ্য পাওয়া যায়। সাশ্রয়ী মূল্যে ভালো মানের পণ্য।",
    logoUrl: "/public/myPic.jpeg", // আপনার আসল পথ দিন
  });

  const [stats, setStats] = useState({
    totalBills: 0,
    totalSales: 0,
    thisMonthSales: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // লোকাল স্টোরেজ থেকে প্রোফাইল লোড
    const savedProfile = JSON.parse(localStorage.getItem("shopProfile") || "{}");
    if (savedProfile.shopName) {
      setProfile((prev) => ({ ...prev, ...savedProfile }));
    }

    // বিল থেকে স্ট্যাটিসটিক্স
    const savedBills = JSON.parse(localStorage.getItem("savedCashMemos") || "[]");
    const totalBills = savedBills.length;
    const totalSales = savedBills.reduce((sum, bill) => sum + Number(bill.net || 0), 0);

    const thisMonth = new Date().toISOString().slice(0, 7);
    const monthSales = savedBills
      .filter((bill) => bill.savedAt?.startsWith(thisMonth))
      .reduce((sum, bill) => sum + Number(bill.net || 0), 0);

    setStats({ totalBills, totalSales, thisMonthSales: monthSales });

    // লোডিং শেষ
    setTimeout(() => setIsLoading(false), 400); // অথবা আসল ডেটা আসার পর set করুন
  }, []);

  const convertToBangla = (num) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((d) => banglaDigits[parseInt(d)] || d)
      .join("");
  };

  const goBack = () => window.history.back();

  const handleEditProfile = () => {
    // react-router থাকলে:
    navigate("/edit-profile");
    // না থাকলে:
    // window.location.href = "/edit-profile";
  };

  const handleLogout = () => {
    if (window.confirm("আপনি কি লগআউট করতে চান?")) {
      localStorage.clear();
      window.location.href = "/login"; // আপনার লগইন পেজের পথ
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-700">প্রোফাইল লোড হচ্ছে...</p>
          <p className="text-sm text-gray-500 mt-2">অনুগ্রহ করে অপেক্ষা করুন</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 min-h-screen bg-gray-50 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        {/* হেডার + ব্যাক */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <button
            onClick={goBack}
            className="text-3xl text-gray-700 hover:text-gray-900 sm:hidden"
            aria-label="ফিরে যান"
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
              আমার প্রোফাইল
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              দোকানের তথ্য ও পরিসংখ্যান
            </p>
          </div>
        </div>

        {/* প্রোফাইল কার্ড */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 mb-8">
          {/* কভার */}
          <div className="h-32 sm:h-40 bg-gradient-to-r from-orange-400 to-orange-600 relative">
            <div className="absolute -bottom-12 left-6 sm:left-8">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg relative">
                <img
                  src={profile.logoUrl}
                  alt="দোকানের লোগো"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/128?text=Logo";
                    e.target.onerror = null;
                  }}
                />
                {/* ছোট edit hint (অপশনাল) */}
                <div className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow">
                  ✎
                </div>
              </div>
            </div>
          </div>

          {/* ইনফো */}
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
                  <a
                    href={`tel:${profile.mobile.replace(/[^0-9+]/g, "")}`}
                    className="text-blue-600 hover:underline"
                  >
                    {profile.mobile}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500">📍</span>
                <div>
                  <p className="font-medium">ঠিকানা</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      profile.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {profile.address}
                  </a>
                </div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              {profile.description}
            </p>

            {/* স্ট্যাটিসটিক্স - hover + ভালো ফরম্যাট */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-b">
              <div className="text-center hover:shadow-lg transition-shadow duration-200 rounded-lg p-3">
                <p className="text-2xl sm:text-3xl font-bold text-blue-700">
                  {convertToBangla(stats.totalBills)}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">মোট বিল</p>
              </div>
              <div className="text-center hover:shadow-lg transition-shadow duration-200 rounded-lg p-3">
                <p className="text-2xl sm:text-3xl font-bold text-green-700">
                  ৳{convertToBangla(Math.round(stats.totalSales).toLocaleString("bn-BD"))}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">মোট বিক্রি</p>
              </div>
              <div className="text-center hover:shadow-lg transition-shadow duration-200 rounded-lg p-3">
                <p className="text-2xl sm:text-3xl font-bold text-orange-700">
                  ৳{convertToBangla(Math.round(stats.thisMonthSales).toLocaleString("bn-BD"))}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">এই মাস</p>
              </div>
            </div>

            {/* বাটন */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleEditProfile}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-md disabled:opacity-50"
                disabled={isLoading}
              >
                প্রোফাইল এডিট করুন
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-md disabled:opacity-50"
                disabled={isLoading}
              >
                লগআউট
              </button>
            </div>
          </div>
        </div>

        {/* অতিরিক্ত অপশন */}
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-600">
          <p>অন্যান্য অপশন শীঘ্রই যোগ করা হবে (পাসওয়ার্ড পরিবর্তন, সাপোর্ট, ইত্যাদি)</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;