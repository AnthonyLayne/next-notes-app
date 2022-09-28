import { ChangeEvent, memo, useState, useCallback } from "react";
import { useRouter } from "next/router";

// Components
import { Input } from "components/common/Input";

// Context
import { useAuthContext } from "context/authContext";

// Styles
import styles from "./styles.module.css";

export const Login = memo(() => {
  const router = useRouter();
  const { handleSignIn, auth } = useAuthContext();
  // TODO: sign out probably put on the header? Check design googlekeep, redirect to notes page after successful sign in

  const [{ username, password }, setData] = useState({ username: "", password: "" });

  const handleChange = useCallback(
    ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) => setData((prev) => ({ ...prev, [name]: value })),
    []
  );

  if (auth.loggedIn) router.push("/notes");

  return (
    <div className={styles.wrapper}>
      <h1>Please log in to view your notes.</h1>

      <form>
        <Input
          required
          type="username"
          autoComplete="username"
          id="username"
          aria-label="username"
          labelText="username"
          className={styles.username}
          name="username"
          value={username}
          onChange={handleChange}
        />

        <Input
          required
          type="password"
          autoComplete="current-password"
          id="password"
          aria-label="password"
          labelText="password"
          className={styles.password}
          name="password"
          value={password}
          onChange={handleChange}
        />

        <button
          type="button"
          aria-label="login"
          className={styles.loginButton}
          onClick={() => {
            handleSignIn({ username, password });
          }}
        >
          Login
        </button>

        {auth.loggedIn ? <h4>Redirecting to your notes.</h4> : <h4>Incorrect username or password.</h4>}
      </form>
    </div>
  );
});
