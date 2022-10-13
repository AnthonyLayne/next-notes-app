import { ChangeEvent, FormEvent, memo, useState, useCallback, useMemo } from "react";
import Link from "next/link";

// Components
import { Input } from "components/common/Input";
import { Button } from "components/common/Button";

// Context
import { useAuthContext } from "context/authContext";

// Helpers
import { getError } from "utils/format";

// Styles
import styles from "./styles.module.css";

const PASS_MATCH_ERR = "Passwords must match";

type TProps = {
  version: "sign-up" | "sign-in";
};

export const Authentication = memo(({ version }: TProps) => {
  const { handleSignIn, handleSignUp } = useAuthContext();

  const [{ username, password, confirmPass }, setData] = useState({ username: "", password: "", confirmPass: "" });
  const [error, setError] = useState("");

  const buttonDisabled = useMemo(
    () => (version === "sign-in" ? !username || !password : !username || !password || !confirmPass),
    [version, username, password, confirmPass]
  );

  const handleChange = useCallback(
    ({ target: { name, value } }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (version === "sign-up" && (name === "password" || name === "confirmPass") && error === PASS_MATCH_ERR) {
        setError("");
      }

      setData((prev) => ({ ...prev, [name]: value }));
    },
    [version, error]
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setError("");

      try {
        if (version === "sign-in") await handleSignIn({ username, password });
        else if (password === confirmPass) await handleSignUp({ username, password });
        else setError(PASS_MATCH_ERR);
      } catch (e: unknown) {
        setError(getError(e));
      }
    },
    [version, handleSignIn, handleSignUp, username, password, confirmPass]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h1>Welcome to Hold</h1>
        <h3>{version === "sign-in" ? "Please log in to view your notes." : "Please sign up to begin taking notes."}</h3>

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
            autoComplete={version === "sign-in" ? "current-password" : "new-password"}
            id="password"
            ariaLabel="password"
            label="Password"
            className={styles.password}
            name="password"
            value={password}
            onChange={handleChange}
            input={{ type: "password" }}
          />

          {version === "sign-up" && (
            <Input
              required
              autoComplete="new-password"
              id="confirmPass"
              ariaLabel="confirmPass"
              label="Confirm Password"
              className={styles.password}
              name="confirmPass"
              value={confirmPass}
              onChange={handleChange}
              input={{ type: "password" }}
            />
          )}

          <Button
            disabled={buttonDisabled}
            version="primary"
            type="submit"
            aria-label="login"
            className={styles.loginButton}
          >
            {version === "sign-in" ? "Login" : "Sign Up"}
          </Button>
        </form>

        <span className={styles.error}>{error}</span>

        <h3>{version === "sign-in" ? "No Account?" : "Already have an account?"}</h3>

        <Link href={version === "sign-in" ? "/sign-up" : "/"}>
          <a className={styles.link}>{version === "sign-in" ? "Sign Up" : "Login"}</a>
        </Link>
      </div>
    </div>
  );
});
