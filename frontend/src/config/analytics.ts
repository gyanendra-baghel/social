import ReactGA from "react-ga4";

ReactGA.initialize("G-8TNY06YGVY");

export const pageView = () => {
  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname + window.location.search,
    title: "Page Hit",
  });
};
