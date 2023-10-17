import { cacheDom }  from '../utils/QuerySelectors.js';

const dom = {};
const qs = {
  questionOneSelect: 'data-quiz-question-one',
  questionTwoSelect: 'data-quiz-question-two',
  questionThreeSelect: 'data-quiz-question-three',
  questionTwoWrap: 'data-question-two-contain',
  questionThreeWrap: 'data-question-three-contain'
};

export const setupQuizSection = () => {
  cacheDom(dom, qs);

  console.log(window.quizAnswers)
};