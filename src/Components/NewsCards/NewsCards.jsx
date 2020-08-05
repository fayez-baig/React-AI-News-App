import React from "react";
import NewsCard from "../NewsCard/NewsCard";
import { Grow, Grid } from "@material-ui/core";
import useStyles from "./styles";

const NewsCards = ({ articles }) => {
  const classes = useStyles();
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
            <NewsCard article={article} i={i} />
          </Grid>
        ))}
      </Grid>
    </Grow>
  );
};

export default NewsCards;
