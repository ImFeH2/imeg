import React, {useEffect, useRef, useState} from 'react';
import {Element, PageSettings} from '../types';
import {ElementRenderer} from './ElementRenderer';

interface CanvasProps {
    elements: Element[];
    pageSettings: PageSettings;
    selectedElement: Element | null;
    onElementSelect: (element: Element | null) => void;
    onElementUpdate: (element: Element) => void;
    onElementDelete: (id: number) => void;
}

const Canvas = ({
                    elements,
                    pageSettings,
                    selectedElement,
                    onElementSelect,
                    onElementUpdate,
                    onElementDelete
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

    // Handle canvas wheel (zoom) events
    const handleWheel = (e: React.WheelEvent) => {
        if (isMouseOverElement) return;
        if (e.ctrlKey || e.metaKey) {
            // Keep existing zoom behavior for Ctrl/Cmd + scroll
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
            // Direct zoom for normal scroll
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

    // Handle canvas click (deselect)
    const handleCanvasClick = (e: React.MouseEvent) => {
        if (e.target === containerRef.current || e.target === canvasRef.current) {
            onElementSelect(null);
            setIsMouseOverElement(false);
        }
    };

    // Handle canvas drag
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

        onElementUpdate({
            ...element,
            properties: {
                ...element.properties,
                x: element.properties.x + scaled.x,
                y: element.properties.y + scaled.y
            }
        });
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

        const newProperties = {...element.properties};

        switch (corner) {
            case 'top-left':
                newProperties.width = Math.max(50, element.properties.width - scaled.x);
                newProperties.height = Math.max(50, element.properties.height - scaled.y);
                newProperties.x = element.properties.x + (element.properties.width - newProperties.width);
                newProperties.y = element.properties.y + (element.properties.height - newProperties.height);
                break;

            case 'top-right':
                newProperties.width = Math.max(50, element.properties.width + scaled.x);
                newProperties.height = Math.max(50, element.properties.height - scaled.y);
                newProperties.y = element.properties.y + (element.properties.height - newProperties.height);
                break;

            case 'bottom-left':
                newProperties.width = Math.max(50, element.properties.width - scaled.x);
                newProperties.height = Math.max(50, element.properties.height + scaled.y);
                newProperties.x = element.properties.x + (element.properties.width - newProperties.width);
                break;

            case 'bottom-right':
                newProperties.width = Math.max(50, element.properties.width + scaled.x);
                newProperties.height = Math.max(50, element.properties.height + scaled.y);
                break;
        }

        onElementUpdate({
            ...element,
            properties: newProperties
        });
    };

    const getCanvasStyle = () => ({
        position: 'absolute' as const,
        backgroundColor: pageSettings.bgColor,
        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        transformOrigin: '0 0',
        transition: isDragging ? 'none' : 'transform 0.1s ease',
        width: pageSettings.responsive ? '1200px' : `${pageSettings.width}px`,
        height: pageSettings.responsive ? '800px' : `${pageSettings.height}px`,
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
    });

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
                style={getCanvasStyle()}
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
