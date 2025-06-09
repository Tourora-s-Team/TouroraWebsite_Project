import React, { useState } from "react";
import PlaneTicketsForm from "../components/PlaneTicketsForm";
import FlightResultsList from "../components/FlightResultsList"; // giả sử bạn đã có component này

const PlaneTicketsPage = () => {
  const [results, setResults] = useState([]);

  const handleSearch = (formData) => {
    // Bạn có thể fetch từ API thật ở đây, ví dụ:
    // fetchFlightResults(formData).then(setResults);

    // Ví dụ dữ liệu mẫu:
    const sampleResults = [
      {
        airline: "VietJet Air",
        airlineLogo: "/images/airlines/vietjet.png",
        from: formData.departure,
        to: formData.destination,
        date: formData.departDate,
        price: 1603979,
      },
      {
        airline: "Vietnam Airlines",
        airlineLogo: "/images/airlines/vna.png",
        from: formData.departure,
        to: formData.destination,
        date: formData.departDate,
        price: 1989000,
      },
    ];

    setResults(sampleResults);
  };

  return (
    <div className="p-4">
      <PlaneTicketsForm onSearch={handleSearch} />
      {results.length > 0 && (
        <div className="mt-6">
          <FlightResultsList results={results} />
        </div>
      )}
    </div>
  );
};

export default PlaneTicketsPage;
