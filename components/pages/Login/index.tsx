import { ChangeEvent, FormEvent, memo, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

// Components
import { Input } from "components/common/Input";
import { Button } from "components/common/Button";

// Context
import { useAuthContext } from "context/authContext";

// Styles
import styles from "./styles.module.css";

export const Login = memo(() => {
  const router = useRouter();
  const { handleSignIn, auth } = useAuthContext();

  const [{ username, password }, setData] = useState({ username: "", password: "" });

  const handleChange = useCallback(
    ({ target: { name, value } }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setData((prev) => ({ ...prev, [name]: value })),
    []
  );
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await handleSignIn({ username, password });
    },
    [handleSignIn, username, password]
  );
  if (auth.loggedIn) router.push("/notes");

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h1>Welcome to Hold</h1>
        <h3>Please log in to view your notes.</h3>

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

          <Button version="primary" type="submit" aria-label="login" className={styles.loginButton}>
            Login
          </Button>
          {/* <div>This: {message}</div> */}
        </form>
        <h3>No Account?</h3>
        <Link href="/sign-up">
          <a className={styles.signUp}>Sign Up</a>
        </Link>
      </div>
    </div>
  );
});
