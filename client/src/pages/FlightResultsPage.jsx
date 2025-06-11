import React from "react";
import { useLocation } from "react-router-dom";
import FlightResultsForm from "../components/FlightResultsForm";

const FlightResultsPage = () => {
  const location = useLocation();
  const searchParams = location.state?.search;

  return (
    <div>
      <FlightResultsForm searchParams={searchParams} />
    </div>
  );
};

export default FlightResultsPage;
