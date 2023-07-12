import React, { useState, useEffect } from "react";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  useEffect(addEffect('YotpoQuestions', setSelectedPane), []);

  return (
    <div className="ccontain">

    </div>
  );
};

export default Questions;