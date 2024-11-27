import {Trash2} from 'lucide-react';
import {ComponentElement, Content} from '../types';
import React, {useMemo} from 'react';

interface ElementRendererProps {
    element: ComponentElement;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onMouseDown: (e: React.MouseEvent, corner: string) => void;
    onDragStart: (e: React.MouseEvent) => void;
}

// Helper function to get property value
function getPropertyValue(element: ComponentElement, propertyName: string) {
    if (!element?.properties || !Array.isArray(element.properties)) {
        console.warn('Invalid properties structure:', element);
        return undefined;
    }
    const property = element.properties.find(p => p.name === propertyName);
    return property ? property.value : undefined;
}

// Recursive content renderer
function ContentRenderer({content, style}: { content: Content, style: React.CSSProperties }) {
    if (content.type === 'text') {
        // Text content is always wrapped in a span to inherit parent styles
        return <span style={style}>{content.content}</span>;
    } else {
        // For element content, recursively render the component
        return <ElementContent element={content.content} parentStyle={style}/>;
    }
}

// Component content renderer
function ElementContent({element, parentStyle}: { element: ComponentElement, parentStyle?: React.CSSProperties }) {
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
        };
        return elementStyle;
    }, [element, parentStyle]);

    // Render based on component type
    switch (element.type.name) {
        case 'Text Block':
        case 'Paragraph':
            return (
                <p style={style}>
                    {element.content.map((content, index) => (
                        <ContentRenderer key={index} content={content} style={style}/>
                    ))}
                </p>
            );

        case 'Heading 1':
            return (
                <h1 style={style}>
                    {element.content.map((content, index) => (
                        <ContentRenderer key={index} content={content} style={style}/>
                    ))}
                </h1>
            );

        case 'Heading 2':
            return (
                <h2 style={style}>
                    {element.content.map((content, index) => (
                        <ContentRenderer key={index} content={content} style={style}/>
                    ))}
                </h2>
            );

        case 'Button':
            return (
                <button
                    style={style}
                    disabled={true}
                >
                    {getPropertyValue(element, 'text')}
                </button>
            );

        case 'Link':
            return (
                <a
                    href={getPropertyValue(element, 'href')}
                    style={style}
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
                />
            );

        case 'Input Field':
            return (
                <input
                    type={getPropertyValue(element, 'type')}
                    placeholder={getPropertyValue(element, 'placeholder')}
                    style={style}
                    disabled={true}
                />
            );

        case 'Text Area':
            return (
                <textarea
                    placeholder={getPropertyValue(element, 'placeholder')}
                    style={style}
                    disabled={true}
                />
            );

        case 'Container':
            return (
                <div style={style}>
                    {element.content.map((content, index) => (
                        <ContentRenderer key={index} content={content} style={style}/>
                    ))}
                </div>
            );

        default:
            return (
                <div style={style}>Unknown Component</div>
            );
    }
}

export function ElementRenderer({
                                    element,
                                    isSelected,
                                    onSelect,
                                    onDelete,
                                    onMouseDown,
                                    onDragStart
                                }: ElementRendererProps) {
    const wrappedStyle: React.CSSProperties = {
        position: 'absolute',
        left: getPropertyValue(element, 'x'),
        top: getPropertyValue(element, 'y'),
        width: getPropertyValue(element, 'width'),
        height: getPropertyValue(element, 'height'),
        zIndex: isSelected ? 1000 : 1,
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
                    {/* Header with delete button */}
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

                    {/* Resize handles */}
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
                <ElementContent element={element}/>
            </div>
        </div>
    );
}
