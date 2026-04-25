export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const getLoginUrl = () => {
  const next = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const url = new URL("/login", window.location.origin);
  url.searchParams.set("next", next || "/admin");
  return url.toString();
};
