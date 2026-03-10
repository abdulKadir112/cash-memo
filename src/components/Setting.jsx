import React, { useState, useEffect } from "react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("bn"); // bn = বাংলা, en = English
  const [notifications, setNotifications] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Dark mode লোড + অ্যাপ্লাই
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Dark mode টগল
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // ভাষা পরিবর্তন (এখানে শুধু UI-তে দেখানো হচ্ছে, আসল i18n লাইব্রেরি থাকলে সেটা ব্যবহার করুন)
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    setMessage({
      text: lang === "bn" ? "ভাষা বাংলায় পরিবর্তন হয়েছে" : "Language changed to English",
      type: "success",
    });
  };

  const goBack = () => window.history.back();

  const handlePasswordChange = () => {
    // এখানে আসল পাসওয়ার্ড চেঞ্জ লজিক বা modal খোলা যাবে
    alert("পাসওয়ার্ড পরিবর্তন ফিচার শীঘ্রই যোগ করা হবে।");
    // অথবা: navigate("/change-password");
  };

  const showTerms = () => {
    alert("Terms & Conditions:\n\n১. এই অ্যাপ শুধুমাত্র ব্যক্তিগত ব্যবহারের জন্য।\n২. কোনো অবৈধ কাজে ব্যবহার করা যাবে না।\n৩. ডেটা লোকাল স্টোরেজে সেভ হয়, ব্যাকআপ নিজে নিন।");
    // ভবিষ্যতে আলাদা পেজ বা modal-এ দেখানো যাবে
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">

        {/* হেডার */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <button
            onClick={goBack}
            className="text-3xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white sm:hidden"
            aria-label="ফিরে যান"
          >
            ←
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-400">
            সেটিংস
          </h1>
        </div>

        {/* মেসেজ */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg text-center ${
              message.type === "success"
                ? "bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-200"
                : "bg-red-100 dark:bg-red-800/30 text-red-800 dark:text-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">

          {/* ডার্ক মোড */}
          <div className="p-5 sm:p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">ডার্ক মোড</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">আপনার চোখের জন্য আরামদায়ক ডিজাইন</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* ভাষা */}
          <div className="p-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">ভাষা</h3>
            <div className="flex gap-4">
              <button
                onClick={() => changeLanguage("bn")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  language === "bn"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => changeLanguage("en")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  language === "en"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* পাসওয়ার্ড পরিবর্তন */}
          <div className="p-5 sm:p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">পাসওয়ার্ড পরিবর্তন</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">আপনার অ্যাকাউন্ট সুরক্ষিত রাখুন</p>
            </div>
            <button
              onClick={handlePasswordChange}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
              পরিবর্তন করুন
            </button>
          </div>

          {/* নোটিফিকেশন */}
          <div className="p-5 sm:p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">নোটিফিকেশন</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">নতুন বিল বা আপডেটের নোটিফিকেশন</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Terms & Conditions */}
          <div className="p-5 sm:p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">শর্তাবলী (Terms & Conditions)</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">অ্যাপ ব্যবহারের নিয়মাবলী</p>
            </div>
            <button
              onClick={showTerms}
              className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all"
            >
              দেখুন
            </button>
          </div>

          {/* লগআউট */}
          <div className="p-5 sm:p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                if (window.confirm("আপনি কি লগআউট করতে চান?")) {
                  localStorage.clear();
                  window.location.href = "/login";
                }
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-md"
            >
              লগআউট
            </button>
          </div>
        </div>

        {/* অতিরিক্ত নোট */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          সেটিংস স্বয়ংক্রিয়ভাবে সেভ হয় • সংস্করণ ১.০.০
        </p>
      </div>
    </div>
  );
};

export default Settings;