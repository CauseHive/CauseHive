import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Cart actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_AMOUNT: 'UPDATE_AMOUNT',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Initial state
const initialState = {
  items: [],
  totalAmount: 0,
  totalItems: 0
};

// Cart reducer
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existingItemIndex = state.items.findIndex(item => item.causeId === action.payload.causeId);
      
      if (existingItemIndex > -1) {
        // Update existing item amount
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          amount: action.payload.amount
        };
        
        const totalAmount = updatedItems.reduce((sum, item) => sum + item.amount, 0);
        
        return {
          ...state,
          items: updatedItems,
          totalAmount,
          totalItems: updatedItems.length
        };
      } else {
        // Add new item
        const newItems = [...state.items, action.payload];
        const totalAmount = newItems.reduce((sum, item) => sum + item.amount, 0);
        
        return {
          ...state,
          items: newItems,
          totalAmount,
          totalItems: newItems.length
        };
      }
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      const filteredItems = state.items.filter(item => item.causeId !== action.payload.causeId);
      const totalAmount = filteredItems.reduce((sum, item) => sum + item.amount, 0);
      
      return {
        ...state,
        items: filteredItems,
        totalAmount,
        totalItems: filteredItems.length
      };
    }
    
    case CART_ACTIONS.UPDATE_AMOUNT: {
      const updatedItems = state.items.map(item =>
        item.causeId === action.payload.causeId
          ? { ...item, amount: action.payload.amount }
          : item
      );
      const totalAmount = updatedItems.reduce((sum, item) => sum + item.amount, 0);
      
      return {
        ...state,
        items: updatedItems,
        totalAmount,
        totalItems: updatedItems.length
      };
    }
    
    case CART_ACTIONS.CLEAR_CART: {
      return initialState;
    }
    
    case CART_ACTIONS.LOAD_CART: {
      const totalAmount = action.payload.reduce((sum, item) => sum + item.amount, 0);
      return {
        items: action.payload,
        totalAmount,
        totalItems: action.payload.length
      };
    }
    
    default:
      return state;
  }
}

// Create context
const DonationCartContext = createContext();

// Provider component
export function DonationCartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('donationCart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('donationCart', JSON.stringify(state.items));
  }, [state.items]);

  // Action creators
  const addToCart = (cause, amount) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: {
        causeId: cause.id,
        causeName: cause.name || cause.title,
        causeImage: cause.image,
        causeCategory: cause.category,
        amount: parseFloat(amount),
        dateAdded: new Date().toISOString()
      }
    });
  };

  const removeFromCart = (causeId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { causeId }
    });
  };

  const updateAmount = (causeId, amount) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_AMOUNT,
      payload: { causeId, amount: parseFloat(amount) }
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const isInCart = (causeId) => {
    return state.items.some(item => item.causeId === causeId);
  };

  const getItemAmount = (causeId) => {
    const item = state.items.find(item => item.causeId === causeId);
    return item ? item.amount : 0;
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateAmount,
    clearCart,
    isInCart,
    getItemAmount
  };

  return (
    <DonationCartContext.Provider value={value}>
      {children}
    </DonationCartContext.Provider>
  );
}

// Custom hook to use cart context
export function useDonationCart() {
  const context = useContext(DonationCartContext);
  if (!context) {
    throw new Error('useDonationCart must be used within a DonationCartProvider');
  }
  return context;
}

export default DonationCartContext;