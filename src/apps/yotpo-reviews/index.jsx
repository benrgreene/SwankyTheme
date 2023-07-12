import React from "react";
import * as ReactDOM from 'react-dom/client';
import YotpoReviewsApp from './YotpoReviewsApp.jsx';

document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.querySelector("#YotpoReviews");
  const propsRaw = appContainer.getAttribute("props");
  const finalProps = JSON.parse(propsRaw);

  const root = ReactDOM.createRoot(appContainer);
  root.render(<YotpoReviewsApp data={finalProps} />);
});
