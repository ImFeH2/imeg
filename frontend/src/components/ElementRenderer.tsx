import {Trash2} from 'lucide-react';
import {ComponentElement, Content} from '../types';
import React, {useMemo, useState} from 'react';
import {componentsLib, createElement} from "@/constants/components.tsx";

interface ElementRendererProps {
    element: ComponentElement;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onMouseDown: (e: React.MouseEvent, corner: string) => void;
    onDragStart: (e: React.MouseEvent) => void;
    onElementUpdate: (element: ComponentElement) => void;
}

function getPropertyValue(element: ComponentElement, propertyName: string) {
    if (!element?.properties || !Array.isArray(element.properties)) {
        console.warn('Invalid properties structure:', element);
        return undefined;
    }
    const property = element.properties.find(p => p.name === propertyName);
    return property ? property.value : undefined;
}

function ContentRenderer({content, style, onDrop}: {
    content: Content,
    style: React.CSSProperties,
    onDrop?: (componentId: number) => void
}) {
    if (content.type === 'text') {
        return content.content;
    } else {
        return <ElementContent
            element={content.content}
            parentStyle={style}
            onDrop={onDrop}
        />;
    }
}

function ElementContent({
                            element,
                            parentStyle,
                            onDrop
                        }: {
    element: ComponentElement,
    parentStyle?: React.CSSProperties,
    onDrop?: (componentId: number) => void
}) {
    const [isDropTarget, setIsDropTarget] = useState(false);

    const style = useMemo(() => {
        const elementStyle: React.CSSProperties = {
            ...parentStyle,
            backgroundColor: getPropertyValue(element, 'backgroundColor'),
            padding: getPropertyValue(element, 'padding'),
            borderRadius: getPropertyValue(element, 'borderRadius'),
            borderColor: getPropertyValue(element, 'borderColor'),
            borderWidth: getPropertyValue(element, 'borderWidth'),
            color: getPropertyValue(element, 'color'),
            fontSize: getPropertyValue(element, 'fontSize'),
            fontWeight: getPropertyValue(element, 'fontWeight'),
            lineHeight: getPropertyValue(element, 'lineHeight'),
            textAlign: getPropertyValue(element, 'textAlign'),
            display: getPropertyValue(element, 'display'),
            flexDirection: getPropertyValue(element, 'flexDirection'),
            outline: isDropTarget ? '2px dashed #3b82f6' : 'none',
            outlineOffset: isDropTarget ? '2px' : '0',
        };
        return elementStyle;
    }, [element, parentStyle, isDropTarget]);

    const handleDragOver = (e: React.DragEvent) => {
        if (!element.type.canContainContent) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDropTarget(true);
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDropTarget(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDropTarget(false);

        if (!element.type.canContainContent) return;

        const componentId = e.dataTransfer.getData('componentId');
        if (componentId && onDrop) {
            onDrop(parseInt(componentId));
        }
    };

    const containerProps = element.type.canContainContent ? {
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop
    } : {};

    // Render based on component type
    switch (element.type.name) {
        case 'Text Block':
        case 'Paragraph':
            return (
                <p style={style} {...containerProps}>
                    {element.content.map((content, index) => (
                        <ContentRenderer
                            key={index}
                            content={content}
                            style={style}
                            onDrop={onDrop}
                        />
                    ))}
                </p>
            );

        case 'Heading 1':
            return (
                <h1 style={style} {...containerProps}>
                    {element.content.map((content, index) => (
                        <ContentRenderer
                            key={index}
                            content={content}
                            style={style}
                            onDrop={onDrop}
                        />
                    ))}
                </h1>
            );

        case 'Heading 2':
            return (
                <h2 style={style} {...containerProps}>
                    {element.content.map((content, index) => (
                        <ContentRenderer
                            key={index}
                            content={content}
                            style={style}
                            onDrop={onDrop}
                        />
                    ))}
                </h2>
            );

        case 'Button':
            return (
                <button
                    style={style}
                    disabled={true}
                    {...containerProps}
                >
                    {getPropertyValue(element, 'text')}
                </button>
            );

        case 'Link':
            return (
                <a
                    href={getPropertyValue(element, 'href')}
                    style={style}
                    {...containerProps}
                >
                    {getPropertyValue(element, 'text')}
                </a>
            );

        case 'Image':
            return (
                <img
                    src={getPropertyValue(element, 'src')}
                    alt={getPropertyValue(element, 'alt')}
                    style={{
                        ...style,
                        objectFit: getPropertyValue(element, 'objectFit') as 'cover' | 'contain'
                    }}
                    draggable={false}
                    {...containerProps}
                />
            );

        case 'Input Field':
            return (
                <input
                    type={getPropertyValue(element, 'type')}
                    placeholder={getPropertyValue(element, 'placeholder')}
                    style={style}
                    disabled={true}
                    {...containerProps}
                />
            );

        case 'Text Area':
            return (
                <textarea
                    placeholder={getPropertyValue(element, 'placeholder')}
                    style={style}
                    disabled={true}
                    {...containerProps}
                />
            );

        case 'Container':
            return (
                <div style={style} {...containerProps}>
                    {element.content.map((content, index) => (
                        <ContentRenderer
                            key={index}
                            content={content}
                            style={style}
                            onDrop={onDrop}
                        />
                    ))}
                </div>
            );

        default:
            return (
                <div style={style} {...containerProps}>Unknown Component</div>
            );
    }
}

export function ElementRenderer({
                                    element,
                                    isSelected,
                                    onSelect,
                                    onDelete,
                                    onMouseDown,
                                    onDragStart,
                                    onElementUpdate
                                }: ElementRendererProps) {
    const wrappedStyle: React.CSSProperties = {
        position: 'absolute',
        left: getPropertyValue(element, 'x'),
        top: getPropertyValue(element, 'y'),
        width: getPropertyValue(element, 'width'),
        height: getPropertyValue(element, 'height'),
        zIndex: isSelected ? 1000 : 1,
    };

    const handleContentDrop = (componentId: number) => {
        if (!element.type.canContainContent) return;

        const component = componentsLib.find(c => c.id === componentId);
        if (!component) return;

        const newContent: Content[] = [...element.content, {
            type: 'element',
            content: createElement(component)
        }];

        onElementUpdate({
            ...element,
            content: newContent
        });
    };

    return (
        <div
            className={`element-container ${isSelected ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200 hover:ring-blue-300'}`}
            style={wrappedStyle}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            onMouseDown={(e) => {
                if (e.currentTarget === e.target) {
                    e.stopPropagation();
                    onDragStart(e);
                }
            }}
        >
            {isSelected && (
                <>
                    <div
                        className="absolute -top-6 left-0 right-0 flex items-center justify-between bg-blue-500 text-white text-xs px-2 py-1 rounded-t z-50"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <span>{element.type.name}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            className="hover:bg-blue-600 p-1 rounded"
                        >
                            <Trash2 size={12}/>
                        </button>
                    </div>

                    <div
                        className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 cursor-nw-resize z-50"
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            onMouseDown(e, 'top-left');
                        }}
                    />
                    <div
                        className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 cursor-ne-resize z-50"
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            onMouseDown(e, 'top-right');
                        }}
                    />
                    <div
                        className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 cursor-sw-resize z-50"
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            onMouseDown(e, 'bottom-left');
                        }}
                    />
                    <div
                        className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 cursor-se-resize z-50"
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            onMouseDown(e, 'bottom-right');
                        }}
                    />
                </>
            )}

            <div
                className="w-full h-full"
                onMouseDown={(e) => {
                    e.stopPropagation();
                    onDragStart(e);
                }}
            >
                <ElementContent
                    element={element}
                    onDrop={handleContentDrop}
                />
            </div>
        </div>
    );
}
