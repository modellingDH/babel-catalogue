/**
 * Context Provider for Book Store
 * Should be wrapped around the Book component to provide isolated state
 */
import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { createBookStore, BookStore } from '../../stores/bookStore';
import { BookConfig } from '../../types/book';

// Create Context
const BookContext = createContext<BookStore | null>(null);

interface BookProviderProps extends Partial<BookConfig> {
    children: React.ReactNode;
}

/**
 * Provider component that initializes a new store instance
 */
export function BookProvider({ children, ...props }: BookProviderProps) {
    const storeRef = useRef<BookStore>();

    // Initialize store once
    if (!storeRef.current) {
        storeRef.current = createBookStore(props);
    }

    return (
        <BookContext.Provider value={storeRef.current}>
            {children}
        </BookContext.Provider>
    );
}

/**
 * Hook to consume the book store from context
 * Throws error if used outside of provider
 */
export function useBookStore<T>(selector: (state: any) => T): T {
    const store = useContext(BookContext);

    if (!store) {
        throw new Error('useBookStore must be used within a BookProvider');
    }

    return useStore(store, selector);
}

// Re-export specific store actions/selectors hook for convenience if needed
// or users can just use useBookStore(state => state.something)
