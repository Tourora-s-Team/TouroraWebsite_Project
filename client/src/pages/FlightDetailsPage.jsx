import React from "react";
import { useLocation } from "react-router-dom";
import FlightDetailsForm from "../components/PlaneTickets/FlightDetailsForm";

const FlightDetailsPage = () => {
  const location = useLocation();
  const searchParams = location.state?.search;

  return (
    <div>
      <FlightDetailsForm searchParams={searchParams} />
    </div>
  );
};

export default FlightDetailsPage;
