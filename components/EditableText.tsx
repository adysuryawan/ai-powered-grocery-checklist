import React, { useState, useRef, useEffect } from 'react';
import EditIcon from './icons/EditIcon';
import SaveEditIcon from './icons/SaveEditIcon';
import CancelEditIcon from './icons/CancelEditIcon';

interface EditableTextProps {
  initialValue: string;
  onSave: (newValue: string) => void;
  textClassName?: string;
  inputClassName?: string;
}

const EditableText: React.FC<EditableTextProps> = ({ 
    initialValue, 
    onSave, 
    textClassName = '',
    inputClassName = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);
  
  const handleSave = () => {
    if (value.trim() && value.trim() !== initialValue) {
      onSave(value.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2 w-full">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full bg-white border border-emerald-500 rounded-md px-2 py-1 focus:ring-2 focus:ring-emerald-300 outline-none transition ${inputClassName}`}
        />
        <button onClick={handleSave} className="p-1 text-green-600 hover:text-green-800"><SaveEditIcon /></button>
        <button onClick={handleCancel} className="p-1 text-red-600 hover:text-red-800"><CancelEditIcon /></button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 group w-full" onClick={() => setIsEditing(true)}>
      <span className={`flex-grow cursor-pointer ${textClassName}`}>{initialValue}</span>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button className="p-1 text-gray-500 hover:text-gray-800" aria-label={`Edit ${initialValue}`}><EditIcon /></button>
      </div>
    </div>
  );
};

export default EditableText;
