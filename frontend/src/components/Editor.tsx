import {useEditorState} from '../hooks/useEditorState';
import {Toolbar} from './Toolbar';
import {ComponentsSidebar} from './ComponentsSidebar';
import {PropertiesPanel} from './PropertiesPanel';
import PageSettingsPanel from './PageSettingsPanel';
import {componentsData} from '../constants/components';
import {Element, PageSettings} from '../types';
import {useEffect, useMemo, useState} from 'react';
import {Trash2, XCircle} from 'lucide-react';
import Canvas from "@/components/Canvas.tsx";

const defaultPageSettings: PageSettings = {
    responsive: true,
    width: 1200,
    height: 800,
    maxWidth: 'none',
    bgColor: '#ffffff'
};

export default function Editor() {
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPageSettings, setShowPageSettings] = useState(false);
    const [pageSettings, setPageSettings] = useState<PageSettings>(defaultPageSettings);

    const {
        showSidebar,
        setShowSidebar,
        showProperties,
        setShowProperties,
        elements,
        setElements,
        selectedElement,
        setSelectedElement,
        historyIndex,
        history,
        addToHistory,
        undo,
        redo,
        resetHistory
    } = useEditorState();

    const loadContent = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/page');
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to load page content');
            }

            if (data.data) {
                setElements(data.data.elements || []);
                setPageSettings(data.data.settings || defaultPageSettings);
                resetHistory(data.data.elements || []);
                setSelectedElement(null);
                setShowProperties(false);
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load page content');
            setTimeout(() => setError(null), 5000);
        }
    };

    useEffect(() => {
        loadContent();
    }, []);

    const addElement = (type: string) => {
        const componentData = componentsData.find(c => c.id === type);
        if (!componentData) return;

        const newElement: Element = {
            id: Date.now(),
            type,
            properties: {
                x: 100,
                y: 100,
                width: 200,
                height: 100,
                ...Object.fromEntries(
                    componentData.properties.map(prop => [prop.name, prop.defaultValue])
                )
            },
            content: componentData.defaultContent
        };

        const newElements = [...elements, newElement];
        setElements(newElements);
        addToHistory(newElements);
        setSelectedElement(newElement);
        setShowProperties(true);
    };

    const updateElementProps = (id: number, newProps: Record<string, any>) => {
        const newElements = elements.map(el =>
            el.id === id
                ? {...el, properties: {...el.properties, ...newProps}}
                : el
        );
        setElements(newElements);
        setSelectedElement(newElements.find(el => el.id === id) || null);
        addToHistory(newElements);
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

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/api/page', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    elements: elements.map(el => ({
                        ...el,
                        id: Number(el.id)
                    })),
                    settings: pageSettings
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to save page');
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error || 'Failed to save page');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to save page');
        } finally {
            setIsSaving(false);
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleUpdatePageSettings = (newSettings: PageSettings) => {
        setPageSettings(newSettings);
    };

    const handleLoad = async () => {
        setIsLoading(true);
        await loadContent();
        setIsLoading(false);
    };

    return (
        <div className="h-screen flex">
            <Toolbar
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
                showProperties={showProperties}
                setShowProperties={setShowProperties}
                showPageSettings={showPageSettings}
                setShowPageSettings={setShowPageSettings}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
                onUndo={undo}
                onRedo={redo}
                onSave={handleSave}
                onLoad={handleLoad}
                isSaving={isSaving}
                isLoading={isLoading}
            />

            {error && (
                <div className="fixed top-14 right-4 w-96 bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg z-50">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <XCircle className="h-5 w-5 text-red-500"/>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
                        <div className="text-gray-600">Loading content...</div>
                    </div>
                </div>
            )}

            <div className="flex flex-1 pt-12">
                {showSidebar && (
                    <ComponentsSidebar
                        components={componentsData}
                        onAddElement={addElement}
                    />
                )}

                <div className="flex-1 bg-gray-50 overflow-hidden">
                    <Canvas
                        elements={elements}
                        pageSettings={pageSettings}
                        selectedElement={selectedElement}
                        onElementSelect={(element) => {
                            setSelectedElement(element);
                            setShowProperties(true);
                        }}
                        onElementUpdate={(element) => {
                            const newElements = elements.map(el =>
                                el.id === element.id ? element : el
                            );
                            setElements(newElements);
                            setSelectedElement(element);
                            addToHistory(newElements);
                        }}
                        onElementDelete={deleteElement}
                    />
                </div>

                {showProperties && selectedElement && (
                    <PropertiesPanel
                        element={selectedElement}
                        onClose={() => setShowProperties(false)}
                        onUpdateProperties={updateElementProps}
                    />
                )}

                {showPageSettings && (
                    <PageSettingsPanel
                        settings={pageSettings}
                        onUpdate={handleUpdatePageSettings}
                        onClose={() => setShowPageSettings(false)}
                    />
                )}
            </div>
        </div>
    );
}

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

    const elementStyle = useMemo(() => {
        const style: React.CSSProperties = {
            position: 'absolute',
            left: element.properties.x,
            top: element.properties.y,
            width: element.properties.width,
            height: element.properties.height,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
        };

        // Add all style-related properties
        if (componentDef) {
            for (const prop of componentDef.properties) {
                if (['color', 'backgroundColor', 'fontSize', 'fontWeight', 'lineHeight',
                    'textAlign', 'padding', 'margin', 'borderRadius', 'borderColor',
                    'borderWidth', 'opacity', 'display', 'flexDirection'].includes(prop.name)) {
                    style[prop.name as keyof React.CSSProperties] = element.properties[prop.name];
                }
            }
        }

        return style;
    }, [element.properties, element.type]);

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
                            item.type === 'text' ? (
                                <span key={index}>{item.content}</span>
                            ) : null // We'll handle nested elements later
                        ))}
                    </div>
                );
            }

            case 'button': {
                return (
                    <button
                        style={elementStyle}
                        disabled={element.properties.disabled}
                    >
                        {element.properties.text}
                    </button>
                );
            }

            case 'link': {
                return (
                    <a
                        href={element.properties.href}
                        style={elementStyle}
                    >
                        {element.properties.text}
                    </a>
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
                        readOnly
                    />
                );
            }

            case 'textarea': {
                return (
                    <textarea
                        placeholder={element.properties.placeholder}
                        rows={element.properties.rows}
                        style={elementStyle}
                        readOnly
                    />
                );
            }

            case 'div': {
                return (
                    <div style={elementStyle}>
                        {element.content.map((item, index) => (
                            item.type === 'text' ? (
                                <span key={index}>{item.content}</span>
                            ) : null // We'll handle nested elements later
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
            className={`absolute border border-gray-200 ${
                isSelected ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={(e) => {
                e.preventDefault();
                onSelect();
            }}
            onMouseDown={(e) => e.preventDefault()}
            style={{
                left: element.properties.x,
                top: element.properties.y,
                width: element.properties.width,
                height: element.properties.height,
            }}
        >
            {isSelected && (
                <div
                    className="absolute -top-6 left-0 right-0 flex items-center justify-between bg-blue-500 text-white text-xs px-2 py-1 rounded-t"
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                >
                    <span>{componentDef?.name || element.type}</span>
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
            )}

            {isSelected && (
                <>
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
                className="w-full h-full cursor-move"
                onMouseDown={(e) => {
                    e.preventDefault();
                    onDragStart(e);
                }}
            >
                {renderContent()}
            </div>
        </div>
    );
}
