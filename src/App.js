import React, { useState, useEffect } from "react";
import alanbtn from "@alan-ai/alan-sdk-web";
import NewsCards from "./Components/NewsCards/NewsCards";
import { Container } from "@material-ui/core";
import "./App.css";

// apikey news api : b26d123d2db14cdea91b6726f9eb55cc

const alankey =
  "8f9b78127541ee0bf44c4792b9200f452e956eca572e1d8b807a3e2338fdd0dc/stage";

function App() {
  const [newArticles, setNewArticles] = useState([]);

  useEffect(() => {
    alanbtn({
      key: alankey,
      onCommand: ({ command, articles }) => {
        if (command === "newHeadlines") {
          setNewArticles(articles);
        }
      },
    });
  }, []);

  return (
    <Container>
      <div className="App">
        <h1>AI NEWS APP</h1>
        <NewsCards articles={newArticles} />
      </div>
    </Container>
  );
}

export default App;
