import { EmptyLayout } from "components/common/Layout/EmptyLayout";
import { Authentication } from "components/pages/Authentication";

function SignUp() {
  return <Authentication version="sign-up" />;
}

export default Object.assign(SignUp, { EmptyLayout });
