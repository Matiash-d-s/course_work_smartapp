'use strict';

const {DialogManger} = require("dialute");
const express = require("express");
const chalk = require("chalk");
const fs = require("fs");

const rawData = fs.readFileSync("flags.json")
const flags = JSON.parse(rawData);

function choice(choices, drop = false) {
  const index = Math.floor(Math.random() * choices.length);
  let chosen = choices[index];
  if (drop) {
    choices.splice(index, 1);
  }
  return chosen;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


function* script(r) {
  console.log(r.userId)
  let unusedFlags = [...flags];
  let rsp = r.buildRsp();
  let state = {
    'score': 0,
    'country': '',
    'variants': []
  }

  function updateState() {
    let country = choice(unusedFlags, true);
    let variants = [
      {...choice(unusedFlags), used: false},
      {...choice(unusedFlags), used: false},
      {...choice(unusedFlags), used: false},
      {...country, used: false}
    ]
    shuffle(variants);
    state['country'] = country;
    state['variants'] = variants;
    rsp.data = state;
  }

  function useButton(country) {
    for (const [i, v] of state.variants.entries()) {
      if (country.toLowerCase() === v.name.toLowerCase()) {
        state.variants[i].used = true;
      }
    }
  }

  function afterCorrect() {
    updateState();
    state.score++;
    rsp.msg = choice(['Правильно!', 'Здорово!', 'Потрясающе!', 'Угадали!', 'Браво!', 'Вы молодец!']);
    rsp.msgJ = choice(['Правильно!', 'Здорово!', 'Потрясающе!', 'Верно!', 'Браво!', 'Молодец!']);
  }

  function afterWrong() {
    if (r.type === 'SERVER_ACTION') {
      useButton(r.act.data);
    } else {
      useButton(r.msg);
    }
    rsp.msg = choice(['Не угадали!', 'Неверно!', 'Неправильно!']);
    rsp.msgJ = choice(['Не угадал!', 'Неверно!', 'Неправильно!']);
    console.log(state)
    // rsp.data = state;
  }

  updateState();
  rsp.msg = 'Добро пожаловать в игру Угадай флаг. Вам будут показаны флаги различных стран. ' +
    'Вы должны угадать, к каким странам они относятся. Если возникнут вопросы, скажите Помощь. ' +
    'Вопросы можно пропускать, сказав Дальше. А вот и первый флаг';
  rsp.msgJ = 'Привет! Ты в игре Угадай флаг. Тебе будут показаны флаги различных стран. ' +
    'Ты должен угадать, к каким странам они относятся. Если возникнут вопросы, скажи Помощь. ' +
    'Вопросы можно пропускать, сказав Дальше. А вот и первый флаг.';
  yield rsp;

  while (unusedFlags.length > 2) {

    if (r.type === 'SERVER_ACTION') {
      if (r.act.action_id === 'click') {
        if (r.act.data === state.country.name) {
          afterCorrect();
        } else {
          afterWrong();
        }
      }
      yield rsp;
      continue;
    }

    if (r.msg.toLowerCase() === state.country.name.toLowerCase()) {
      afterCorrect();

    } else if (r.nlu.lemmaIntersection(['выход', 'выйти', 'выйди'])) {
      rsp.msg = 'Всего вам доброго!'
      rsp.msgJ = 'Еще увидимся. Пока!'
      rsp.end = true;
      rsp.data = {'type': 'close_app'}

    } else if (r.nlu.lemmaIntersection(['помощь', 'помочь'])) {
      rsp.msg = 'Это игра Угадай флаг. Вам нужно угадать как можно больше флагов стран. ' +
        'За каждый отгаданный флаг вы получайте очки, которые характеризуют ваши познания. ' +
        'Вы можете пропустить вопрос, сказав Дальше.'
      rsp.msgJ = 'Это игра Угадай флаг. Тебе нужно угадать как можно больше флагов стран. ' +
        'За каждый отгаданный флаг ты получишь очки, которые характеризуют твои познания. ' +
        'Ты можешь пропустить вопрос, сказав Дальше.'

    } else if (r.nlu.lemmaIntersection(['дальше', 'следующий', 'другой'])) {
      rsp.msg = 'Обновляю'
      updateState();

    } else {
      afterWrong();
    }
    yield rsp;
  }
  rsp.msg = 'Поздравляю! Вы знаете все флаги мира!'
  rsp.msgJ = 'Поздравляю! Ты знаешь все флаги мира!'
  rsp.data = {'type': 'close_app'}
  rsp.end = true;
  yield rsp;
}


const dm = new DialogManger(script);
const app = express();
const port = 8000;


app.use((req, res, next) => {
  console.info(`${chalk.cyanBright(new Date().toUTCString())} - ${chalk.green(req.method)}:`, chalk.cyan(req.path));
  next();
});
app.use(express.json());
app.use(express.static('public'))

app.post('/app-connector/', (request, response) => {
  console.log(dm.sessions);
  const body = dm.process(request.body);
  response.send(body);
});

// app.post('/log', (request, response) => {
//   console.log(request.body);
//   response.send('ok')
// })

app.listen(port, () => console.log(chalk.blue(`Start server on http://localhost:${port}/`)));
