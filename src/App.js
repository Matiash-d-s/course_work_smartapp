import React, { useState } from 'react';
import'./App.css';
export default function App() {
  const answers =[
    {a:"Загреб"},
    {a:"Белград"},
    {a:"Дели"},
    {a:"Анкара"},
    {a:"Хартум"},
    {a:"Богота"},
    {a:"Мадрид"},
    {a:"Аддис-Абеба"},
    {a:"Нуакшот"},
    {a:"Лусака"},
    {a:"Канберра"},
    {a:"Любляна"},
    {a:"Эр-Рияд"},
    {a:"Лиссабон"},
    {a:"Куала-Лумпур"},
    {a:"Бразилиа"},
    {a:"Берлин"},
    {a:"Берн"},
    {a:"Париж"},
    {a:"Вена"}

  ]
	const questions = [
		
      {
  
        question: "Какой из этих городов является столицей Хорватии?",
        choices: [{answerText: "Сплит"},{answerText: "Цетине"},{answerText: "Загреб"}, {answerText:"Риека"},],
      },
      {
    
        question: "Какой из этих городов является столицей Сербии?",
        choices: [{answerText:"Белград"}, {answerText:"Нови-Сад"},{answerText: "Ниш"},{answerText: "Суботица"},]
      },
     {
        question: "Какой из этих городов является столицей Индии?",
        choices: [{answerText:"Ченнаи"}, {answerText:"Мумбаи"}, {answerText:"Дели"}, {answerText:"Варанаси"},],

      },
      {
        question: "Какой из этих городов является столицей Турции?",
        choices: [{answerText:"Стамбул"}, {answerText:"Анкара"}, {answerText:"Измир"}, {answerText:"Бурса"},],
        
      },
      {
        question: "Какой из этих городов является столицей Судана?",
        choices: [{answerText:"Омдурман"}, {answerText:"Хартум"}, {answerText:"Порт-Судан"}, {answerText:"Кассала"},],
       
      },
      {
        question: "Какой из этих городов является столицей Колубии?",
        choices: [{answerText:"Богота"}, {answerText:"Медельин"}, {answerText:"Кали"}, {answerText:"Кито"},],
      },
      {
        question: "Какой из этих городов является столицей Испании?",
        choices: [{answerText:"Барселона"},{answerText: "Валенсия"},{answerText: "Бильбао"}, {answerText:"Мадрид"},],
      },
      {
        question: "Какой из этих городов является столицей Эфиопии?",
        choices: [{answerText:"Аддис-Абеба"},{answerText: "Назрет"}, {answerText:"Гончар"}, {answerText:"Дире-Дава"},],
      },
      {
        question: "Какой из этих городов является столицей Мавритании?",
        choices: [{answerText:"Киффа"}, {answerText:"Нуадибу"}, {answerText:"Нуакшот"}, {answerText:"Бутилимит"},],
      },
      {
        question: "Какой из этих городов является столицей Замбии?",
        choices: [{answerText:"Ндола"}, {answerText:"Лусака"},{answerText: "Монгу"}, {answerText:"Муфулира"},],
      },
      {
        question: "Какой из этих городов является столицей Австралии?",
        choices: [{answerText:"Канберра"},{answerText: "Сидней"}, {answerText:"Перт"}, {answerText:"Мельбурн"}],
      },
      {
        question: "Какой из этих городов является столицей Словении?",
        choices: [{answerText:"Крань"}, {answerText:"Целе"}, {answerText:"Марибор"}, {answerText:"Любляна"}],
      },
      {
        question: "Какой из этих городов является столицей Саудовской Аравии?",
        choices: [{answerText:"Медина"}, {answerText:"Джидда"}, {answerText:"Мекка"}, {answerText:"Эр-Рияд"}],
      },
      {
        question: "Какой из этих городов является столицей Португалии?",
        choices: [{answerText:"Порту"}, {answerText:"Лиссабон"}, {answerText:"Вилла-Нова-ди-Гая"}, {answerText:"Лореш"}],
      },
      {
        question: "Какой из этих городов является столицей Малайзии?",
      choices: [{answerText:"Куала-Лумпур"},{answerText: "Джорджтаун"}, {answerText:"Джохор-Бару"}, {answerText:"Куантан"}],
      },
      {
        question: "Какой из этих городов является столицей Бразилии?",
        choices: [{answerText:"Рио-де-Жанейро"}, {answerText:"Сан-Пауло"},{answerText: "Бразилиа"},{answerText: "Манаус"}],
      },
      {
        question: "Какой из этих городов является столицей Германии?",
        choices: [{answerText:"Берлин"},{answerText: "Мюнхен"}, {answerText:"Кёльн"}, {answerText:"Майнц"}],
      },
      {
        question: "Какой из этих городов является столицей Швейцарии?",
        choices: [{answerText:"Лозанна"}, {answerText:"Цюрих"},{answerText: "Берн"}, {answerText:"Базель"}],
      },
      {
        question: "Какой из этих городов является столицей Франции?",
        choices: [{answerText:"Париж"},{answerText: "Лион"},{answerText: "Марсель"},{answerText: "Ницца"}],
      },
      {
      question: "Какой из этих городов является столицей Австрии?",
        choices: [{answerText:"Линц"},{answerText: "Грац"},{answerText: "Инсбрук"},{answerText: "Вена"}],
     },
	];

	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [showScore, setShowScore] = useState(false);
	const [score, setScore] = useState(0);
function restart(){
  setScore(0);
  setCurrentQuestion(0);
  setShowScore(false);
}
function handleAnswerOptionClick  (answerText) {
    console.log(answerText)
    console.log(answers[currentQuestion].a)
		if (answerText=== answers[currentQuestion].a) {
			setScore(score + 1);
		}

		const nextQuestion = currentQuestion + 1;
		if (nextQuestion < questions.length) {
			setCurrentQuestion(nextQuestion);
		} else {
			setShowScore(true);
		}
	};
	return (
		<div className='app'>
			{showScore ? (
				<div className='score-section'>
			 Правильно {score} из {questions.length} 
        <button onClick={restart}>Попробовать снова!</button>
				</div>
			) : (
				<>
					<div className='question-section'>
						<div className='question-count'>
							<span>Вопрос {currentQuestion + 1}</span>/{questions.length}
						</div>
						<div className='question-text'>{questions[currentQuestion].question}</div>
					</div>
					<div className='ANS-section'>
            {questions[currentQuestion].question.a}
						{questions[currentQuestion].choices.map((choices) => (
							<button onClick={() => handleAnswerOptionClick(choices.answerText)}>{choices.answerText}</button>
						))}
					</div>
				</>
			)}
		</div>
	);
}