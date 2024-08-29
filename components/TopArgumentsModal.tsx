import React from "react";

interface TopArgumentsModalProps {
  forArguments: Array<{ text: string; importance: number }>;
  againstArguments: Array<{ text: string; importance: number }>;
  onClose: () => void;
}

const TopArgumentsModal: React.FC<TopArgumentsModalProps> = ({
  forArguments,
  againstArguments,
  onClose,
}) => {
  const getTopArguments = (
    args: Array<{ text: string; importance: number }>
  ) => {
    return args.sort((a, b) => b.importance - a.importance).slice(0, 5);
  };

  const topForArguments = getTopArguments(forArguments);
  const topAgainstArguments = getTopArguments(againstArguments);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Top Arguments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Arguments For</h3>
            <ul>
              {topForArguments.map((arg, index) => (
                <li key={index} className="mb-2">
                  <span className="font-medium">{arg.importance}%:</span>{" "}
                  {arg.text}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">ArgumentsAgainst</h3>
            <ul>
              {topAgainstArguments.map((arg, index) => (
                <li key={index} className="mb-2">
                  <span className="font-medium">{arg.importance}%:</span>{" "}
                  {arg.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TopArgumentsModal;
