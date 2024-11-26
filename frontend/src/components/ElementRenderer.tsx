import {Trash2} from 'lucide-react';
import {Element} from '../types';
import {useMemo} from 'react';
import {componentsData} from "@/constants/components";

interface ElementRendererProps {
    element: Element;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onMouseDown: (e: React.MouseEvent, corner: string) => void;
    onDragStart: (e: React.MouseEvent) => void;
}

export function ElementRenderer({
                                    element,
                                    isSelected,
                                    onSelect,
                                    onDelete,
                                    onMouseDown,
                                    onDragStart
                                }: ElementRendererProps) {
    const componentDef = componentsData.find(c => c.id === element.type);

    // Calculate positions and dimensions
    const positions = useMemo(() => {
        return {
            x: Math.round(element.properties.x),
            y: Math.round(element.properties.y),
            width: Math.round(element.properties.width),
            height: Math.round(element.properties.height)
        };
    }, [element.properties]);

    // Prepare element style from properties
    const elementStyle = useMemo(() => {
        const style: React.CSSProperties = {
            width: '100%',
            height: '100%',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            boxSizing: 'border-box',
            position: 'relative',
            cursor: 'move',
            backgroundColor: element.properties.backgroundColor,
            borderRadius: element.properties.borderRadius,
            padding: element.properties.padding,
        };

        // Add component-specific styles
        if (componentDef) {
            for (const prop of componentDef.properties) {
                if (['color', 'fontSize', 'fontWeight', 'lineHeight',
                    'textAlign', 'margin', 'borderColor',
                    'borderWidth', 'opacity', 'display', 'flexDirection'].includes(prop.name)) {
                    style[prop.name as keyof React.CSSProperties] = element.properties[prop.name];
                }
            }
        }

        return style;
    }, [element.properties, componentDef]);

    // Content rendering with specific styles
    const renderContent = () => {
        if (!componentDef) return null;

        switch (element.type) {
            case 'text':
            case 'paragraph':
            case 'heading1':
            case 'heading2': {
                return (
                    <div style={elementStyle}>
                        {element.content.map((item, index) => (
                            item.type === 'text' && (
                                <span key={index}>
                                    {item.content}
                                </span>
                            )
                        ))}
                    </div>
                );
            }

            case 'button': {
                return (
                    <button
                        style={elementStyle}
                        disabled={true}
                    >
                        {element.properties.text}
                    </button>
                );
            }

            case 'link': {
                return (
                    <div style={elementStyle}>
                        {element.properties.text}
                    </div>
                );
            }

            case 'image': {
                return (
                    <img
                        src={element.properties.src}
                        alt={element.properties.alt}
                        style={{
                            ...elementStyle,
                            objectFit: element.properties.objectFit as 'cover' | 'contain'
                        }}
                        draggable={false}
                    />
                );
            }

            case 'input': {
                return (
                    <input
                        type={element.properties.type}
                        placeholder={element.properties.placeholder}
                        style={elementStyle}
                        disabled={true}
                    />
                );
            }

            case 'textarea': {
                return (
                    <textarea
                        placeholder={element.properties.placeholder}
                        style={elementStyle}
                        disabled={true}
                    />
                );
            }

            case 'div': {
                return (
                    <div style={elementStyle}>
                        {element.content.map((item, index) => (
                            item.type === 'text' && (
                                <span key={index}>
                                    {item.content}
                                </span>
                            )
                        ))}
                    </div>
                );
            }

            default:
                return <div style={elementStyle}>Unknown Component</div>;
        }
    };

    return (
        <div
            className={`element-container ${isSelected ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200 hover:ring-blue-300'}`}
            style={{
                position: 'absolute',
                left: positions.x,
                top: positions.y,
                width: positions.width,
                height: positions.height,
                zIndex: isSelected ? 1000 : 1,
            }}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            onMouseDown={(e) => {
                // 只有在点击元素本身而不是其子元素时才触发拖动
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
                        <span>{componentDef?.name || element.type}</span>
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
                {renderContent()}
            </div>
        </div>
    );
}
