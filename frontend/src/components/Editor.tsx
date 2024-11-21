import {useState} from 'react';
import {Eye, Pencil, Redo, Save, Sidebar, Undo} from 'lucide-react';

const componentsData = [
    {id: 'text', name: 'Text Block', icon: 'T'},
    {id: 'image', name: 'Image', icon: '🖼'},
    {id: 'button', name: 'Button', icon: '⬢'},
    {id: 'list', name: 'List', icon: '≡'}
];

export default function Editor() {
    const [isPreview, setIsPreview] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [elements, setElements] = useState([]);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const addElement = (type) => {
        const newElement = {
            id: Date.now(),
            type,
            position: {x: 100, y: 100}
        };

        const newElements = [...elements, newElement];
        setElements(newElements);
        addToHistory(newElements);
    };

    const addToHistory = (newElements) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newElements);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
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

    return (
        <div className="h-screen flex">
            {/* Top Toolbar */}
            <div className="fixed top-0 left-0 right-0 h-12 bg-white border-b flex items-center px-4 z-10">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="p-2 hover:bg-gray-100 rounded">
                        <Sidebar size={20}/>
                    </button>
                    <button
                        onClick={() => setIsPreview(!isPreview)}
                        className="p-2 hover:bg-gray-100 rounded">
                        {isPreview ? <Pencil size={20}/> : <Eye size={20}/>}
                    </button>
                    <div className="h-6 w-px bg-gray-300 mx-2"/>
                    <button
                        onClick={undo}
                        disabled={historyIndex <= 0}
                        className="p-2 hover:bg-gray-100 rounded disabled:opacity-50">
                        <Undo size={20}/>
                    </button>
                    <button
                        onClick={redo}
                        disabled={historyIndex >= history.length - 1}
                        className="p-2 hover:bg-gray-100 rounded disabled:opacity-50">
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
                                        className="w-full p-3 flex items-center space-x-3 rounded hover:bg-gray-50 border">
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
                        {isPreview ? (
                            <div className="prose max-w-none">
                                {/* Preview Content */}
                                <h1>Preview Mode</h1>
                                {elements.map(element => (
                                    <div key={element.id}>
                                        {element.type} Component
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="relative min-h-[500px] bg-white rounded-lg shadow-sm border">
                                {/* Editor Content */}
                                {elements.map(element => (
                                    <div
                                        key={element.id}
                                        style={{
                                            position: 'absolute',
                                            left: element.position.x,
                                            top: element.position.y
                                        }}
                                        className="p-4 border rounded bg-white cursor-move">
                                        {element.type} Component
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
