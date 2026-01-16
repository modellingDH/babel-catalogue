import { BookConfig } from '../../types/book';
interface BookProviderProps extends Partial<BookConfig> {
    children: React.ReactNode;
}
/**
 * Provider component that initializes a new store instance
 */
export declare function BookProvider({ children, ...props }: BookProviderProps): import("react/jsx-runtime").JSX.Element;
/**
 * Hook to consume the book store from context
 * Throws error if used outside of provider
 */
export declare function useBookStore<T>(selector: (state: any) => T): T;
export {};
//# sourceMappingURL=BookContext.d.ts.map