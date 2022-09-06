import { memo } from "react";

// { logIn, logOut }
export const Login = memo(() => {
  // const { loginState, setLoginState } = useState();

  const onLoginClick = () => {
    // setLoginState();
  };

  return (
    <div className="login-page-wrapper">
      <form>
        Please log in to view your notes.
        <input className="username-input" placeholder="username" />
        <input className="password-input" placeholder="password" />
        <button type="button" aria-label="login" className="login-button" placeholder="Login" onClick={onLoginClick} />
      </form>
    </div>
  );
});

// const mapStateToProps = (state) => ({
//   username: state.username,
//   password: state.password,
// });

// export default connect(mapStateToProps, { logIn, logOut })(Login);
