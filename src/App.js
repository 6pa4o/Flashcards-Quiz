import React, {useState, useEffect, useRef } from 'react';
import FlashcardList from "./FlashcardList";
import "./app.css";

function App() {

  const [flashcards, setFlashcards] = useState([]);
  const [categories, setCategories] = useState([]);
  const categoryEl = useRef();
  const amountEl = useRef();

  useEffect(() => {
    (
      async () => {
        try {
          const response = await fetch('https://opentdb.com/api_category.php');
          if (!response.ok) {
            throw new Error('Networ problem');
          }
          const data = await response.json();
          setCategories(data.trivia_categories);
        } catch (e) {
          throw new Error();
        }
      })();
  }, []);

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

  function handleSubmit(evt) {
    evt.preventDefault();
    (async () => {
      try {
        const response = await fetch(`
          https://opentdb.com/api.php?amount=${amountEl.current.value}&category=${categoryEl.current.value}
        `);
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
  }

  function decodeString(str) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = str;
    return textArea.value;
  }

  return (
    <>
      <form className="header" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" ref={categoryEl}>
            {
              categories.map(category => {
                return <option value={category.id} key={category.id}>{category.name}</option>
              })
            }
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Number of questions</label>
          <input type="number" id="amount" min="1" step="1" defaultValue={10} ref={amountEl} />
        </div>
        <div className="form-group">
          <button className="btn">Generate</button>
        </div>
      </form>
      <div className={'container'}>
        <FlashcardList flashcards={flashcards}/>
      </div>
    </>
  );
}

export default App;
