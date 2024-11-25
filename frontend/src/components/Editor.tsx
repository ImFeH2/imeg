import {useEditorState} from '../hooks/useEditorState';
import {useElementInteraction} from '../hooks/useElementInteraction';
import {Toolbar} from './Toolbar';
import {ComponentsSidebar} from './ComponentsSidebar';
import {PropertiesPanel} from './PropertiesPanel';
import PageSettingsPanel from './PageSettingsPanel';
import {ElementRenderer} from './ElementRenderer';
import PreviewMode from './PreviewMode';
import {componentsData} from '../constants/components';
import {ComponentProps, PageSettings} from '../types';
import {useEffect, useState} from 'react';
import {XCircle} from 'lucide-react';

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
        isPreview,
        setIsPreview,
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

    const {handleMouseDown, handleDragStart} = useElementInteraction(
        elements,
        setElements,
        addToHistory
    );

    useEffect(() => {
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
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to load page content');
            } finally {
                setIsLoading(false);
            }
        };

        loadContent();
    }, []);

    const addElement = (type: string) => {
        const componentData = componentsData.find(c => c.id === type);
        if (!componentData) return;

        const newElement = {
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

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to save page');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to save page');
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdatePageSettings = (newSettings: PageSettings) => {
        setPageSettings(newSettings);
    };

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
            setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
        }
    };

    useEffect(() => {
        const initializeEditor = async () => {
            setIsLoading(true);
            await loadContent();
            setIsLoading(false);
        };

        initializeEditor();
    }, []);

    const handleLoad = async () => {
        setIsLoading(true);
        await loadContent();
        setIsLoading(false);
    };

    const updateElementPosition = (axis: 'x' | 'y', value: number) => {
        const newElements = elements.map(el =>
            el.id === selectedElement?.id
                ? {
                    ...el,
                    position: {
                        ...el.position,
                        [axis]: value
                    }
                }
                : el
        );
        setElements(newElements);
        setSelectedElement(newElements.find(el => el.id === selectedElement?.id) || null);
        addToHistory(newElements);
    };

    const updateElementSize = (dimension: 'width' | 'height', value: number) => {
        const newElements = elements.map(el =>
            el.id === selectedElement?.id
                ? {
                    ...el,
                    size: {
                        ...el.size,
                        [dimension]: value
                    }
                }
                : el
        );
        setElements(newElements);
        setSelectedElement(newElements.find(el => el.id === selectedElement?.id) || null);
        addToHistory(newElements);
    };

    const getPageStyle = () => {
        if (pageSettings.responsive) {
            return {
                backgroundColor: pageSettings.bgColor,
                minHeight: '500px',
                ...(pageSettings.maxWidth !== 'none' && {maxWidth: pageSettings.maxWidth})
            };
        }

        return {
            width: `${pageSettings.width}px`,
            height: `${pageSettings.height}px`,
            backgroundColor: pageSettings.bgColor
        };
    };

    if (isPreview) {
        return (
            <PreviewMode
                elements={elements}
                pageSettings={pageSettings}
                onExitPreview={() => setIsPreview(false)}
            />
        );
    }

    return (
        <div className="h-screen flex">
            <Toolbar
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
                showProperties={showProperties}
                setShowProperties={setShowProperties}
                showPageSettings={showPageSettings}
                setShowPageSettings={setShowPageSettings}
                isPreview={isPreview}
                setIsPreview={setIsPreview}
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

                <div className="flex-1 bg-gray-50 overflow-auto">
                    <div className={`mx-auto p-8 ${pageSettings.responsive ? pageSettings.maxWidth : ''}`}>
                        <div
                            className="relative rounded-lg shadow-sm border"
                            style={getPageStyle()}
                        >
                            {elements.map(element => (
                                <ElementRenderer
                                    key={element.id}
                                    element={element}
                                    isSelected={selectedElement?.id === element.id}
                                    isPreview={false}
                                    onSelect={() => {
                                        setSelectedElement(element);
                                        setShowProperties(true);
                                    }}
                                    onDelete={() => deleteElement(element.id)}
                                    onMouseDown={(e, corner) => handleMouseDown(e, element.id, corner)}
                                    onDragStart={(e) => handleDragStart(e, element.id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {showProperties && selectedElement && (
                    <PropertiesPanel
                        element={selectedElement}
                        onClose={() => setShowProperties(false)}
                        onUpdateProps={updateElementProps}
                        onUpdatePosition={updateElementPosition}
                        onUpdateSize={updateElementSize}
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
