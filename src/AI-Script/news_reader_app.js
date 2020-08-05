// Use this sample to create your own voice commands
intent("hello world", (p) => {
  p.play("(hello|hi there)");
});

intent(
  "What can I do?",
  "What does this app do?",
  reply(
    "This is a news app it can find the latest news for you based on different categories and sources, you can also ask me the current date , and you can do simple math operations here Just ask me any mathematical calculation, and I will try to answer it"
  )
);

//to run in react
// intent('command', p=>{
//     p.play({command: 'testCommand'})
// })

//News by Source
const API_KEY = "b26d123d2db14cdea91b6726f9eb55cc";
let savedArticles;

intent("Give me the news from $(source* (.*))", (p) => {
  let NEWS_API_URL = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}`;

  if (p.source.value) {
    NEWS_API_URL = `${NEWS_API_URL}&sources=${p.source.value
      .toLowerCase()
      .split(" ")
      .join("-")}`;
  }

  api.request(NEWS_API_URL, (error, response, body) => {
    const { articles } = JSON.parse(body);

    if (!articles.length) {
      p.play(
        "Sorry please try searching for something from a different source"
      );
      return;
    }
    savedArticles = articles;

    p.play({ command: "newHeadlines", articles });
    p.play(`Here are the (latest|recent) headlines from ${p.source.value}`);
  });
});

//News by Term
intent("what's $(term* (.*))", (p) => {
  let NEWS_API_URL = `https://newsapi.org/v2/everything?apiKey=${API_KEY}`;

  if (p.term.value) {
    NEWS_API_URL = `${NEWS_API_URL}&q=${p.term.value}`;
  }

  api.request(NEWS_API_URL, (error, response, body) => {
    const { articles } = JSON.parse(body);

    if (!articles.length) {
      p.play("Sorry please try searching for something else");
      return;
    }
    savedArticles = articles;

    p.play({ command: "newHeadlines", articles });
    p.play(`Here are the (latest|recent) articles on ${p.term.value}`);
  });
});

// News by Categories
const CATEGORIES = [
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology",
];
const CATEGORIES_INTENT = `${CATEGORIES.map(
  (category) => `${category}~${category}`
).join("|")}|`;

intent(
  `(show|what is|tell me|what's|what are|what're|read) (the|) (recent|latest|) $(N news|headlines) (in|about|on|) $(C~ ${CATEGORIES_INTENT})`,
  `(read|show|get|bring me|give me) (the|) (recent|latest) $(C~ ${CATEGORIES_INTENT}) $(N news|headlines)`,
  (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}&country=in`;

    if (p.C.value) {
      NEWS_API_URL = `${NEWS_API_URL}&category=${p.C.value}`;
    }

    api.request(NEWS_API_URL, (error, response, body) => {
      const { articles } = JSON.parse(body);

      if (!articles.length) {
        p.play("Sorry, please try searching for a different category.");
        return;
      }

      savedArticles = articles;

      p.play({ command: "newHeadlines", articles });

      if (p.C.value) {
        p.play(`Here are the (latest|recent) articles on ${p.C.value}.`);
      } else {
        p.play(`Here are the (latest|recent) news`);
      }

      p.play("Would you like me to read the headlines?");
      p.then(confirmation);
    });
  }
);

const confirmation = context(() => {
  intent("yes (please|) (read |)", async (p) => {
    for (let i = 0; i < savedArticles.length; i++) {
      p.play({ command: "highlight", article: savedArticles[i] });
      p.play(`${savedArticles[i].title}`);
    }
  });

  intent("no", (p) => {
    p.play("Sure, sounds good to me.");
  });
});

intent("open (the|) (article|) (number|) $(number* (.*))", (p) => {
  if (p.number.value) {
    p.play({
      command: "open",
      number: p.number.value,
      articles: savedArticles,
    });
  }
});

intent("(go|) back", (p) => {
  p.play("Sure, going back");
  p.play({ command: "newHeadlines", articles: [] });
});

//Calculator
// {Name: Calculator}
// {Description: Provides responses for basic math queries.}

title("Calculator");

function plus(v1, v2) {
  return v1 + v2;
}

function minus(v1, v2) {
  return v1 - v2;
}

function mult(v1, v2) {
  return v1 * v2;
}

function divide(v1, v2) {
  if (v2 === 0) {
    return "infinity";
  }
  return v1 / v2;
}

function squareRoot(v1) {
  if (v1 < 0) {
    return "you can't take a square root of a negative number";
  }
  return Math.sqrt(v1);
}

function cubicRoot(v1) {
  if (v1 < 0) {
    return "you can't take a cubic root of a negative number";
  }
  return Math.cbrt(v1);
}

function roundToLimit(num) {
  if (Math.abs(num) >= 1e19 || !num.toString().includes("e")) {
    return num;
  }
  const digitsCount = 15 - numDigits(num);
  return +(Math.round(num + "e+" + digitsCount) + "e-" + digitsCount);
}

function numDigits(x) {
  return Math.max(Math.floor(Math.log10(Math.abs(x))), 0) + 1;
}

function power(x, n) {
  return Math.pow(x, n);
}

function cube(x) {
  return power(x, 3);
}

function square(x) {
  return power(x, 2);
}

const operatorMap = {
  plus: plus,
  add: plus,
  "+": plus,
  minus: minus,
  subtract: minus,
  "take away": minus,
  "-": minus,
  times: mult,
  multiply: mult,
  "*": mult,
  cubed: cube,
  squared: square,
  "to the power": power,
  power: power,
  divide: divide,
  divided: divide,
  over: divide,
  "/": divide,
  "cubic root": cubicRoot,
  "square root": squareRoot,
  root: squareRoot,
};

onCreateContext((p) => {
  p.state.result = 0;
});

intent(
  "(what is|how much is|calculate|compute|) $(NUMBER) $(OPERATOR *|+|-|/|plus|minus|over|divided|divide|times|to the power) (of|) $(NUMBER)",
  "(what is|how much is|calculate|compute|) $(OPERATOR multiply|divide) $(NUMBER) (by|on|) $(NUMBER)",
  "(what is|how much is|calculate|compute|) $(OPERATOR cubic root|square root|root) of $(NUMBER)",
  "(what is|how much is|calculate|compute|) $(NUMBER) $(OPERATOR cubed|squared)",
  "(what is|how much is|calculate|compute|) $(NUMBER) to the $(ORDINAL) $(OPERATOR power)",
  (p) => {
    const operator = operatorMap[p.OPERATOR.value];

    if (!operator) {
      p.play(`(Sorry|) I can't do ${p.OPERATOR} (yet|)`);
      return;
    }

    if (!p.NUMBER_.length) {
      p.play("I need at least one argument");
      return;
    }

    if (p.NUMBER_.length === 1) {
      if (p.ORDINAL) {
        p.state.result = operator(p.NUMBER.number, p.ORDINAL.number);
        p.state.result = roundToLimit(p.state.result);
        p.play(
          `${p.NUMBER.number} to the ${p.ORDINAL.number} power (is|equals to) ${p.state.result}`,
          `(it's|) ${p.state.result}`
        );
      } else {
        if (
          (p.OPERATOR.value === "square root" || p.OPERATOR.value === "root") &&
          p.NUMBER.number < 0
        ) {
          p.play(
            `I can't take a square root of a negative number ${p.NUMBER.number}`
          );
          return;
        }

        if (p.OPERATOR.value === "cubic root" && p.NUMBER.number < 0) {
          p.play(
            `I can't take a cubic root of a negative number ${p.NUMBER.number}`
          );
          return;
        }

        p.state.result = operator(p.NUMBER.number);
        p.state.result = roundToLimit(p.state.result);
        p.play(
          `${p.OPERATOR} (of) ${p.NUMBER_[0]} (is|equals to) ${p.state.result}`,
          `(it's|) ${p.state.result}`
        );
      }
    }

    if (p.NUMBER_.length === 2) {
      if (
        (p.OPERATOR.value === "divide" || p.OPERATOR.value === "/") &&
        p.NUMBER_[1].number === 0
      ) {
        p.play(`I can't divide ${p.NUMBER_[0]} by zero`);
      } else {
        p.state.result = operator(p.NUMBER_[0].number, p.NUMBER_[1].number);
        p.state.result = roundToLimit(p.state.result);
        p.play(
          `${p.NUMBER_[0]} ${p.OPERATOR} ${p.NUMBER_[1]} (is|equals to) ${p.state.result}`,
          `(it's|) ${p.state.result}`
        );
      }
    }
  }
);

follow(
  "$(OPERATOR *|+|-|/|plus|minus|over|divided|divide|times) $(NUMBER)",
  (p) => {
    const operator = operatorMap[p.OPERATOR.value];
    if (!operator) {
      p.play(`(Sorry|) I can't do ${p.OPERATOR} (yet|)`);
      return;
    }
    const prevState = p.state.result;
    p.state.result = roundToLimit(operator(prevState, p.NUMBER.number));
    p.play(
      `${prevState} ${p.OPERATOR} ${p.NUMBER} (is|equals to) ${p.state.result}`,
      `(it's|) ${p.state.result}`
    );
  }
);

//Calendar

// {Name: Calendar}
// {Description: What day is tomorrow}

title("General calendar");

intent(
  "what (date|day) $(V is|was|will be|would be|) $(DATE) $(T next year|last year|)",
  (p) => {
    if (p.T.value === "last year") {
      p.DATE = p.DATE.moment.add(-1, "Y");
    } else if (p.T.value === "next year") {
      p.DATE = p.DATE.moment.add(1, "Y");
    }
    let res = p.DATE.moment.format("dddd, MMMM Do YYYY");
    p.play(`${p.DATE} ${p.V} ` + res);
  }
);

follow("(and|) (what|) (about|) $(DATE)", (p) => {
  let res = p.DATE.moment.format("dddd, MMMM Do YYYY");
  p.play(`${p.DATE} ` + res);
});

intent("(what is|) is (my|) timezone", (p) => {
  p.play("Your current timezone is " + p.timeZone);
});

intent("(what is|) (the|) (current|) time (now|)", (p) => {
  p.play("Now is " + api.moment().tz(p.timeZone).format("h:mmA"));
});

intent("(what is|) (the|) (current|) (day|date) (now|today|)", (p) => {
  p.play("Now is " + api.moment().tz(p.timeZone).format("dddd, MMMM Do YYYY"));
});

intent("(what is|) (the|) (current|) day and time (now|today|)", (p) => {
  p.play("Now is " + api.moment().tz(p.timeZone).format("dddd, h:mmA"));
});

title("Alan calendar");

intent("when (Alan|) Turing was born", (p) => {
  let turingBirthdate = api.moment("19120612", "YYYYMMDD");
  p.play(`Alan Turing was born
    ${turingBirthdate.fromNow()}
    on ${turingBirthdate.format("dddd, MMMM Do YYYY")}`);
});

title("Moon landing calendar");

intent("when was the first (unmanned|) (moon landing|lunar landing)", (p) => {
  let moonLandingDateLuna = api.moment("19590913", "YYYYMMDD");
  p.play(`The first unmanned moon landing was on
    ${moonLandingDateLuna.format("dddd, MMMM Do YYYY")},
    ${moonLandingDateLuna.fromNow()}`);
});

var mannedLanding = (p) => {
  let moonLandingDateApollo = api.moment("19690720", "YYYYMMDD");
  p.play(`The first manned moon landing was on
  ${moonLandingDateApollo.format("dddd, MMMM Do YYYY")},
  ${moonLandingDateApollo.fromNow()}`);
};

follow("and manned", mannedLanding);

intent("when was the first manned (moon landing|lunar landing)", mannedLanding);

// see https://momentjs.com, moment js library is available through api.moment
