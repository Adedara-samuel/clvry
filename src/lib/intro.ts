/** Resolves once the intro screen has finished (or immediately if it was skipped). */
export function whenIntroDone(callback: () => void) {
  const html = document.documentElement;
  if (html.dataset.intro === "seen") {
    callback();
    return () => {};
  }
  const observer = new MutationObserver(() => {
    if (html.dataset.intro === "seen") {
      observer.disconnect();
      callback();
    }
  });
  observer.observe(html, { attributes: true, attributeFilter: ["data-intro"] });
  return () => observer.disconnect();
}
