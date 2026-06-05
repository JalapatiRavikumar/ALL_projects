import { useEffect, useState } from "react";

/**
 * Returns true only after the component has mounted on the client.
 *
 * Why this exists: form-filler / autofill browser extensions inject attributes
 * (e.g. jf-ext-*) into inputs and buttons BEFORE React hydrates, which makes the
 * server HTML differ from the client and triggers a hydration mismatch. By
 * rendering a stable, form-free skeleton during SSR + the first hydration pass
 * and only mounting the interactive UI afterwards, there is nothing for an
 * extension to mutate during hydration — so the mismatch cannot occur.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
