import {useState} from 'react';
import {Eye, Pencil, Redo, Save, Settings, Sidebar, Trash2, Undo, X} from 'lucide-react';

interface ComponentProps {
    text?: string;
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    bgColor?: string;
    textColor?: string;
    items?: string[];
    listStyle?: string;
    spacing?: number;
}

interface ComponentData {
    id: string;
    name: string;
    icon: string;
    defaultProps: ComponentProps;
}

interface Position {
    x: number;
    y: number;
}

interface Size {
    width: number;
    height: number;
}

interface Element {
    id: number;
    type: string;
    position: Position;
    size: Size;
    props: ComponentProps;
}

interface ResizingState {
    elementId: number;
    corner: string;
    startX: number;
    startY: number;
}

const componentsData: ComponentData[] = [
    {
        id: 'text',
        name: 'Text Block',
        icon: 'T',
        defaultProps: {
            text: 'Edit this text',
            fontSize: 16,
            color: '#000000',
            backgroundColor: 'transparent'
        }
    },
    {
        id: 'image',
        name: 'Image',
        icon: '🖼',
        defaultProps: {
            src: '/api/placeholder/300/200',
            alt: 'Image description',
            width: 300,
            height: 200
        }
    },
    {
        id: 'button',
        name: 'Button',
        icon: '⬢',
        defaultProps: {
            text: 'Click me',
            bgColor: '#3b82f6',
            textColor: '#ffffff',
            width: 120,
            height: 40
        }
    },
    {
        id: 'list',
        name: 'List',
        icon: '≡',
        defaultProps: {
            items: ['Item 1', 'Item 2', 'Item 3'],
            listStyle: 'disc',
            spacing: 4
        }
    }
];

export default function Editor() {
    const [isPreview, setIsPreview] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [showProperties, setShowProperties] = useState(false);
    const [elements, setElements] = useState<Element[]>([]);
    const [selectedElement, setSelectedElement] = useState<Element | null>(null);
    const [history, setHistory] = useState<Element[][]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [resizing, setResizing] = useState<ResizingState | null>(null);
    const [initialSize, setInitialSize] = useState<Size | null>(null);
    const [initialPosition, setInitialPosition] = useState<Position | null>(null);

    const addElement = (type: string) => {
        const componentData = componentsData.find(c => c.id === type);
        if (!componentData) return;

        const newElement: Element = {
            id: Date.now(),
            type,
            position: {x: 100, y: 100},
            size: {width: 200, height: 100},
            props: {...componentData.defaultProps}
        };

        const newElements = [...elements, newElement];
        setElements(newElements);
        addToHistory(newElements);
        setSelectedElement(newElement);
        setShowProperties(true);
    };

    const addToHistory = (newElements: Element[]) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newElements);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const updateElementProps = (id: number, newProps: Partial<ComponentProps>) => {
        const newElements = elements.map(el =>
            el.id === id
                ? {...el, props: {...el.props, ...newProps}}
                : el
        );
        setElements(newElements);
        setSelectedElement(newElements.find(el => el.id === id) || null);
        addToHistory(newElements);
    };

    const handleMouseDown = (e: React.MouseEvent, elementId: number, corner: string) => {
        if (isPreview) return;

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
        if (isPreview) return;

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

        const handleDragEnd = () => {
            addToHistory(elements);
            document.removeEventListener('mousemove', handleDragMove);
            document.removeEventListener('mouseup', handleDragEnd);
        };

        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setElements(history[historyIndex - 1]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setElements(history[historyIndex + 1]);
        }
    };

    const deleteElement = (id: number) => {
        const newElements = elements.filter(el => el.id !== id);
        setElements(newElements);
        if (selectedElement?.id === id) {
            setSelectedElement(null);
            setShowProperties(false);
        }
        addToHistory(newElements);
    };

    const renderElement = (element: Element) => {
        const style: React.CSSProperties = {
            position: 'absolute',
            left: element.position.x,
            top: element.position.y,
            width: element.size.width,
            height: element.size.height,
        };

        let content;
        switch (element.type) {
            case 'text':
                content = (
                    <div
                        style={{
                            fontSize: `${element.props.fontSize}px`,
                            color: element.props.color,
                            backgroundColor: element.props.backgroundColor,
                            width: '100%',
                            height: '100%',
                            padding: '8px'
                        }}
                    >
                        {element.props.text}
                    </div>
                );
                break;
            case 'image':
                content = (
                    <img
                        src={element.props.src}
                        alt={element.props.alt}
                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                    />
                );
                break;
            case 'button':
                content = (
                    <button
                        style={{
                            backgroundColor: element.props.bgColor,
                            color: element.props.textColor,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        {element.props.text}
                    </button>
                );
                break;
            case 'list':
                content = (
                    <ul
                        style={{
                            listStyleType: element.props.listStyle,
                            padding: '8px 24px',
                            height: '100%',
                            overflowY: 'auto'
                        }}
                    >
                        {element.props.items?.map((item, index) => (
                            <li key={index} style={{marginBottom: `${element.props.spacing}px`}}>
                                {item}
                            </li>
                        ))}
                    </ul>
                );
                break;
            default:
                content = <div>Unknown Component</div>;
        }

        return (
            <div
                key={element.id}
                style={style}
                className={`absolute ${isPreview ? '' : 'border border-gray-200'} ${
                    selectedElement?.id === element.id && !isPreview ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => {
                    if (!isPreview) {
                        setSelectedElement(element);
                        setShowProperties(true);
                    }
                }}
            >
                {!isPreview && (
                    <>
                        <div
                            className="absolute -top-6 left-0 right-0 flex items-center justify-between bg-blue-500 text-white text-xs px-2 py-1 rounded-t"
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <span>{element.type}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteElement(element.id);
                                }}
                                className="hover:bg-blue-600 p-1 rounded"
                            >
                                <Trash2 size={12}/>
                            </button>
                        </div>
                        <div
                            className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 cursor-nw-resize"
                            onMouseDown={(e) => handleMouseDown(e, element.id, 'top-left')}
                        />
                        <div
                            className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 cursor-ne-resize"
                            onMouseDown={(e) => handleMouseDown(e, element.id, 'top-right')}
                        />
                        <div
                            className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 cursor-sw-resize"
                            onMouseDown={(e) => handleMouseDown(e, element.id, 'bottom-left')}
                        />
                        <div
                            className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 cursor-se-resize"
                            onMouseDown={(e) => handleMouseDown(e, element.id, 'bottom-right')}
                        />
                    </>
                )}
                <div
                    className={`w-full h-full ${!isPreview ? 'cursor-move' : ''}`}
                    onMouseDown={(e) => !isPreview && handleDragStart(e, element.id)}
                >
                    {content}
                </div>
            </div>
        );
    };

    const renderPropertiesPanel = () => {
        if (!selectedElement) return null;

        const componentData = componentsData.find(c => c.id === selectedElement.type);
        if (!componentData) return null;

        const renderPropertyField = (key: string, value: any) => {
            switch (typeof value) {
                case 'string':
                    if (key.toLowerCase().includes('color')) {
                        return (
                            <input
                                type="color"
                                value={value}
                                onChange={(e) => updateElementProps(selectedElement.id, {[key]: e.target.value})}
                                className="w-full"
                            />
                        );
                    }
                    return (
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => updateElementProps(selectedElement.id, {[key]: e.target.value})}
                            className="w-full px-2 py-1 border rounded"
                        />
                    );
                case 'number':
                    return (
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => updateElementProps(selectedElement.id, {[key]: Number(e.target.value)})}
                            className="w-full px-2 py-1 border rounded"
                        />
                    );
                case 'object':
                    if (Array.isArray(value)) {
                        return (
                            <textarea
                                value={value.join('\n')}
                                onChange={(e) => updateElementProps(selectedElement.id, {[key]: e.target.value.split('\n')})}
                                className="w-full px-2 py-1 border rounded"
                                rows={4}
                            />
                        );
                    }
                    return null;
                default:
                    return null;
            }
        };

        const updatePosition = (axis: 'x' | 'y', value: number) => {
            const newElements = elements.map(el =>
                el.id === selectedElement.id
                    ? {...el, position: {...el.position, [axis]: Number(value)}}
                    : el
            );
            setElements(newElements);
            setSelectedElement(newElements.find(el => el.id === selectedElement.id) || null);
            addToHistory(newElements);
        };

        const updateSize = (dimension: 'width' | 'height', value: number) => {
            const newElements = elements.map(el =>
                el.id === selectedElement.id
                    ? {...el, size: {...el.size, [dimension]: Number(value)}}
                    : el
            );
            setElements(newElements);
            setSelectedElement(newElements.find(el => el.id === selectedElement.id) || null);
            addToHistory(newElements);
        };

        return (
            <div className="w-64 border-l bg-white overflow-y-auto">
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-sm text-gray-700">Properties</h2>
                        <button
                            onClick={() => setShowProperties(false)}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <X size={16}/>
                        </button>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(selectedElement.props).map(([key, value]) => (
                            <div key={key}>
                                <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                                {renderPropertyField(key, value)}
                            </div>
                        ))}
                        <div className="pt-4 border-t">
                            <h3 className="font-medium text-sm text-gray-700 mb-2">Position & Size</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">X</label>
                                    <input
                                        type="number"
                                        value={selectedElement.position.x}
                                        onChange={(e) => updatePosition('x', Number(e.target.value))}
                                        className="w-full px-2 py-1 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Y</label>
                                    <input
                                        type="number"
                                        value={selectedElement.position.y}
                                        onChange={(e) => updatePosition('y', Number(e.target.value))}
                                        className="w-full px-2 py-1 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Width</label>
                                    <input
                                        type="number"
                                        value={selectedElement.size.width}
                                        onChange={(e) => updateSize('width', Number(e.target.value))}
                                        className="w-full px-2 py-1 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Height</label>
                                    <input
                                        type="number"
                                        value={selectedElement.size.height}
                                        onChange={(e) => updateSize('height', Number(e.target.value))}
                                        className="w-full px-2 py-1 border rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-screen flex">
            {/* Top Toolbar */}
            <div className="fixed top-0 left-0 right-0 h-12 bg-white border-b flex items-center px-4 z-10">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className={`p-2 hover:bg-gray-100 rounded ${showSidebar ? 'bg-gray-100' : ''}`}
                    >
                        <Sidebar size={20}/>
                    </button>
                    <button
                        onClick={() => setShowProperties(!showProperties)}
                        className={`p-2 hover:bg-gray-100 rounded ${showProperties ? 'bg-gray-100' : ''}`}
                    >
                        <Settings size={20}/>
                    </button>
                    <button
                        onClick={() => setIsPreview(!isPreview)}
                        className={`p-2 hover:bg-gray-100 rounded ${isPreview ? 'bg-gray-100' : ''}`}
                    >
                        {isPreview ? <Pencil size={20}/> : <Eye size={20}/>}
                    </button>
                    <div className="h-6 w-px bg-gray-300 mx-2"/>
                    <button
                        onClick={undo}
                        disabled={historyIndex <= 0}
                        className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                    >
                        <Undo size={20}/>
                    </button>
                    <button
                        onClick={redo}
                        disabled={historyIndex >= history.length - 1}
                        className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                    >
                        <Redo size={20}/>
                    </button>
                    <div className="h-6 w-px bg-gray-300 mx-2"/>
                    <button className="p-2 hover:bg-gray-100 rounded">
                        <Save size={20}/>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 pt-12">
                {/* Components Sidebar */}
                {showSidebar && !isPreview && (
                    <div className="w-64 border-r bg-white">
                        <div className="p-4">
                            <h2 className="font-semibold text-sm text-gray-700 mb-4">Components</h2>
                            <div className="space-y-2">
                                {componentsData.map(component => (
                                    <button
                                        key={component.id}
                                        onClick={() => addElement(component.id)}
                                        className="w-full p-3 flex items-center space-x-3 rounded hover:bg-gray-50 border"
                                    >
                                        <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded">
                                            {component.icon}
                                        </span>
                                        <span className="text-sm">{component.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Canvas */}
                <div className="flex-1 bg-gray-50">
                    <div className="max-w-4xl mx-auto p-8">
                        <div className="relative min-h-[500px] bg-white rounded-lg shadow-sm border">
                            {elements.map(element => renderElement(element))}
                        </div>
                    </div>
                </div>

                {/* Properties Panel */}
                {showProperties && !isPreview && renderPropertiesPanel()}
            </div>
        </div>
    );
}
