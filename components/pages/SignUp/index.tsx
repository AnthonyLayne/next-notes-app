import { ChangeEvent, FormEvent, memo, useState, useCallback } from "react";

// Components
import { Input } from "components/common/Input";

// Context
import { useAuthContext } from "context/authContext";

// Styles
import styles from "./styles.module.css";

export const SignUp = memo(() => {
  const { handleSignUp } = useAuthContext();

  const [{ username, password }, setData] = useState({ username: "", password: "" });

  const handleChange = useCallback(
    ({ target: { name, value } }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setData((prev) => ({ ...prev, [name]: value })),
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await handleSignUp({ username, password });
    },
    [handleSignUp, username, password]
  );

  return (
    <div className={styles.wrapper}>
      <h1>Please sign up to begin taking notes.</h1>

      <form onSubmit={handleSubmit}>
        <Input
          required
          autoComplete="username"
          id="username"
          ariaLabel="username"
          label="username"
          className={styles.username}
          name="username"
          value={username}
          onChange={handleChange}
          input={{ type: "text" }}
        />
        <Input
          required
          autoComplete="current-password"
          id="password"
          ariaLabel="password"
          label="password"
          className={styles.password}
          name="password"
          value={password}
          onChange={handleChange}
          input={{ type: "password" }}
        />

        {/* // TODO: Add confirm password */}

        <button type="submit" aria-label="login" className={styles.signUpButton}>
          Sign Up
        </button>
        {/* {auth.loggedIn ? <h4>Redirecting to your notes.</h4> : <h4>Incorrect username or password.</h4>} */}
      </form>
    </div>
  );
});
