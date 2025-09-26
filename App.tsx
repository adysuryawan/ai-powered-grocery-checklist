import React, { useState, useEffect } from 'react';
import type { GroceryCategory, SavedListData } from './types';
import { generateGroceryList } from './services/geminiService';
import Header from './components/Header';
import Loader from './components/Loader';
import ErrorDisplay from './components/ErrorDisplay';
import SparklesIcon from './components/icons/SparklesIcon';
import LoadIcon from './components/icons/LoadIcon';
import GroceryListDisplay from './components/GroceryListDisplay';

const STORAGE_KEY = 'intelligentGroceryList';

const App: React.FC = () => {
  const exampleText = `Next week's meals:\n- Monday: Spaghetti bolognese with garlic bread and a side salad.\n- Tuesday: Tacos with ground beef, lettuce, tomato, cheese, and salsa.\n- Wednesday: Chicken stir-fry with bell peppers, broccoli, and rice.\nAlso need to pick up some milk, eggs, coffee, and paper towels.`;

  const [userInput, setUserInput] = useState<string>(exampleText);
  const [groceryList, setGroceryList] = useState<GroceryCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedListExists, setSavedListExists] = useState<boolean>(false);

  useEffect(() => {
    // Check for a saved list on initial component mount
    if (localStorage.getItem(STORAGE_KEY)) {
      setSavedListExists(true);
    }
  }, []);

  const handleGenerate = async () => {
    if (!userInput.trim()) {
      setError("Please enter some text to generate a list.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGroceryList([]);

    try {
      const list = await generateGroceryList(userInput);
      setGroceryList(list);
    } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError("An unexpected error occurred.");
        }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveList = () => {
    if (groceryList.length === 0) return;
    const dataToSave: SavedListData = {
      list: groceryList,
      userInput: userInput,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    setSavedListExists(true);
    // You could add a small toast/notification here for user feedback
  };
  
  const handleLoadList = () => {
    const savedDataString = localStorage.getItem(STORAGE_KEY);
    if (savedDataString) {
      try {
        const savedData: SavedListData = JSON.parse(savedDataString);
        setGroceryList(savedData.list);
        setUserInput(savedData.userInput);
        setError(null);
      } catch (e) {
        setError("Could not load the saved list. It might be corrupted.");
        localStorage.removeItem(STORAGE_KEY);
        setSavedListExists(false);
      }
    }
  };

  const handleClearCurrentList = () => {
    setGroceryList([]);
  };

  const handleClearStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedListExists(false);
    // Optionally clear the currently displayed list
    setGroceryList([]); 
    setUserInput(exampleText);
  };

  const handleUpdateCategory = (oldCategory: string, newCategory: string) => {
    setGroceryList(prevList =>
      prevList.map(cat =>
        cat.category === oldCategory ? { ...cat, category: newCategory } : cat
      )
    );
  };

  const handleUpdateItem = (categoryName: string, itemIndex: number, newItem: string) => {
    setGroceryList(prevList =>
      prevList.map(cat => {
        if (cat.category === categoryName) {
          const newItems = [...cat.items];
          newItems[itemIndex] = newItem;
          return { ...cat, items: newItems };
        }
        return cat;
      })
    );
  };
  
  const handleDeleteItem = (categoryName: string, itemIndex: number) => {
    setGroceryList(prevList =>
      prevList.map(cat => {
        if (cat.category === categoryName) {
          const newItems = cat.items.filter((_, index) => index !== itemIndex);
          return { ...cat, items: newItems };
        }
        return cat;
      }).filter(cat => cat.items.length > 0) // Also remove category if it becomes empty
    );
  };


  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Meal Plan & Notes</h2>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="e.g., Monday: spaghetti, Tuesday: tacos..."
            className="w-full h-48 p-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 text-base"
            disabled={isLoading}
          />
          <div className="mt-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
             <div className="flex-shrink-0">
               {savedListExists && !isLoading && (
                 <button 
                    onClick={handleLoadList}
                    className="flex items-center justify-center text-sm bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-200"
                 >
                    <LoadIcon />
                    Load Last List
                 </button>
               )}
             </div>
            <div className="flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="flex items-center justify-center bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-md disabled:transform-none"
              >
                <SparklesIcon />
                {isLoading ? 'Generating...' : 'Generate Checklist'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {!isLoading && !error && (
              <GroceryListDisplay 
                list={groceryList} 
                onSave={handleSaveList}
                onClear={handleClearStorage}
                onClearCurrent={handleClearCurrentList}
                savedListExists={savedListExists}
                onUpdateCategory={handleUpdateCategory}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
              />
            )}
        </div>
      </main>
    </div>
  );
};

export default App;