import { Authentication } from "components/pages/Authentication";
import { EmptyLayout } from "components/common/Layout/EmptyLayout";

function Login() {
  return <Authentication version="sign-in" />;
}

export default Object.assign(Login, { EmptyLayout });
