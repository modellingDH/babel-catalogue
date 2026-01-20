import { useBookStore } from '../components/Book/BookContext';

/**
 * Hook for controlling the book state from outside components
 * Provides actions to animate book properties (position, rotation, etc.)
 */
export const useBookControls = () => {
    const animateTo = useBookStore(state => state.animateTo);
    const setSpineRotation = useBookStore(state => state.setSpineRotation);
    const setTilt = useBookStore(state => state.setTilt);
    const setLean = useBookStore(state => state.setLean);
    const openBook = useBookStore(state => state.openBook);
    const closeBook = useBookStore(state => state.closeBook);
    const putDownBook = useBookStore(state => state.putDownBook);
    const restoreBook = useBookStore(state => state.restoreBook);

    return {
        /**
         * Animate multiple properties to target values
         * @param targetState Object containing target values (e.g. { spineRotation: Math.PI })
         * @param duration Animation duration in ms (default 1000)
         */
        animateTo,

        // Direct Setters
        setSpineRotation,
        setTilt,
        setLean,

        // Preset Actions
        openBook,
        closeBook,
        putDownBook,
        restoreBook
    };
};
