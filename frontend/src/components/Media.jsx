export function Media({ url, type }) {
  if (!url) return null;

  const optimizedUrl = url.replace(
    "/upload/",
    "/upload/w_auto,c_limit,q_auto,f_auto/",
  );

  if (type === "image") {
    return <img src={optimizedUrl} loading="lazy" />;
  }

  return null;
}
