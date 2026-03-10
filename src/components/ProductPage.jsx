import React, { useState } from "react";

const ProductPage = () => {
  // ডেমো প্রোডাক্ট ডেটা (পরে props বা API থেকে আনবেন)
  const product = {
    id: 1,
    name: "প্রিমিয়াম সোনালী সুতির শার্ট",
    price: 1850,
    discountPrice: 1490,
    rating: 4.7,
    reviews: 128,
    description:
      "উচ্চমানের ১০০% কটন ফেব্রিক দিয়ে তৈরি এই শার্ট খুবই আরামদায়ক এবং টেকসই। গরমকালে পারফেক্ট। মেশিন ওয়াশ করা যায়। বিভিন্ন সাইজ ও কালারে পাওয়া যাচ্ছে।",
    features: [
      "১০০% প্রাকৃতিক কটন",
      "শ্বাস-প্রশ্বাসযোগ্য ফেব্রিক",
      "কলার স্টে সহ",
      "ডাবল স্টিচিং",
      "ফ্রি সাইজ চার্ট সহ",
    ],
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
      "https://images.unsplash.com/photo-1607345366928-199ea5fe3a09?w=800",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800",
    ],
    colors: ["সাদা", "কালো", "নীল", "ধূসর"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  };

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2]);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (type) => {
    if (type === "inc") setQuantity((prev) => prev + 1);
    if (type === "dec" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* প্রোডাক্ট মেইন সেকশন */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">
            {/* ইমেজ গ্যালারি */}
            <div className="p-4 sm:p-8 bg-gray-50">
              <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-auto object-cover aspect-square sm:aspect-[4/5] lg:aspect-square"
                />
              </div>

              {/* থাম্বনেইল */}
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`rounded-md overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? "border-orange-500 shadow-md"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - ${idx + 1}`}
                      className="w-full h-20 sm:h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* প্রোডাক্ট ইনফো */}
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-500 text-xl">★★★★★</span>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews} রিভিউ)
                  </span>
                </div>
                <span className="text-green-600 font-medium">ইন স্টক</span>
              </div>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl sm:text-5xl font-bold text-orange-600">
                  ৳{product.discountPrice}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  ৳{product.price}
                </span>
                <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  {Math.round(
                    ((product.price - product.discountPrice) / product.price) *
                      100
                  )}
                  % ছাড়
                </span>
              </div>

              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
                {product.description}
              </p>

              {/* কালার সিলেক্ট */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  কালার
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                        selectedColor === color
                          ? "bg-orange-100 border-orange-500 text-orange-700"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* সাইজ সিলেক্ট */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  সাইজ
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-md border text-sm font-medium flex items-center justify-center transition-all ${
                        selectedSize === size
                          ? "bg-orange-500 text-white border-orange-500"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* কোয়ান্টিটি + কার্ট */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange("dec")}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-lg font-bold"
                  >
                    -
                  </button>
                  <span className="px-6 py-3 text-lg font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("inc")}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-lg font-bold"
                  >
                    +
                  </button>
                </div>

                <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-md text-lg transition-all shadow-md hover:shadow-lg">
                  কার্টে যোগ করুন
                </button>
              </div>

              <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-all">
                এখনই কিনুন
              </button>
            </div>
          </div>
        </div>

        {/* অতিরিক্ত সেকশন: ফিচারস */}
        <div className="mt-10 bg-white rounded-xl shadow p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">বিশেষ বৈশিষ্ট্য</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3 text-gray-700">
                <span className="text-green-500 text-xl">✔</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;