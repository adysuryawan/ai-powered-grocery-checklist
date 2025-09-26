import React, { useState } from 'react';
import CheckIcon from './icons/CheckIcon';
import TrashIcon from './icons/TrashIcon';
import EditableText from './EditableText';

interface ChecklistItemProps {
  item: string;
  onUpdate: (newItem: string) => void;
  onDelete: () => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ item, onUpdate, onDelete }) => {
  const [isChecked, setIsChecked] = useState(false);

  const toggleCheck = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="flex items-center justify-between space-x-3 group py-2">
      <div className="flex items-center space-x-3 flex-grow">
        <div
          onClick={toggleCheck}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer ${
            isChecked
              ? 'bg-emerald-500 border-emerald-500'
              : 'bg-white border-gray-300 group-hover:border-emerald-400'
          }`}
        >
          {isChecked && <CheckIcon />}
        </div>
        <EditableText 
            initialValue={item}
            onSave={onUpdate}
            textClassName={`text-gray-700 transition-all duration-200 text-base ${
                isChecked ? 'line-through text-gray-400' : ''
            }`}
        />
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md"
            aria-label={`Delete item ${item}`}
        >
            <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ChecklistItem;