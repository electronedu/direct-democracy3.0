import React from "react";

interface QuestionProps {
  text: string;
}

const Question: React.FC<QuestionProps> = ({ text }) => {
  return (
    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
      {text}
    </h1>
  );
};

export default Question;
