import React from "react";
import * as ReactDOM from 'react-dom/client';
import Buybox from "./Buybox.jsx";


document.addEventListener('DOMContentLoaded', () => {
  const buyboxApp = document.querySelector('#ProductBuybox') || false;
  if (!buyboxApp) return;

  const propsRaw = buyboxApp.getAttribute("props");
  const finalProps = JSON.parse(propsRaw);

  const root = ReactDOM.createRoot(buyboxApp);
  root.render(<Buybox data={finalProps} />);

  window.listenToState((variant) => {
    if (!variant) return;

    const { origin, pathname } = window.location;
    const newURL = `${origin}${pathname}?variant=${variant.id}`;
    history.replaceState({}, '', newURL);
  }, 'selectedVariant');
});