import React from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import styles from "./LoginForm.module.css";

const LoginForm = () => {
  const { setUser, setToken, setAccount } = useContext(UserContext);
  const navigate = useNavigate(); 
  const validateForm = (username, password) => {
    if (!username) return "Vui lòng nhập tên đăng nhập";
    if (!password) return "Vui lòng nhập mật khẩu";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;
    const error = validateForm(username, password);

    if (error) {
      alert(error);
      return;
    }

    const formData = { username, password };

    fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Server response:", data);
        if (data.success) {
          // Lưu token vào localStorage thông qua context
          setToken(data.token); 

          // Lưu dữ liệu vào context
          setUser(data.user); 
          setAccount(data.account)
          // Chuyển hướng đến trang chủ
          navigate("/")
        } else {
          alert("Có lỗi xảy ra: " + (data.message || "Không xác định"));
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Lỗi kết nối đến server");
      });
  };

  return (
    <div
      id="form-container"
      className={styles.formContainer}
      style={{ backgroundImage: `url('./assets/images/page-background.jpg')` }}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Đăng nhập</h1>

        <div className={styles.inputLabel}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Nhập username"
            className={styles.inputField}
          />
        </div>

        <div className={styles.inputLabel}>
          <label htmlFor="password">Mật khẩu</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Nhập mật khẩu"
            className={styles.inputField}
          />
        </div>

        <div className={styles.forgotPassword}>
          <a href="#">Forgot password?</a>
        </div>

        <div className={styles.submitContainer}>
          <input
            id="submit-button"
            className={styles.submitButton}
            type="submit"
            value="Login"
          />
        </div>

        <div className={styles.ortherSignUp}>
          <p className={styles.textDecor}>Or sign up using</p>
          <div className={styles.socialIcon}>
            <a style={{ backgroundColor: "#0866ff" }} href="https://web.facebook.com/">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a style={{ backgroundColor: "#2EA8EF" }} href="https://x.com/">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a style={{ backgroundColor: "#EE4134" }} href="https://www.google.com/">
              <i className="fa-brands fa-google-plus-g"></i>
            </a>
          </div>
        </div>

        <div className={styles.webSignUp}>
          <p className={styles.textDecor}>Or sign up using</p>
          <a href="/sign-up">Sign up</a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
