import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";

hydrate(<RemixBrowser />, document);

// FIXME: restore server side rendering. See https://github.com/remix-run/remix/issues/2947
// import { hydrateRoot } from "react-dom/client";
// hydrateRoot(document, <RemixBrowser />);
