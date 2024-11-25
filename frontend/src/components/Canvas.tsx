import React, {useEffect, useRef, useState} from 'react';
import {Element, PageSettings} from '../types';
import {ElementRenderer} from './ElementRenderer';

interface CanvasProps {
    elements: Element[];
    pageSettings: PageSettings;
    selectedElement: Element | null;
    onElementSelect: (element: Element) => void;
    onElementDelete: (id: number) => void;
    onMouseDown: (e: React.MouseEvent, elementId: number, corner: string) => void;
    onDragStart: (e: React.MouseEvent, elementId: number) => void;
}

const Canvas = ({
                    elements,
                    pageSettings,
                    selectedElement,
                    onElementSelect,
                    onElementDelete,
                    onMouseDown,
                    onDragStart
                }: CanvasProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({x: 0, y: 0});
    const lastPosition = useRef({x: 0, y: 0});
    const [isMouseOverElement, setIsMouseOverElement] = useState(false);

    // 禁用浏览器默认缩放
    useEffect(() => {
        const preventDefault = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
            }
        };

        document.addEventListener('wheel', preventDefault, {passive: false});

        return () => {
            document.removeEventListener('wheel', preventDefault);
        };
    }, []);

    // 计算初始缩放比例以适应容器
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

            // 居中画布
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

    // 处理鼠标滚轮缩放
    const handleWheel = (e: React.WheelEvent) => {
        if (isMouseOverElement) return; // 如果鼠标在元素上，不进行缩放

        // 降低缩放速度
        const delta = e.deltaY * -0.002;

        // 获取鼠标相对于画布的位置
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const mouseX = e.clientX - rect.left - position.x;
        const mouseY = e.clientY - rect.top - position.y;

        // 计算新的缩放比例
        const newScale = Math.min(Math.max(0.1, scale + delta), 2);

        // 计算缩放后鼠标位置的偏移，保持鼠标指向的点不变
        const scaleDiff = newScale - scale;
        const newX = position.x - (mouseX * scaleDiff);
        const newY = position.y - (mouseY * scaleDiff);

        setScale(newScale);
        setPosition({x: newX, y: newY});
    };

    // 处理画布拖动开始
    const handleMouseDown = (e: React.MouseEvent) => {
        // 如果点击的是画布而不是元素，开始拖动
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

    // 处理画布拖动
    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            const newX = e.clientX - lastPosition.current.x;
            const newY = e.clientY - lastPosition.current.y;
            setPosition({x: newX, y: newY});
        }
    };

    // 处理画布拖动结束
    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
            document.body.style.cursor = 'default';
        }
    };

    // 监听全局鼠标事件，以防止拖动时鼠标移出画布
    useEffect(() => {
        if (isDragging) {
            const handleGlobalMouseMove = (e: MouseEvent) => {
                const newX = e.clientX - lastPosition.current.x;
                const newY = e.clientY - lastPosition.current.y;
                setPosition({x: newX, y: newY});
            };

            const handleGlobalMouseUp = () => {
                setIsDragging(false);
                document.body.style.cursor = 'default';
            };

            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleGlobalMouseMove);
                document.removeEventListener('mouseup', handleGlobalMouseUp);
            };
        }
    }, [isDragging]);

    const getCanvasStyle = () => {
        const baseStyle: React.CSSProperties = {
            position: 'absolute',
            backgroundColor: pageSettings.bgColor,
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.1s ease',
            width: pageSettings.responsive ? '1200px' : `${pageSettings.width}px`,
            height: pageSettings.responsive ? '800px' : `${pageSettings.height}px`,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        };

        return baseStyle;
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden bg-gray-100"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{cursor: isDragging ? 'grabbing' : 'grab'}}
        >
            <div className="absolute right-4 bottom-4 bg-white px-2 py-1 rounded shadow text-sm">
                {Math.round(scale * 100)}%
            </div>
            <div
                ref={canvasRef}
                className="bg-white rounded-lg"
                style={getCanvasStyle()}
            >
                {elements.map(element => (
                    <ElementRenderer
                        key={element.id}
                        element={{
                            ...element,
                            position: {
                                x: element.position.x,
                                y: element.position.y
                            }
                        }}
                        isSelected={selectedElement?.id === element.id}
                        isPreview={false}
                        onSelect={() => onElementSelect(element)}
                        onDelete={() => onElementDelete(element.id)}
                        onMouseDown={(e, corner) => {
                            setIsMouseOverElement(true);
                            onMouseDown(e, element.id, corner);
                        }}
                        onDragStart={(e) => {
                            setIsMouseOverElement(true);
                            onDragStart(e, element.id);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Canvas;
