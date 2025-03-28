import React from "react";
import { Card } from "antd";
import "../../styles/deanslistcard.css"

const DeansListCard = ({ dean }) => {
  const {
    first_name,
    middle_name,
    last_name,
    suffix,
    user_id,
    department
  } = dean;

  return (
    <Card className="dean-card">
      <h2 className="dean-card-title">
        {first_name} {middle_name ? middle_name : ""} {last_name} {suffix ? suffix : ""}
        <span className="dean-id"> ({user_id})</span>
      </h2>
      <p className="dean-card-info"><strong>Department:</strong> {department}</p>
    </Card>
  );
};

export default DeansListCard;
