import "./multipleChoice.scss";

import React, { useState } from "react";

interface MultipleChoiceProps {
  question: string;
  options: string[];
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  question,
  options,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
    console.log(event.target.name, ": ", event.target.value);
  };

  return (
    <div>
      <h2 className="sidebar-title">{question}</h2>
      <div className={`custom-radio-group ${question}`}>
        {options.map((option) => (
          <label key={option} className="custom-radio">
            <input
              type="radio"
              name={question}
              value={option}
              checked={selectedOption === option}
              onChange={handleOptionChange}
              hidden
            />
            <span
              style={{
                backgroundColor: selectedOption === option ? option : "",
              }}
              className={`custom-radio-indicator ${option.toLowerCase()}`}
            ></span>
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoice;
