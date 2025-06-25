import React from "react";
import PlaneTicketsForm from "../components/PlaneTickets/PlaneTicketsForm";
import FlightSuggestionsForm from "../components/PlaneTickets/FlightSuggestionsForm";

const PlaneTicketsPage = () => {
  return (
    <div>
      <PlaneTicketsForm />
      <FlightSuggestionsForm />
    </div>
  );
};

export default PlaneTicketsPage;
