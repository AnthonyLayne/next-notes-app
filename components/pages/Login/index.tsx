import { memo } from "react";

// Styles
import styles from "./styles.module.css";

// { logIn, logOut }
export const Login = memo(() => {
  // const { loginState, setLoginState } = useState();

  const onLoginClick = () => {
    // setLoginState();
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form}>
        Please log in to view your notes.
        <input className="username-input" placeholder="username" />
        <input className="password-input" placeholder="password" />
        <button
          type="button"
          aria-label="login"
          className={styles.loginButton}
          placeholder="Login"
          onClick={onLoginClick}
        />
      </form>
    </div>
  );
});
