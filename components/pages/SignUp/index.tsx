import { ChangeEvent, FormEvent, memo, useState, useCallback } from "react";
import Link from "next/link";

// Components
import { Input } from "components/common/Input";
import { Button } from "components/common/Button";

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
      <div className={styles.content}>
        <h1>Welcome to Hold</h1>
        <h3>Please sign up to begin taking notes.</h3>

        <form onSubmit={handleSubmit}>
          <Input
            required
            autoComplete="username"
            id="username"
            ariaLabel="username"
            label="Username"
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
            label="Password"
            className={styles.password}
            name="password"
            value={password}
            onChange={handleChange}
            input={{ type: "password" }}
          />

          {/* // TODO: Add confirm password */}

          <Button version="primary" type="submit" aria-label="sign up" className={styles.signUpButton}>
            Sign Up
          </Button>
          {/* {auth.loggedIn ? <h4>Redirecting to your notes.</h4> : <h4>Incorrect username or password.</h4>} */}
        </form>
        <h3>Already have an account?</h3>
        <Link href="/">
          <a className={styles.signIn}>Sign In</a>
        </Link>
      </div>
    </div>
  );
});
