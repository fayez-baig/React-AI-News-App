import React from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@material-ui/core";
import useStyles from "./styles";

const NewsCard = ({
  article: { title, description, publishedAt, source, url, urlToImage },
  i,
}) => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardActionArea href={url} target="_blank">
        <CardMedia
          className={classes.media}
          image={
            urlToImage ||
            `https://static9.depositphotos.com/1011646/1236/i/450/depositphotos_12369509-stock-photo-breaking-news-screen.jpg`
          }
        />
        <div className={classes.details}>
          <Typography variant="body2" color="textSecondary" component="h2">
            {new Date(publishedAt).toDateString()}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="h2">
            {source.name}
          </Typography>
        </div>
        <Typography variant="h5" gutterBottom className={classes.title}>
          {title}
        </Typography>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.cardActions}>
        <Button size="small" color="primary">
          Learn More
        </Button>
        <Typography variant="h5" color="textSecondary">
          {i + 1}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default NewsCard;
