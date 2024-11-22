import {useCallback} from 'react';
import {Element} from '../types';
import {isEqual} from 'lodash';

export function useElementInteraction(
    elements: Element[],
    setElements: (elements: Element[]) => void,
    addToHistory: (elements: Element[]) => void
) {
    const handleMouseDown = useCallback((e: React.MouseEvent, elementId: number, corner: string) => {
        e.stopPropagation();

        const element = elements.find(el => el.id === elementId);
        if (!element) return;

        const startX = e.clientX;
        const startY = e.clientY;
        const originalElement = {...element};

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            const newElements = elements.map(el => {
                if (el.id === elementId) {
                    let newSize = {...element.size};
                    let newPosition = {...element.position};

                    switch (corner) {
                        case 'top-left':
                            newSize.width = Math.max(50, element.size.width - deltaX);
                            newSize.height = Math.max(50, element.size.height - deltaY);
                            newPosition.x = element.position.x + (element.size.width - newSize.width);
                            newPosition.y = element.position.y + (element.size.height - newSize.height);
                            break;

                        case 'top-right':
                            newSize.width = Math.max(50, element.size.width + deltaX);
                            newSize.height = Math.max(50, element.size.height - deltaY);
                            newPosition.y = element.position.y + (element.size.height - newSize.height);
                            break;

                        case 'bottom-left':
                            newSize.width = Math.max(50, element.size.width - deltaX);
                            newSize.height = Math.max(50, element.size.height + deltaY);
                            newPosition.x = element.position.x + (element.size.width - newSize.width);
                            break;

                        case 'bottom-right':
                            newSize.width = Math.max(50, element.size.width + deltaX);
                            newSize.height = Math.max(50, element.size.height + deltaY);
                            break;
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
            const finalElement = elements.find(el => el.id === elementId);
            if (!isEqual(originalElement.position, finalElement?.position) ||
                !isEqual(originalElement.size, finalElement?.size)) {
                addToHistory(elements);
            }
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [elements, setElements, addToHistory]);

    const handleDragStart = useCallback((e: React.MouseEvent, elementId: number) => {
        const element = elements.find(el => el.id === elementId);
        if (!element) return;

        const startX = e.clientX - element.position.x;
        const startY = e.clientY - element.position.y;
        const originalPosition = {...element.position};

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
            const newPosition = {
                x: e.clientX - startX,
                y: e.clientY - startY
            };

            const finalElements = elements.map(el => {
                if (el.id === elementId) {
                    return {
                        ...el,
                        position: newPosition
                    };
                }
                return el;
            });

            if (!isEqual(originalPosition, newPosition)) {
                setElements(finalElements);
                addToHistory(finalElements);
            }
            document.removeEventListener('mousemove', handleDragMove);
            document.removeEventListener('mouseup', handleDragEnd);
        };

        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
    }, [elements, setElements, addToHistory]);

    return {
        handleMouseDown,
        handleDragStart
    };
}
