import { memo, FC, useState, useEffect, useMemo } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";

// Context
import { NotesContextProviderComponent } from "context/notesContext";
import { AuthContextProviderComponent, useAuthContext } from "context/authContext";

// Hooks
import { usePageTitle } from "hooks/usePageTitle";
import { useRouting } from "hooks/useRouting";

// Types
import { TProps as LayoutProps } from "components/common/Layout";
import { EmptyLayout } from "components/common/Layout/EmptyLayout";

import "../styles/globals.css";

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

  if (loading) return <div>Loading...</div>;
  // ------------------------------------------------------------------------------------------------------------------

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

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
        <NotesApp
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
        />
      </NotesContextProviderComponent>
    </AuthContextProviderComponent>
  );
});

export default NotesAppWrapper;
