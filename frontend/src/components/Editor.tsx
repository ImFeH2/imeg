import {useEditorState} from '../hooks/useEditorState';
import {Toolbar} from './Toolbar';
import {ComponentsSidebar} from './ComponentsSidebar';
import {PropertiesPanel} from './PropertiesPanel';
import {PageSettingsPanel} from './PageSettingsPanel';
import {componentsLib, createElement, generateComponentHash} from '../constants/components';
import {Component, PageSettings} from '../types';
import {useEffect, useState} from 'react';
import {XCircle} from 'lucide-react';
import Canvas from "./Canvas";
import * as api from '@/services/api';

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
    const [customComponents, setCustomComponents] = useState<Component[]>([]);

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
            setIsLoading(true);
            const [pageData, componentsData] = await Promise.all([
                api.getPage(),
                api.getComponents()
            ]);

            setElements(pageData.elements || []);
            setPageSettings(pageData.settings || defaultPageSettings);
            setCustomComponents(componentsData || []);
            resetHistory(pageData.elements || []);
            setSelectedElement(null);
            setShowProperties(false);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load content');
            setTimeout(() => setError(null), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadContent();
    }, []);

    const saveAsCustomComponent = async () => {
        if (!selectedElement) return;

        const prototype = selectedElement.type;
        if (!prototype) return;

        try {
            const newComponent: Component = {
                id: 0,
                name: prototype.name,
                icon: prototype.icon,
                category: 'custom',
                description: `Custom component based on ${prototype.name}`,
                properties: selectedElement.properties,
                canContainContent: prototype.canContainContent,
                defaultContent: selectedElement.content,
                tags: prototype.tags?.includes('custom') ? prototype.tags : [...(prototype.tags || []), 'custom']
            };
            newComponent.properties = newComponent.properties.filter(prop => !['x', 'y', 'width', 'height'].includes(prop.name));
            newComponent.id = generateComponentHash(newComponent);

            const savedComponent = await api.saveComponent(newComponent);
            setCustomComponents(prev => [...prev, savedComponent]);
            setError('Component saved successfully!');
            setTimeout(() => setError(null), 3000);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to save custom component');
            setTimeout(() => setError(null), 5000);
        }
    };

    const deleteCustomComponent = async (componentId: number) => {
        try {
            await api.deleteComponent(componentId);
            setCustomComponents(prev => prev.filter(c => c.id !== componentId));
            const newElements = elements.filter(el => el.type.id !== componentId);
            if (newElements.length !== elements.length) {
                setElements(newElements);
                addToHistory(newElements);
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to delete component');
            setTimeout(() => setError(null), 5000);
        }
    };

    const addElement = (typeId: number, x: number = 100, y: number = 100) => {
        const prototype = [...componentsLib, ...customComponents].find(c => c.id === typeId);
        if (!prototype) {
            console.warn('Component prototype not found:', typeId);
            return;
        }

        const newElement = createElement(prototype, {x, y});
        if (!newElement) {
            console.warn('Failed to create element');
            return;
        }

        console.log('Created new element:', newElement); // Debug log
        const newElements = [...elements, newElement];
        setElements(newElements);
        addToHistory(newElements);
        setSelectedElement(newElement);
        setShowProperties(true);
    };

    const updateElementProps = (id: number, updates: Array<{ name: string, value: any }>) => {
        const newElements = elements.map(el => {
            if (el.id !== id) return el;

            const newProperties = el.properties.map(prop => {
                const update = updates.find(u => u.name === prop.name);
                return update ? {...prop, value: update.value} : prop;
            });

            return {...el, properties: newProperties};
        });

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
            await api.savePage({
                elements,
                settings: pageSettings
            });
            setError('Page saved successfully!');
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
        await loadContent();
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
                onSaveAsComponent={selectedElement ? saveAsCustomComponent : undefined}
            />

            {/* Error/Success Notification */}
            {error && (
                <div className={`fixed top-14 right-4 w-96 ${
                    error.includes('successfully') ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                } border-l-4 p-4 rounded shadow-lg z-50`}>
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <XCircle className={`h-5 w-5 ${
                                error.includes('successfully') ? 'text-green-500' : 'text-red-500'
                            }`}/>
                        </div>
                        <div className="ml-3">
                            <p className={`text-sm ${
                                error.includes('successfully') ? 'text-green-700' : 'text-red-700'
                            }`}>{error}</p>
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
                        components={[...componentsLib, ...customComponents]}
                        onAddElement={addElement}
                        onDeleteCustomComponent={deleteCustomComponent}
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
                        onDropComponent={(componentId, x, y) => {
                            addElement(parseInt(componentId, 10), x, y);
                        }}
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
