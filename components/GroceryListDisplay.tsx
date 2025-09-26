import React from 'react';
import type { GroceryCategory } from '../types';
import ChecklistItem from './ChecklistItem';
import SaveIcon from './icons/SaveIcon';
import TrashIcon from './icons/TrashIcon';
import CloseIcon from './icons/CloseIcon';
import EditableText from './EditableText';

interface GroceryListDisplayProps {
  list: GroceryCategory[];
  onSave: () => void;
  onClear: () => void;
  onClearCurrent: () => void;
  savedListExists: boolean;
  onUpdateCategory: (oldCategory: string, newCategory: string) => void;
  onUpdateItem: (categoryName: string, itemIndex: number, newItem: string) => void;
  onDeleteItem: (categoryName: string, itemIndex: number) => void;
}

const GroceryListDisplay: React.FC<GroceryListDisplayProps> = ({ 
  list, 
  onSave, 
  onClear, 
  onClearCurrent, 
  savedListExists,
  onUpdateCategory,
  onUpdateItem,
  onDeleteItem
}) => {
  if (list.length === 0) {
    return (
        <div className="text-center py-10 px-4 bg-white rounded-xl shadow-lg border border-gray-200">
            <img src="https://storage.googleapis.com/maker-suite-images/sprites/2d_perspective_grocery_bag_on_white_background_d06f6547.png" alt="Empty grocery basket" className="mx-auto h-40 w-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-700">Your checklist is ready to be created</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">Enter your meal plan or shopping notes in the box above and click "Generate Checklist" to get started!</p>
        </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-3 border-b-2 border-gray-100 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
                Your Generated Checklist
            </h2>
            <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                    onClick={onSave}
                    className="flex items-center text-sm bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                    <SaveIcon />
                    Save List
                </button>
                 <button
                    onClick={onClearCurrent}
                    className="flex items-center text-sm bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-200"
                >
                   <CloseIcon />
                    Clear
                </button>
                {savedListExists && (
                    <button
                        onClick={onClear}
                        className="flex items-center text-sm bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                    >
                       <TrashIcon />
                        Clear Saved
                    </button>
                )}
            </div>
        </div>
        <div className="space-y-6">
          {list.map((category) => (
            <div key={category.category}>
              <div className="pb-3 mb-2">
                <EditableText
                    initialValue={category.category}
                    onSave={(newValue) => onUpdateCategory(category.category, newValue)}
                    textClassName="text-xl font-bold text-emerald-700 capitalize"
                    inputClassName="text-xl font-bold"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1">
                {category.items.map((item, index) => (
                  <ChecklistItem 
                    key={`${item}-${index}`} 
                    item={item} 
                    onUpdate={(newItem) => onUpdateItem(category.category, index, newItem)}
                    onDelete={() => onDeleteItem(category.category, index)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

export default GroceryListDisplay;