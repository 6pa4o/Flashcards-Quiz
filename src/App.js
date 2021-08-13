import React, {useState, useEffect} from 'react';
import FlashcardList from "./FlashcardList";
import "./app.css";

function App() {

  const [flashcards, setFlashcards] = useState(SAMPLE_FLASHCARDS);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('https://opentdb.com/api.php?amount=10');
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        setFlashcards(data.results.map((questionItem, index) => {
          const options = [
            ...questionItem.incorrect_answers.map((opt) => decodeString(opt)),
            decodeString(questionItem.correct_answer)
          ]
          return {
            id: `${index}-${Date.now()}`,
            question: decodeString(questionItem.question),
            answer: questionItem.correct_answer,
            options: options.sort(() => Math.random() - .5),
          }
        }));
      } catch (e) {
        console.log('Something bad happened...', e);
      }

    })();
  }, []);

  function decodeString(str) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = str;
    return textArea.value;
  }

  return (
    <div className={'container'}>
      <FlashcardList flashcards={flashcards}/>
    </div>
  );
}

const SAMPLE_FLASHCARDS = [
  {
    id: 1,
    question: 'What is 2 + 1?',
    answer: '3',
    options: [
      '2',
      '3',
      '4',
      '5'
    ]
  },
  {
    id: 2,
    question: 'Question 2?',
    answer: '4',
    options: [
      '2',
      '3',
      '4',
      '5'
    ]
  },
  {
    id: 3,
    question: 'Question 3?',
    answer: '5',
    options: [
      '2',
      '3',
      '4',
      '5'
    ]
  }
]

export default App;
