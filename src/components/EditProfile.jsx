import React, { useState, useEffect } from "react";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    mobile: "",
    address: "",
    description: "",
    logoUrl: "", // এটা preview-এর জন্য
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" }); // success / error
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // লোকাল স্টোরেজ থেকে আগের ডেটা লোড
    const savedProfile = JSON.parse(localStorage.getItem("shopProfile") || "{}");
    setFormData({
      shopName: savedProfile.shopName || "ভিশন ফ্লো সার্ভিসেস লিমিটেড",
      ownerName: savedProfile.ownerName || "আব্দুল কাদির",
      mobile: savedProfile.mobile || "০১৭২৯-৬২৮৪০২",
      address: savedProfile.address || "হেমায়েতপুর বটতলা বাজার, দামুড়হুদা, চুয়াডাঙ্গা",
      description:
        savedProfile.description ||
        "আমাদের দোকানে সব ধরনের দৈনন্দিন পণ্য পাওয়া যায়। সাশ্রয়ী মূল্যে ভালো মানের পণ্য।",
      logoUrl: savedProfile.logoUrl || "/public/myPic.jpeg",
    });
    setPreviewImage(savedProfile.logoUrl || null);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData((prev) => ({ ...prev, logoUrl: reader.result })); // base64 সেভ করা হচ্ছে
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      // localStorage-এ সেভ
      localStorage.setItem("shopProfile", JSON.stringify(formData));

      setMessage({
        text: "প্রোফাইল সফলভাবে আপডেট হয়েছে!",
        type: "success",
      });

      // ২ সেকেন্ড পরে প্রোফাইল পেজে ফিরে যাওয়া
      setTimeout(() => {
        window.history.back();
      }, 2000);
    } catch (error) {
      setMessage({
        text: "কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const goBack = () => window.history.back();

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
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
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
            প্রোফাইল এডিট করুন
          </h1>
        </div>

        {/* মেসেজ */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg text-center ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
          {/* লোগো আপলোড */}
          <div className="mb-8 text-center">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              দোকানের লোগো / প্রোফাইল ছবি
            </label>
            <div className="relative inline-block">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-gray-200 mx-auto bg-gray-100">
                <img
                  src={previewImage || "https://via.placeholder.com/160?text=Logo"}
                  alt="প্রিভিউ"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-700">
                <span className="text-xl">+</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ছবি আপলোড করতে উপরের + আইকনে ক্লিক করুন
            </p>
          </div>

          {/* ফিল্ডস */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                দোকানের নাম *
              </label>
              <input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                মালিকের নাম *
              </label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                মোবাইল নম্বর *
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ঠিকানা
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                দোকানের বিবরণ
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* বাটন */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className={`flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-md ${
                isSaving ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSaving ? "সেভ হচ্ছে..." : "সেভ করুন"}
            </button>

            <button
              type="button"
              onClick={goBack}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-md"
            >
              বাতিল করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;