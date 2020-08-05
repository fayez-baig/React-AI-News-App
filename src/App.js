import React, { useEffect } from "react";
import alanbtn from "@alan-ai/alan-sdk-web";
import "./App.css";

const alankey =
  "8f9b78127541ee0bf44c4792b9200f452e956eca572e1d8b807a3e2338fdd0dc/stage";
function App() {
  useEffect(() => {
    alanbtn({
      key: alankey,
    });
  }, []);

  return (
    <div className="App">
      <h1>AI NEWS APP</h1>
    </div>
  );
}

export default App;
