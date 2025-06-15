import React, { useState } from "react";
import styles from "./RegisterForm.module.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const phonePattern = /^[0-9]{10}$/;
    if (!formData.username) return "Vui lòng nhập username.";
    if (!formData.fullname) return "Vui lòng nhập họ tên.";
    if (!formData.dateOfBirth) return "Vui lòng nhập ngày sinh.";
    if (!phonePattern.test(formData.phone)) return "Số điện thoại không hợp lệ.";
    if (!formData.email) return "Vui lòng nhập email.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Email không hợp lệ.";
    if (!formData.password) return "Vui lòng nhập mật khẩu.";
    if (formData.password !== formData.confirmPassword)
      return "Mật khẩu xác nhận không trùng khớp.";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      alert(error);
    } else {
      // Handle successful form submission here (e.g., fetch/axios POST)
      console.log("Form Submitted:", formData);
    }
  };

  return (
    <div
      id="form-container"
      className={styles.formContainer}
      style={{
        backgroundImage: "url('./assets/images/page-background.jpg')",
      }}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Đăng ký</h1>

        {[
          { label: "Họ và tên", name: "fullname", type: "text" },
          { label: "Ngày sinh", name: "dateOfBirth", type: "date" },
          { label: "Số điện thoại", name: "phone", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Username", name: "username", type: "text" },
          { label: "Mật khẩu", name: "password", type: "password" },
          {
            label: "Xác nhận mật khẩu",
            name: "confirmPassword",
            type: "password",
          },
        ].map(({ label, name, type }) => (
          <div className={styles.inputLabel} key={name}>
            <label htmlFor={name}>{label}</label>
            <br />
            <input
              id={name}
              className={styles.inputField}
              name={name}
              type={type}
              value={formData[name]}
              onChange={handleChange}
              placeholder={`Nhập ${label.toLowerCase()}`}
            />
            <br />
          </div>
        ))}

        <div className={styles.submitContainer}>
          <input id="submit-button" className={styles.submitButton} type="submit" value="Sign Up" />
        </div>

        <div className={styles.ortherSignUp}>
          <p className={styles.textDecor}>Or sign up using</p>
          <div className={styles.socialIcon}>
            <a href="https://web.facebook.com/" style={{ backgroundColor: "#0866ff" }}>
              <i className="fa-brands fa-facebook-f" />
            </a>
            <a href="https://trieuthien.github.io/" style={{ backgroundColor: "#2EA8EF" }}>
              <i className="fa-brands fa-twitter" />
            </a>
            <a href="https://www.google.com/" style={{ backgroundColor: "#EE4134" }}>
              <i className="fa-brands fa-google-plus-g" />
            </a>
          </div>
        </div>

        <div className={styles.webSignUp}>
          <a href="/login">Sign in</a>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
