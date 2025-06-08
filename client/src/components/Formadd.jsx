import React from "react";
import styles from "./Formadd.module.css";
const FormAdd = () => {
  return (
    <div className="form-add-new">
      <form action="/create-tour" method="POST">
        <fieldset>
          <legend>Form search tour</legend>
          <div className="input-group">
            <label>Tour:</label>
            <input type="text" />
          </div>
          <div className="input-group">
            <label>Ngày bắt đầu:</label>
            <input type="text" />
          </div>
          <div className="input-group">
            <label>ngày kết thúc:</label>
            <input type="text" />
          </div>
          <div className="input-group">
            <label>Số người:</label>
            <input type="text" />
          </div>
          <div>
            <button type="submit"> save</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default FormAdd;
