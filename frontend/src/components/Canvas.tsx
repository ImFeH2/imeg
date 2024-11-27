import React, {useEffect, useRef, useState} from 'react';
import {ComponentElement, PageSettings} from '../types';
import {ElementRenderer} from './ElementRenderer';

interface CanvasProps {
    elements: ComponentElement[];
    pageSettings: PageSettings;
    selectedElement: ComponentElement | null;
    onElementSelect: (element: ComponentElement | null) => void;
    onElementUpdate: (element: ComponentElement) => void;
    onElementDelete: (id: number) => void;
    onDropComponent: (componentId: string, x: number, y: number) => void;
}

const Canvas = ({
                    elements,
                    pageSettings,
                    selectedElement,
                    onElementSelect,
                    onElementUpdate,
                    onElementDelete,
                    onDropComponent
                }: CanvasProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({x: 0, y: 0});
    const lastPosition = useRef({x: 0, y: 0});
    const [isMouseOverElement, setIsMouseOverElement] = useState(false);

    // Prevent browser zoom when using Ctrl + scroll
    useEffect(() => {
        const preventDefault = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
            }
        };
        document.addEventListener('wheel', preventDefault, {passive: false});
        return () => document.removeEventListener('wheel', preventDefault);
    }, []);

    // Handle element mouse events
    useEffect(() => {
        const handleMouseLeave = () => {
            setIsMouseOverElement(false);
        };

        const elements = document.querySelectorAll('.element-container');
        elements.forEach(element => {
            element.addEventListener('mouseleave', handleMouseLeave);
        });

        return () => {
            elements.forEach(element => {
                element.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, [elements]);

    // Calculate initial scale and position
    useEffect(() => {
        const calculateInitialScale = () => {
            if (!containerRef.current) return;
            const containerWidth = containerRef.current.clientWidth - 64;
            const containerHeight = containerRef.current.clientHeight - 64;
            const pageWidth = pageSettings.responsive ? 1200 : pageSettings.width;
            const pageHeight = pageSettings.responsive ? 800 : pageSettings.height;

            const scaleX = containerWidth / pageWidth;
            const scaleY = containerHeight / pageHeight;
            const newScale = Math.min(scaleX, scaleY, 1);

            setScale(newScale);

            const scaledWidth = pageWidth * newScale;
            const scaledHeight = pageHeight * newScale;
            const x = (containerWidth - scaledWidth) / 2;
            const y = (containerHeight - scaledHeight) / 2;
            setPosition({x, y});
        };

        calculateInitialScale();
        window.addEventListener('resize', calculateInitialScale);
        return () => window.removeEventListener('resize', calculateInitialScale);
    }, [pageSettings]);

    // Helper function to get property value
    const getPropertyValue = (element: ComponentElement, propertyName: string) => {
        const property = element.properties.find(p => p.name === propertyName);
        return property ? property.value : undefined;
    };

    // Helper function to update property value
    const updatePropertyValue = (element: ComponentElement, propertyName: string, value: any) => {
        const newProperties = element.properties.map(p =>
            p.name === propertyName ? {...p, value} : p
        );
        return {...element, properties: newProperties};
    };

    // Handle canvas wheel (zoom) events
    const handleWheel = (e: React.WheelEvent) => {
        if (isMouseOverElement) return;
        if (e.ctrlKey || e.metaKey) {
            const delta = e.deltaY * -0.002;
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;

            const mouseX = e.clientX - rect.left - position.x;
            const mouseY = e.clientY - rect.top - position.y;
            const newScale = Math.min(Math.max(0.1, scale + delta), 2);
            const scaleDiff = newScale - scale;
            const newX = position.x - (mouseX * scaleDiff);
            const newY = position.y - (mouseY * scaleDiff);

            setScale(newScale);
            setPosition({x: newX, y: newY});
        } else {
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            const newScale = Math.min(Math.max(0.1, scale + delta), 2);
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;

            const mouseX = e.clientX - rect.left - position.x;
            const mouseY = e.clientY - rect.top - position.y;
            const scaleDiff = newScale - scale;
            const newX = position.x - (mouseX * scaleDiff);
            const newY = position.y - (mouseY * scaleDiff);

            setScale(newScale);
            setPosition({x: newX, y: newY});
            e.preventDefault();
        }
    };

    // Handle canvas drag
    const handleCanvasClick = (e: React.MouseEvent) => {
        if (e.target === containerRef.current || e.target === canvasRef.current) {
            onElementSelect(null);
            setIsMouseOverElement(false);
        }
    };

    const handleCanvasMouseDown = (e: React.MouseEvent) => {
        if (e.target === containerRef.current || e.target === canvasRef.current) {
            e.preventDefault();
            setIsDragging(true);
            document.body.style.cursor = 'grabbing';
            lastPosition.current = {
                x: e.clientX - position.x,
                y: e.clientY - position.y
            };
        }
    };

    const handleCanvasMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            const newX = e.clientX - lastPosition.current.x;
            const newY = e.clientY - lastPosition.current.y;
            setPosition({x: newX, y: newY});
        }
    };

    const handleCanvasMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
            document.body.style.cursor = 'default';
        }
        setIsMouseOverElement(false);
    };

    // Handle element drag
    const handleElementDrag = (elementId: number, deltaX: number, deltaY: number) => {
        const element = elements.find(el => el.id === elementId);
        if (!element) return;

        const scaled = {
            x: deltaX / scale,
            y: deltaY / scale
        };

        const currentX = getPropertyValue(element, 'x') || 0;
        const currentY = getPropertyValue(element, 'y') || 0;

        const updatedElement = updatePropertyValue(
            updatePropertyValue(element, 'x', currentX + scaled.x),
            'y',
            currentY + scaled.y
        );

        onElementUpdate(updatedElement);
    };

    // Handle element resize
    const handleElementResize = (
        elementId: number,
        corner: string,
        deltaX: number,
        deltaY: number
    ) => {
        const element = elements.find(el => el.id === elementId);
        if (!element) return;

        const scaled = {
            x: deltaX / scale,
            y: deltaY / scale
        };

        const currentX = getPropertyValue(element, 'x') || 0;
        const currentY = getPropertyValue(element, 'y') || 0;
        const currentWidth = getPropertyValue(element, 'width') || 200;
        const currentHeight = getPropertyValue(element, 'height') || 100;

        let updatedElement = element;

        switch (corner) {
            case 'top-left':
                const newWidthTL = Math.max(50, currentWidth - scaled.x);
                const newHeightTL = Math.max(50, currentHeight - scaled.y);
                updatedElement = updatePropertyValue(element, 'width', newWidthTL);
                updatedElement = updatePropertyValue(updatedElement, 'height', newHeightTL);
                updatedElement = updatePropertyValue(updatedElement, 'x', currentX + (currentWidth - newWidthTL));
                updatedElement = updatePropertyValue(updatedElement, 'y', currentY + (currentHeight - newHeightTL));
                break;

            case 'top-right':
                const newWidthTR = Math.max(50, currentWidth + scaled.x);
                const newHeightTR = Math.max(50, currentHeight - scaled.y);
                updatedElement = updatePropertyValue(element, 'width', newWidthTR);
                updatedElement = updatePropertyValue(updatedElement, 'height', newHeightTR);
                updatedElement = updatePropertyValue(updatedElement, 'y', currentY + (currentHeight - newHeightTR));
                break;

            case 'bottom-left':
                const newWidthBL = Math.max(50, currentWidth - scaled.x);
                const newHeightBL = Math.max(50, currentHeight + scaled.y);
                updatedElement = updatePropertyValue(element, 'width', newWidthBL);
                updatedElement = updatePropertyValue(updatedElement, 'height', newHeightBL);
                updatedElement = updatePropertyValue(updatedElement, 'x', currentX + (currentWidth - newWidthBL));
                break;

            case 'bottom-right':
                const newWidthBR = Math.max(50, currentWidth + scaled.x);
                const newHeightBR = Math.max(50, currentHeight + scaled.y);
                updatedElement = updatePropertyValue(element, 'width', newWidthBR);
                updatedElement = updatePropertyValue(updatedElement, 'height', newHeightBR);
                break;
        }

        onElementUpdate(updatedElement);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.target === canvasRef.current) {
            const componentId = e.dataTransfer.getData('componentId');
            if (!componentId) return;

            const canvasRect = canvasRef.current.getBoundingClientRect();
            const x = (e.clientX - canvasRect.left - position.x) / scale;
            const y = (e.clientY - canvasRect.top - position.y) / scale;

            onDropComponent(componentId, x, y);
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden bg-gray-100"
            onWheel={handleWheel}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onClick={handleCanvasClick}
            style={{cursor: isDragging ? 'grabbing' : 'grab'}}
        >
            {/* Zoom indicator */}
            <div className="absolute right-4 bottom-4 bg-white px-2 py-1 rounded shadow text-sm z-10">
                {Math.round(scale * 100)}%
            </div>

            {/* Canvas */}
            <div
                ref={canvasRef}
                className="bg-white rounded-lg"
                style={{
                    position: 'absolute',
                    backgroundColor: pageSettings.bgColor,
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: '0 0',
                    transition: isDragging ? 'none' : 'transform 0.1s ease',
                    width: pageSettings.responsive ? '1200px' : `${pageSettings.width}px`,
                    height: pageSettings.responsive ? '800px' : `${pageSettings.height}px`,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {elements.map(element => (
                    <ElementRenderer
                        key={element.id}
                        element={element}
                        isSelected={selectedElement?.id === element.id}
                        onSelect={() => onElementSelect(element)}
                        onDelete={() => onElementDelete(element.id)}
                        onMouseDown={(e, corner) => {
                            setIsMouseOverElement(true);
                            const startX = e.clientX;
                            const startY = e.clientY;

                            const handleMouseMove = (moveEvent: MouseEvent) => {
                                handleElementResize(
                                    element.id,
                                    corner,
                                    moveEvent.clientX - startX,
                                    moveEvent.clientY - startY
                                );
                            };

                            const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove);
                                document.removeEventListener('mouseup', handleMouseUp);
                            };

                            document.addEventListener('mousemove', handleMouseMove);
                            document.addEventListener('mouseup', handleMouseUp);
                        }}
                        onDragStart={(e) => {
                            setIsMouseOverElement(true);
                            const startX = e.clientX;
                            const startY = e.clientY;

                            const handleMouseMove = (moveEvent: MouseEvent) => {
                                handleElementDrag(
                                    element.id,
                                    moveEvent.clientX - startX,
                                    moveEvent.clientY - startY
                                );
                            };

                            const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove);
                                document.removeEventListener('mouseup', handleMouseUp);
                            };

                            document.addEventListener('mousemove', handleMouseMove);
                            document.addEventListener('mouseup', handleMouseUp);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Canvas;
