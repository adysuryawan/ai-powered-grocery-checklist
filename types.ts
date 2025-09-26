export interface GroceryCategory {
  category: string;
  items: string[];
}

export interface SavedListData {
  list: GroceryCategory[];
  userInput: string;
}
