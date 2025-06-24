import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Minus,
  Calendar,
  CreditCard,
  Shield,
} from "lucide-react";
import { useBooking } from "./BookingContext.jsx";

const Booking = () => {
  const { id } = useParams();
  console.log("Booking.jsx id param:", id);
  const location = useLocation();
  const navigate = useNavigate();
  const { createBooking, getTourById } = useBooking();

  const [tour, setTour] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [travelers, setTravelers] = useState([]);
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [useCashPayment, setUseCashPayment] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  // Thêm state cho thông báo thành công
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Thêm kiểm tra này ngay đầu useEffect để xử lý trường hợp ID bị thiếu
    if (!id) {
      console.error("Booking ID is missing in URL parameters.");
      navigate("/"); // Chuyển hướng về trang chủ nếu không có ID
      return; // Dừng việc thực thi các logic tiếp theo của useEffect
    }

    if (location.state?.tour) {
      const tour = location.state.tour;
      setTour(tour);
      const { selectedDate: date, travelers: travelerCount } = location.state;
      if (date) setSelectedDate(date);
      if (travelerCount) {
        const initialTravelers = Array.from(
          { length: travelerCount },
          (_, index) => ({
            id: (index + 1).toString(),
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            nationality: "",
            passportNumber: "",
            dietaryRequirements: "",
          })
        );
        setTravelers(initialTravelers);
      }
    } else {
      const fetchTourDetails = async () => {
        try {
          const response = await getTourById(id);
          if (response) {
            setTour(response);
            const initialTravelerCount = response.groupSize > 0 ? 1 : 0;
            const initialTravelers = Array.from(
              { length: initialTravelerCount },
              (_, index) => ({
                id: (index + 1).toString(),
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                dateOfBirth: "",
                nationality: "",
                passportNumber: "",
                dietaryRequirements: "",
              })
            );
            setTravelers(initialTravelers);
          } else {
            console.warn("Tour not found for ID:", id);
            navigate("/"); // Hoặc một 404 page
          }
        } catch (error) {
          console.error("Failed to fetch tour details:", error);
          navigate("/");
        }
      };
      fetchTourDetails(); // Gọi hàm fetchTourDetails vì id đã được kiểm tra ở đầu useEffect
    }
  }, [location.state, navigate, id, getTourById]);

  const addTraveler = () => {
    if (tour && travelers.length < tour.groupSize) {
      const newTraveler = {
        id: (travelers.length + 1).toString(),
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        nationality: "",
        passportNumber: "",
        dietaryRequirements: "",
      };
      setTravelers([...travelers, newTraveler]);
    }
  };

  const removeTraveler = (idToRemove) => {
    if (travelers.length > 1) {
      setTravelers(travelers.filter((t) => t.id !== idToRemove));
    }
  };

  const updateTraveler = (idToUpdate, field, value) => {
    setTravelers(
      travelers.map((t) => (t.id === idToUpdate ? { ...t, [field]: value } : t))
    );
  };

  const handlePayment = async () => {
    if (!tour || !selectedDate || travelers.length === 0) {
      alert("Vui lòng điền đầy đủ thông tin đặt tour trước khi thanh toán.");
      return;
    }

    // Xác thực các bước trước
    if (!isStepValid(1)) {
      alert("Vui lòng kiểm tra lại thông tin ngày và số khách.");
      setStep(1);
      return;
    }
    if (!isStepValid(2)) {
      alert("Vui lòng điền đầy đủ thông tin khách.");
      setStep(2);
      return;
    }

    // Xác thực thông tin thanh toán nếu không chọn tiền mặt
    if (!useCashPayment && !isStepValid(3)) {
      alert("Vui lòng điền đầy đủ thông tin thanh toán thẻ.");
      setStep(3);
      return;
    }

    setIsProcessing(true);
    setSuccessMessage(""); // Reset thông báo thành công

    try {
      // Dữ liệu đặt tour sẽ gửi đến backend
      const bookingDetails = {
        tourId: tour._id, // Lấy ID tour từ đối tượng tour
        travelers: travelers.map((t) => ({
          firstName: t.firstName,
          lastName: t.lastName,
          email: t.email,
          phone: t.phone,
          dateOfBirth: t.dateOfBirth,
          nationality: t.nationality,
          dietaryRequirements: t.dietaryRequirements,
          // Bổ sung passportNumber nếu cần, dựa trên schema backend
          // passportNumber: t.passportNumber,
        })),
        startDate: selectedDate,
        specialRequests: specialRequests,
        totalPrice: tour.price * travelers.length,
        paymentMethod: useCashPayment ? "cash" : "card",
        ...(useCashPayment
          ? {}
          : {
              cardDetails: {
                cardNumber: paymentData.cardNumber,
                expiryDate: paymentData.expiryDate,
                cvv: paymentData.cvv,
                cardholderName: paymentData.cardholderName,
              },
            }),
      };

      console.log("Sending booking details to backend:", bookingDetails);

      // --- GỌI API THỰC TẾ ---
      const response = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Đặt tour thất bại từ backend.");
      }

      const result = await response.json();
      console.log("Booking successful, response from backend:", result);

      // Kiểm tra xem backend trả về bookingId là result._id hay result.bookingId
      // Dựa trên console.log trước đó của bạn là `result.bookingId`, giữ nguyên.
      // Nếu backend trả về `_id`, bạn cần đổi thành `result._id`.
      const bookingId = result.bookingId;

      if (bookingId) {
        // Thiết lập thông báo thành công
        setSuccessMessage(
          "Đặt tour thành công! Bạn sẽ được chuyển hướng đến trang xác nhận."
        );
        // Chờ một chút trước khi điều hướng để người dùng kịp nhìn thấy thông báo
        setTimeout(() => {
          navigate(`/booking-confirmation/${bookingId}`);
        }, 2000); // Chuyển hướng sau 2 giây
      } else {
        throw new Error("Đặt tour thành công.");
      }
    } catch (error) {
      console.error("Booking failed:", error);
      alert(`Thông báo: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const isStepValid = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return selectedDate && travelers.length > 0;
      case 2:
        return travelers.every(
          (t) => t.firstName && t.lastName && t.email && t.dateOfBirth
        );
      case 3:
        if (useCashPayment) return true;
        return (
          paymentData.cardholderName &&
          paymentData.cardNumber &&
          paymentData.expiryDate &&
          paymentData.cvv
        );
      default:
        return false;
    }
  };

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin đặt tour...</p>
        </div>
      </div>
    );
  }

  // Tính tổng tiền dựa trên giá tour và số lượng khách
  const totalPrice = tour.price * travelers.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(`/Tourdetails/${id}`)}
          className="flex items-center space-x-2 text-gray-600 hover:text-sky-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Quay lại chi tiết tour</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((stepNumber) => (
                  <div
                    key={stepNumber}
                    className={`flex items-center ${
                      stepNumber < 3 ? "flex-1" : ""
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                        step >= stepNumber
                          ? "bg-sky-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {stepNumber}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {stepNumber === 1
                        ? "Chọn ngày & số khách"
                        : stepNumber === 2
                        ? "Thông tin khách"
                        : "Thanh toán"}
                    </span>
                    {stepNumber < 3 && (
                      <div className="flex-1 h-0.5 bg-gray-200 ml-4">
                        <div
                          className={`h-full transition-all duration-300 ${
                            step > stepNumber ? "bg-sky-500" : "bg-gray-200"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Hiển thị thông báo thành công ở đây */}
              {successMessage && (
                <div
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"
                  role="alert"
                >
                  <strong className="font-bold">Thành công!</strong>
                  <span className="block sm:inline"> {successMessage}</span>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Chọn ngày & số khách
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày khởi hành
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số lượng khách
                      </label>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() =>
                            removeTraveler(travelers[travelers.length - 1]?.id)
                          }
                          disabled={travelers.length <= 1}
                          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-5 w-5" />
                        </button>
                        <span className="text-lg font-medium">
                          {travelers.length}
                        </span>
                        <button
                          onClick={addTraveler}
                          disabled={tour && travelers.length >= tour.groupSize}
                          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Tối đa {tour.groupSize} khách mỗi đơn đặt
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Thông tin khách
                  </h3>
                  <div className="space-y-6">
                    {travelers.map((traveler, index) => (
                      <div
                        key={traveler.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <h4 className="font-medium text-gray-900 mb-4">
                          Khách {index + 1} {index === 0 && "(Liên hệ chính)"}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Họ *
                            </label>
                            <input
                              type="text"
                              value={traveler.firstName}
                              onChange={(e) =>
                                updateTraveler(
                                  traveler.id,
                                  "firstName",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tên *
                            </label>
                            <input
                              type="text"
                              value={traveler.lastName}
                              onChange={(e) =>
                                updateTraveler(
                                  traveler.id,
                                  "lastName",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email *
                            </label>
                            <input
                              type="email"
                              value={traveler.email}
                              onChange={(e) =>
                                updateTraveler(
                                  traveler.id,
                                  "email",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Số điện thoại
                            </label>
                            <input
                              type="tel"
                              value={traveler.phone}
                              onChange={(e) =>
                                updateTraveler(
                                  traveler.id,
                                  "phone",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Ngày sinh *
                            </label>
                            <input
                              type="date"
                              value={traveler.dateOfBirth}
                              onChange={(e) =>
                                updateTraveler(
                                  traveler.id,
                                  "dateOfBirth",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                              required
                            />
                          </div>
                          {/* Thêm trường Quốc tịch */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Quốc tịch
                            </label>
                            <input
                              type="text"
                              value={traveler.nationality}
                              onChange={(e) =>
                                updateTraveler(
                                  traveler.id,
                                  "nationality",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            />
                          </div>
                          {/* Thêm trường Yêu cầu đặc biệt */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Yêu cầu đặc biệt
                            </label>
                            <input
                              type="text"
                              value={traveler.dietaryRequirements}
                              onChange={(e) =>
                                updateTraveler(
                                  traveler.id,
                                  "dietaryRequirements",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                              placeholder="Yêu cầu ăn kiêng, hỗ trợ đặc biệt, hoặc ghi chú khác..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Thông tin thanh toán
                  </h3>
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <p className="text-sm text-blue-800">
                          Thông tin thanh toán của bạn được mã hóa và bảo mật
                        </p>
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={useCashPayment}
                          onChange={(e) => setUseCashPayment(e.target.checked)}
                          className="h-4 w-4 text-sky-500"
                        />
                        <span className="text-sm text-sky-600 font-medium ">
                          Thanh toán bằng tiền mặt khi khởi hành
                        </span>
                      </label>
                    </div>
                    {!useCashPayment && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên chủ thẻ *
                          </label>
                          <input
                            type="text"
                            value={paymentData.cardholderName}
                            onChange={(e) =>
                              setPaymentData({
                                ...paymentData,
                                cardholderName: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            placeholder="Nguyễn Văn A"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số thẻ *
                          </label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              value={paymentData.cardNumber}
                              onChange={(e) =>
                                setPaymentData({
                                  ...paymentData,
                                  cardNumber: e.target.value,
                                })
                              }
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                              placeholder="1234 5678 9012 3456"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày hết hạn *
                          </label>
                          <input
                            type="text"
                            value={paymentData.expiryDate}
                            onChange={(e) =>
                              setPaymentData({
                                ...paymentData,
                                expiryDate: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV *
                          </label>
                          <input
                            type="text"
                            value={paymentData.cvv}
                            onChange={(e) =>
                              setPaymentData({
                                ...paymentData,
                                cvv: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Quay lại
                </button>
                {step < 3 ? (
                  <button
                    onClick={() => {
                      if (isStepValid(step)) {
                        setStep(step + 1);
                      } else {
                        alert(
                          "Vui lòng điền đầy đủ thông tin bắt buộc trước khi tiếp tục."
                        );
                      }
                    }}
                    disabled={!isStepValid(step)}
                    className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tiếp tục
                  </button>
                ) : (
                  <button
                    onClick={handlePayment}
                    disabled={
                      isProcessing ||
                      (!useCashPayment && !isStepValid(3)) ||
                      (useCashPayment && !isStepValid(1)) || // Kiểm tra lại bước 1 cho tiền mặt
                      !isStepValid(2) // Luôn kiểm tra bước 2
                    }
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? "Đang xử lý..." : "Hoàn tất đặt tour"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Tóm tắt đặt tour
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <img
                    src={tour.image}
                    alt={tour.name}
                    className="w-20 h-20 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{tour.name}</h4>
                    <p className="text-sm text-gray-600">
                      {tour.duration} ngày
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Ngày khởi hành:</span>
                  <span className="font-medium">
                    {selectedDate
                      ? new Date(selectedDate).toLocaleDateString("vi-VN", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        })
                      : "Chưa chọn"}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Số lượng khách:</span>
                  <span className="font-medium">{travelers.length}</span>
                </div>
                {travelers.length > 0 && (
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Chi tiết khách:
                    </p>
                    {travelers.map((traveler, index) => (
                      <p key={traveler.id} className="text-xs text-gray-600">
                        {index + 1}. {traveler.lastName} {traveler.firstName} (
                        {traveler.dateOfBirth})
                      </p>
                    ))}
                  </div>
                )}
                {specialRequests && (
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Yêu cầu đặc biệt:
                    </p>
                    <p className="text-xs text-gray-600">{specialRequests}</p>
                  </div>
                )}
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Tổng cộng:
                </span>
                <span className="text-2xl font-bold text-sky-600">
                  {totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
