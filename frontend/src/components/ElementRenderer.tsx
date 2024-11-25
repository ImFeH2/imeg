import {Trash2} from 'lucide-react';
import {Element} from '../types';

interface ElementRendererProps {
    element: Element;
    isSelected: boolean;
    isPreview: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onMouseDown: (e: React.MouseEvent, corner: string) => void;
    onDragStart: (e: React.MouseEvent) => void;
}

interface TextProps {
    text: string;
    fontSize: number;
    color: string;
    backgroundColor: string;
}

interface ImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
}

interface ButtonProps {
    text: string;
    bgColor: string;
    textColor: string;
    width: number;
    height: number;
}

interface ListProps {
    items: string[];
    listStyle: string;
    spacing: number;
}

export function ElementRenderer({
                                    element,
                                    isSelected,
                                    isPreview,
                                    onSelect,
                                    onDelete,
                                    onMouseDown,
                                    onDragStart
                                }: ElementRendererProps) {
    const style: React.CSSProperties = {
        position: 'absolute',
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
    };

    const renderContent = () => {
        switch (element.type) {
            case 'text': {
                const props = element.props as TextProps;
                return (
                    <div
                        style={{
                            fontSize: `${props.fontSize}px`,
                            color: props.color,
                            backgroundColor: props.backgroundColor,
                            width: '100%',
                            height: '100%',
                            padding: '8px',
                            pointerEvents: isPreview ? 'auto' : 'none',
                            userSelect: 'none',
                        }}
                    >
                        {props.text}
                    </div>
                );
            }
            case 'image': {
                const props = element.props as ImageProps;
                return (
                    <img
                        src={props.src}
                        alt={props.alt}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            pointerEvents: isPreview ? 'auto' : 'none',
                            userSelect: 'none',
                        }}
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                    />
                );
            }
            case 'button': {
                const props = element.props as ButtonProps;
                return (
                    <button
                        style={{
                            backgroundColor: props.bgColor,
                            color: props.textColor,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            borderRadius: '4px',
                            pointerEvents: isPreview ? 'auto' : 'none',
                            userSelect: 'none',
                        }}
                    >
                        {props.text}
                    </button>
                );
            }
            case 'list': {
                const props = element.props as ListProps;
                return (
                    <ul
                        style={{
                            listStyleType: props.listStyle,
                            padding: '8px 24px',
                            height: '100%',
                            overflowY: 'auto',
                            pointerEvents: isPreview ? 'auto' : 'none',
                            userSelect: 'none',
                        }}
                    >
                        {props.items.map((item: string, index: number) => (
                            <li key={index} style={{marginBottom: `${props.spacing}px`}}>
                                {item}
                            </li>
                        ))}
                    </ul>
                );
            }
            default:
                return <div>Unknown Component</div>;
        }
    };

    return (
        <div
            style={style}
            className={`absolute ${isPreview ? '' : 'border border-gray-200'} ${
                isSelected && !isPreview ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={(e) => {
                e.preventDefault();
                onSelect();
            }}
            onMouseDown={(e) => {
                if (!isPreview) {
                    e.preventDefault();
                }
            }}
        >
            {!isPreview && (
                <>
                    <div
                        className="absolute -top-6 left-0 right-0 flex items-center justify-between bg-blue-500 text-white text-xs px-2 py-1 rounded-t"
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                    >
                        <span>{element.type}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onDelete();
                            }}
                            className="hover:bg-blue-600 p-1 rounded"
                        >
                            <Trash2 size={12}/>
                        </button>
                    </div>
                    <div
                        className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 cursor-nw-resize"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onMouseDown(e, 'top-left');
                        }}
                    />
                    <div
                        className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 cursor-ne-resize"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onMouseDown(e, 'top-right');
                        }}
                    />
                    <div
                        className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 cursor-sw-resize"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onMouseDown(e, 'bottom-left');
                        }}
                    />
                    <div
                        className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 cursor-se-resize"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onMouseDown(e, 'bottom-right');
                        }}
                    />
                </>
            )}
            <div
                className={`w-full h-full ${!isPreview ? 'cursor-move' : ''}`}
                onMouseDown={(e) => {
                    if (!isPreview) {
                        e.preventDefault();
                        onDragStart(e);
                    }
                }}
            >
                {renderContent()}
            </div>
        </div>
    );
}
