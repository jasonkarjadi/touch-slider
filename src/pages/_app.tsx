import "../styles.css";
import { AppProps } from "next/dist/shared/lib/router/router";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default MyApp;
