import {useEditorState} from '../hooks/useEditorState';
import {useElementInteraction} from '../hooks/useElementInteraction';
import {Toolbar} from './Toolbar';
import {ComponentsSidebar} from './ComponentsSidebar';
import {PropertiesPanel} from './PropertiesPanel';
import {ElementRenderer} from './ElementRenderer';
import {componentsData} from '../constants/components';
import {ComponentProps} from '../types';

export default function Editor() {
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
        redo
    } = useEditorState();

    const {handleMouseDown, handleDragStart} = useElementInteraction(
        elements,
        setElements,
        addToHistory
    );

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

    return (
        <div className="h-screen flex">
            <Toolbar
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
                showProperties={showProperties}
                setShowProperties={setShowProperties}
                isPreview={isPreview}
                setIsPreview={setIsPreview}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
                onUndo={undo}
                onRedo={redo}
            />

            <div className="flex flex-1 pt-12">
                {showSidebar && !isPreview && (
                    <ComponentsSidebar
                        components={componentsData}
                        onAddElement={addElement}
                    />
                )}

                <div className="flex-1 bg-gray-50">
                    <div className="max-w-4xl mx-auto p-8">
                        <div className="relative min-h-[500px] bg-white rounded-lg shadow-sm border">
                            {elements.map(element => (
                                <ElementRenderer
                                    key={element.id}
                                    element={element}
                                    isSelected={selectedElement?.id === element.id}
                                    isPreview={isPreview}
                                    onSelect={() => {
                                        if (!isPreview) {
                                            setSelectedElement(element);
                                            setShowProperties(true);
                                        }
                                    }}
                                    onDelete={() => deleteElement(element.id)}
                                    onMouseDown={(e, corner) => handleMouseDown(e, element.id, corner)}
                                    onDragStart={(e) => handleDragStart(e, element.id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {showProperties && !isPreview && selectedElement && (
                    <PropertiesPanel
                        element={selectedElement}
                        onClose={() => setShowProperties(false)}
                        onUpdateProps={updateElementProps}
                        onUpdatePosition={(axis, value) => {
                            const newElements = elements.map(el =>
                                el.id === selectedElement.id
                                    ? {...el, position: {...el.position, [axis]: value}}
                                    : el
                            );
                            setElements(newElements);
                            setSelectedElement(newElements.find(el => el.id === selectedElement.id) || null);
                            addToHistory(newElements);
                        }}
                        onUpdateSize={(dimension, value) => {
                            const newElements = elements.map(el =>
                                el.id === selectedElement.id
                                    ? {...el, size: {...el.size, [dimension]: value}}
                                    : el
                            );
                            setElements(newElements);
                            setSelectedElement(newElements.find(el => el.id === selectedElement.id) || null);
                            addToHistory(newElements);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
