import type { AppProps } from "next/app";

// Context
import { NotesContextProviderComponent } from "context/notesContext";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NotesContextProviderComponent>
      <Component
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...pageProps}
      />
    </NotesContextProviderComponent>
  );
}

export default MyApp;
