import { useState } from 'react';

interface AvatarControlsProps {
  onExpressionChange: (expression: string) => void;
  onActionTrigger: (action: string) => void;
}

export default function AvatarControls({ 
  onExpressionChange, 
  onActionTrigger 
}: AvatarControlsProps) {
  const [activeExpression, setActiveExpression] = useState('neutral');
  
  const expressions = [
    { id: 'neutral', label: 'Neutral' },
    { id: 'happy', label: 'Happy' },
    { id: 'sad', label: 'Sad' },
    { id: 'surprised', label: 'Surprised' },
    { id: 'angry', label: 'Angry' }
  ];
  
  const actions = [
    { id: 'wave', label: 'Wave' },
    { id: 'nod', label: 'Nod' },
    { id: 'shake', label: 'Shake Head' },
    { id: 'dance', label: 'Dance' }
  ];
  
  const handleExpressionChange = (expression: string) => {
    setActiveExpression(expression);
    onExpressionChange(expression);
  };
  
  return (
    <div className="avatar-controls mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Expressions</h3>
        <div className="flex flex-wrap gap-2">
          {expressions.map((expression) => (
            <button
              key={expression.id}
              className={`px-3 py-1 rounded-full text-sm ${
                activeExpression === expression.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => handleExpressionChange(expression.id)}
            >
              {expression.label}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Actions</h3>
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <button
              key={action.id}
              className="px-3 py-1 rounded-full text-sm bg-purple-500 hover:bg-purple-600 text-white"
              onClick={() => onActionTrigger(action.id)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
