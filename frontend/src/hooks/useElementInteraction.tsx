import {useState} from 'react';
import {Element, Position, ResizingState, Size} from '../types';

export function useElementInteraction(
    elements: Element[],
    setElements: (elements: Element[]) => void,
    addToHistory: (elements: Element[]) => void
) {
    const [resizing, setResizing] = useState<ResizingState | null>(null);
    const [initialSize, setInitialSize] = useState<Size | null>(null);
    const [initialPosition, setInitialPosition] = useState<Position | null>(null);

    const handleMouseDown = (e: React.MouseEvent, elementId: number, corner: string) => {
        const element = elements.find(el => el.id === elementId);
        if (!element) return;

        setResizing({
            elementId,
            corner,
            startX: e.clientX,
            startY: e.clientY
        });
        setInitialSize({...element.size});
        setInitialPosition({...element.position});

        const handleMouseMove = (e: MouseEvent) => {
            if (!resizing || !initialSize || !initialPosition) return;

            const deltaX = e.clientX - resizing.startX;
            const deltaY = e.clientY - resizing.startY;

            const newElements = elements.map(el => {
                if (el.id === elementId) {
                    const newSize = {...initialSize};
                    const newPosition = {...initialPosition};

                    if (corner.includes('right')) {
                        newSize.width = Math.max(50, initialSize.width + deltaX);
                    }
                    if (corner.includes('bottom')) {
                        newSize.height = Math.max(50, initialSize.height + deltaY);
                    }
                    if (corner.includes('left')) {
                        const newWidth = Math.max(50, initialSize.width - deltaX);
                        newPosition.x = initialPosition.x + (initialSize.width - newWidth);
                        newSize.width = newWidth;
                    }
                    if (corner.includes('top')) {
                        const newHeight = Math.max(50, initialSize.height - deltaY);
                        newPosition.y = initialPosition.y + (initialSize.height - newHeight);
                        newSize.height = newHeight;
                    }

                    return {
                        ...el,
                        size: newSize,
                        position: newPosition
                    };
                }
                return el;
            });

            setElements(newElements);
        };

        const handleMouseUp = () => {
            if (resizing) {
                addToHistory(elements);
                setResizing(null);
                setInitialSize(null);
                setInitialPosition(null);
            }

            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleDragStart = (e: React.MouseEvent, elementId: number) => {
        const element = elements.find(el => el.id === elementId);
        if (!element) return;

        const startX = e.clientX - element.position.x;
        const startY = e.clientY - element.position.y;

        const handleDragMove = (e: MouseEvent) => {
            const newElements = elements.map(el => {
                if (el.id === elementId) {
                    return {
                        ...el,
                        position: {
                            x: e.clientX - startX,
                            y: e.clientY - startY
                        }
                    };
                }
                return el;
            });
            setElements(newElements);
        };

        const handleDragEnd = (e: MouseEvent) => {
            const finalElements = elements.map(el => {
                if (el.id === elementId) {
                    return {
                        ...el,
                        position: {
                            x: e.clientX - startX,
                            y: e.clientY - startY
                        }
                    };
                }
                return el;
            });

            setElements(finalElements);
            addToHistory(finalElements);
            document.removeEventListener('mousemove', handleDragMove);
            document.removeEventListener('mouseup', handleDragEnd);
        };

        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
    };

    return {
        handleMouseDown,
        handleDragStart
    };
}
