import {useState} from 'react';
import {Element} from '../types';

export function useEditorState() {
    const [isPreview, setIsPreview] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [showProperties, setShowProperties] = useState(false);
    const [elements, setElements] = useState<Element[]>([]);
    const [selectedElement, setSelectedElement] = useState<Element | null>(null);
    const [history, setHistory] = useState<Element[][]>([[]]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const addToHistory = (newElements: Element[]) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push([...newElements]);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const resetHistory = (initialElements: Element[]) => {
        setHistory([[...initialElements]]);
        setHistoryIndex(0);
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setElements([...history[historyIndex - 1]]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setElements([...history[historyIndex + 1]]);
        }
    };

    return {
        isPreview,
        setIsPreview,
        showSidebar,
        setShowSidebar,
        showProperties,
        setShowProperties,
        elements,
        setElements,
        selectedElement,
        setSelectedElement,
        history,
        historyIndex,
        addToHistory,
        resetHistory,
        undo,
        redo
    };
}
