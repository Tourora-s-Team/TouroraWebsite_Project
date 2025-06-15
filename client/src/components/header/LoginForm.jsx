import React from "react";
import styles from "./LoginForm.module.css";

const LoginForm = () => {
  const checkBeforeLogin = (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;

    if (username === "") {
      alert("Vui lòng nhập tên đăng nhập");
    } else if (password === "") {
      alert("Vui lòng nhập mật khẩu");
    } else {
      // Gửi form (ví dụ: gọi API)
      console.log("Đăng nhập thành công với:", { username, password });
      // event.target.submit(); // Nếu cần gửi tới server
    }
  };

  return (
    <div
      id="form-container"
      className={styles.formContainer}
      style={{ backgroundImage: `url('./assets/images/page-background.jpg')` }}
    >
      <form className={styles.form} onSubmit={checkBeforeLogin}>
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
          <input id="submit-button" className={styles.submitButton} type="submit" value="Login" />
        </div>

        <div className={styles.ortherSignUp}>
          <p className={styles.textDecor}>Or sign up using</p>
          <div className={styles.socialIcon}>
            <a
              style={{ backgroundColor: "#0866ff" }}
              href="https://web.facebook.com/"
            >
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a
              style={{ backgroundColor: "#2EA8EF" }}
              href="https://x.com/"
            >
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a
              style={{ backgroundColor: "#EE4134" }}
              href="https://www.google.com/"
            >
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
