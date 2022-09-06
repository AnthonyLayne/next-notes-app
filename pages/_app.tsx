import { memo, FC } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";

// Context
import { NotesContextProviderComponent } from "context/notesContext";

// Hooks
import { usePageTitle } from "hooks/usePageTitle";
import { useRouting } from "hooks/useRouting";

// Types
import { TProps as LayoutProps } from "components/common/Layout";
import { EmptyLayout } from "components/common/Layout/EmptyLayout";

import "../styles/globals.css";

type ComponentWithLayout = AppProps["Component"] & { Layout?: FC<LayoutProps> };

function NotesApp({ Component, pageProps, router }: AppProps) {
  const pageTitle = usePageTitle(router);
  useRouting(router);

  const Layout = (Component as ComponentWithLayout).Layout || EmptyLayout;

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
    <NotesContextProviderComponent>
      <NotesApp
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    </NotesContextProviderComponent>
  );
});

export default NotesAppWrapper;
