import React from "react";
import PlaneTicketsForm from "../components/PlaneTicketsForm";
import FlightSuggestionsForm from "../components/FlightSuggestionsForm";

const PlaneTicketsPage = () => {
  return (
    <div>
      <PlaneTicketsForm />
      <FlightSuggestionsForm />
    </div>
  );
};

export default PlaneTicketsPage;
