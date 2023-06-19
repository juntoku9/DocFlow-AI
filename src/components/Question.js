import React, { useState } from 'react';
import { Radio, Button, Text, Card } from '@geist-ui/react';

function Question({ index, question, choices, answer, explanation }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleChange = (option) => {
    setSelectedAnswer(option);
  };

  const handleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div className="question" style={{ marginTop: '1.5rem' }}>
      <Text h3>
        {index + 1}. {question}
      </Text>
      <Radio.Group
        value={selectedAnswer}
        onChange={(value) => handleChange(parseInt(value))}
      >
        {choices.map((choice, idx) => (
          <Radio key={idx} value={idx}>
            {` ${idx + 1}. ${choice}`}
          </Radio>
        ))}
      </Radio.Group>
      <Button onClick={handleShowAnswer} style={{ marginTop: '1rem' }}>
        Show Answer
      </Button>
      {showAnswer && (
        <Card shadow style={{ marginTop: '1rem', backgroundColor: '#e0e0e0' }}>
          <Text>
            Correct Answer: {answer + 1}. {choices[answer]}
          </Text>
          <Text>Explanation: {explanation}</Text>
        </Card>
      )}
    </div>
  );
}

export default Question;
