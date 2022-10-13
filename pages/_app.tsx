import { memo, FC, useState, useEffect, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import type { AppProps } from "next/app";
import Head from "next/head";

// Context
import { AuthContextProviderComponent, useAuthContext } from "context/authContext";
import { NotesContextProviderComponent } from "context/notesContext";
import { SidebarContextProviderComponent } from "context/sidebarContext";

// Components
import { EmptyLayout } from "components/common/Layout/EmptyLayout";
import { Spinner } from "components/common/Spinner";

// Hooks
import { usePageTitle } from "hooks/usePageTitle";
import { useRouting } from "hooks/useRouting";

// Types
import { TProps as LayoutProps } from "components/common/Layout";

// Styles
import styles from "./app.module.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/index.css";

const MIN_LOAD_TIME_MS = 500;

type ComponentWithLayout = AppProps["Component"] & { Layout?: FC<LayoutProps> };

function NotesApp({ Component, pageProps, router }: AppProps) {
  const {
    auth: { initiallyLoading },
  } = useAuthContext();

  const pageTitle = usePageTitle(router);

  useRouting(router);

  const Layout = (Component as ComponentWithLayout).Layout || EmptyLayout;

  // ---- Minimum Load Animation --------------------------------------------------------------------------------------
  const initialNow = useMemo(() => Date.now(), []);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initiallyLoading) {
      const loadingAmountCompletedMs = Date.now() - initialNow;
      const minLoadTimeLeftMs = MIN_LOAD_TIME_MS - loadingAmountCompletedMs;
      setTimeout(() => setLoading(false), minLoadTimeLeftMs);
    }
  }, [initiallyLoading]);

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <Spinner />
      </div>
    );
  }
  // ------------------------------------------------------------------------------------------------------------------

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <ToastContainer />

      <Component
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...pageProps}
      />
    </Layout>
  );
}

const NotesAppWrapper = memo((props: AppProps) => {
  return (
    <AuthContextProviderComponent>
      <NotesContextProviderComponent>
        <SidebarContextProviderComponent>
          <NotesApp
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
          />
        </SidebarContextProviderComponent>
      </NotesContextProviderComponent>
    </AuthContextProviderComponent>
  );
});

export default NotesAppWrapper;
