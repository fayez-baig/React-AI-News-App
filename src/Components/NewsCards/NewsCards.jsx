import React from "react";
import NewsCard from "../NewsCard/NewsCard";
import { Typography, Grow, Grid } from "@material-ui/core";
import useStyles from "./styles";

const infoCards = [
  { color: "#00838f", title: "Latest News", text: "Give me the latest news" },
  {
    color: "#1565c0",
    title: "News by Categories",
    info:
      "Business, Entertainment, General, Health, Science, Sports, Technology",
    text: "Give me the latest Technology news",
  },
  {
    color: "#4527a0",
    title: "News by Terms",
    info: "Bitcoin, PlayStation 5, Smartphones, Donald Trump...",
    text: "What's up with PlayStation 5",
  },
  {
    color: "#283593",
    title: "News by Sources",
    info: "CNN, Wired, BBC News, Time, IGN, Buzzfeed, ABC News...",
    text: "Give me the news from CNN",
  },
  {
    color: "#283593",
    title: "You Can do Simple Calculations",
    info: "addition, subtraction, multiplication, division",
    text: "how much is one plus one",
  },
  {
    color: "#1565c0",
    title: "Find the Current Date",
    text: "What is the Date",
  },
  {
    color: "#4527a0",
    title: "Find the Current Time",
    text: "What is the Current Time",
  },
  {
    color: "#00838f",
    title: "To stop Alan",
    text: "stop alan, thank you alan",
  },
];

const NewsCards = ({ articles, activeArticle }) => {
  const classes = useStyles();

  if (!articles.length) {
    return (
      <Grow in>
        <Grid
          container
          className={classes.container}
          alignItems="stretch"
          spacing={3}
        >
          {infoCards.map((infocard, i) => (
            <Grid
              key={i}
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className={classes.infoCard}
            >
              <div
                className={classes.card}
                style={{ backgroundColor: infocard.color }}
              >
                <Typography variant="h5">{infocard.title}</Typography>
                {infocard.info ? (
                  <Typography variant="h5">
                    <strong>
                      {infocard.title.split(" ")[2]}:<br />
                      {infocard.info}
                    </strong>
                  </Typography>
                ) : null}
                <Typography variant="h6">
                  Try Saying :<br />
                  <i>{infocard.text}</i>
                </Typography>
              </div>
            </Grid>
          ))}
        </Grid>
      </Grow>
    );
  }

  return (
    <Grow in>
      <Grid
        container
        className={classes.container}
        alignItems="stretch"
        spacing={3}
      >
        {articles.map((article, i) => (
          <Grid key={i} item sm={6} md={4} lg={3} style={{ display: "flex" }}>
            <NewsCard article={article} activeArticle={activeArticle} i={i} />
          </Grid>
        ))}
      </Grid>
    </Grow>
  );
};

export default NewsCards;
