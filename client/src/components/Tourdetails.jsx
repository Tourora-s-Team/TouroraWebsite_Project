import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./Tourdetails.css";
import {
  Star,
  MapPin,
  Calendar,
  Users,
  ArrowLeft,
  Heart,
  Share2,
  CheckCircle,
  XCircle,
} from "lucide-react";

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tour, setTour] = useState(location.state?.tour || null); // Ưu tiên lấy từ state
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Nếu chưa có tour từ state, mới gọi API
    if (!tour && id) {
      axios
        .get(`/api/tours/${id}`)
        .then((res) => setTour(res.data))
        .catch(() => navigate("/tours"));
    }
  }, [id, navigate, tour]);

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin tour.....</p>
        </div>
      </div>
    );
  }

  const totalPrice = tour.price * travelers;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 text-gray-600 hover:text-sky-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tours</span>
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {tour.title}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{tour.rating}</span>
                  {/* Nếu có reviewCount */}
                  {tour.reviewCount && (
                    <span>({tour.reviewCount} Đánh giá)</span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-5 w-5" />
                  <span>
                    {tour.location}
                    {tour.country ? `, ${tour.country}` : ""}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                <Heart className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-600 hover:text-sky-500 transition-colors">
                <Share2 className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="mb-4">
                <img
                  src={tour.gallery?.[selectedImage] || tour.image}
                  alt={tour.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              {tour.gallery && tour.gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {tour.gallery.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${tour.title} ${index + 1}`}
                      onClick={() => setSelectedImage(index)}
                      className={`w-full h-20 object-cover rounded-lg cursor-pointer ${
                        selectedImage === index ? "ring-2 ring-sky-500" : ""
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex space-x-8 border-b border-gray-200">
                {[
                  { key: "overview", label: "Overview" },
                  { key: "itinerary", label: "Itinerary" },
                  { key: "reviews", label: "Reviews" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-4 px-2 font-medium text-sm ${
                      activeTab === tab.key
                        ? "text-sky-600 border-b-2 border-sky-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="py-8">
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Tổng quan về Tour
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {tour.longDescription}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Đáng chú ý
                      </h3>
                      <ul className="space-y-2">
                        {tour.highlights?.map((highlight, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          Bao gồm
                        </h3>
                        <ul className="space-y-2">
                          {tour.included?.map((item, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-gray-600 text-sm">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          Không bao gồm
                        </h3>
                        <ul className="space-y-2">
                          {tour.excluded?.map((item, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                              <span className="text-gray-600 text-sm">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "itinerary" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Lịch trình từng ngày
                    </h3>
                    {tour.itinerary?.map((day, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-6"
                      >
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Day {day.day}: {day.title}
                        </h4>
                        <p className="text-gray-600 mb-4">{day.description}</p>
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-1">
                              Activities
                            </h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {day.activities?.map((activity, actIndex) => (
                                <li
                                  key={actIndex}
                                  className="flex items-center space-x-2"
                                >
                                  <span>•</span>
                                  <span>{activity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-1">
                              Meals
                            </h5>
                            <p className="text-sm text-gray-600">
                              {day.meals?.join(", ")}
                            </p>
                          </div>
                          {day.accommodation && (
                            <div>
                              <h5 className="font-medium text-gray-900 mb-1">
                                Accommodation
                              </h5>
                              <p className="text-sm text-gray-600">
                                {day.accommodation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Reviews
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="font-medium">{tour.rating}</span>
                        {tour.reviewCount && (
                          <span className="text-gray-500">
                            ({tour.reviewCount} reviews)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-600">
                      <p>
                        Reviews functionality will be implemented in the next
                        version.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  {tour.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      ${tour.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-2xl font-bold text-sky-600">
                    ${tour.price?.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Travelers
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      value={travelers}
                      onChange={(e) => setTravelers(parseInt(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    >
                      {Array.from(
                        { length: tour.groupSize },
                        (_, i) => i + 1
                      ).map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Person" : "People"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate(`/booking/${tour.id}`, {
                    state: {
                      tour,
                      selectedDate,
                      travelers,
                    },
                  })
                }
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Đặt ngay
              </button>
              <div className="mt-4 text-center text-sm text-gray-500">
                Hủy miễn phí trước 24 giờ so với giờ khởi hành
              </div>
              {/* Tour Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Thông tin Tour
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Hành trình Tour</span>
                    <span className="font-medium">{tour.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Số người</span>
                    <span className="font-medium">Tối đa {tour.groupSize}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
