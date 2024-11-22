import {Eye, Pencil, Redo, Save, Settings, Sidebar, Undo} from 'lucide-react';

interface ToolbarProps {
    showSidebar: boolean;
    setShowSidebar: (show: boolean) => void;
    showProperties: boolean;
    setShowProperties: (show: boolean) => void;
    isPreview: boolean;
    setIsPreview: (preview: boolean) => void;
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
}

export function Toolbar({
                            showSidebar,
                            setShowSidebar,
                            showProperties,
                            setShowProperties,
                            isPreview,
                            setIsPreview,
                            canUndo,
                            canRedo,
                            onUndo,
                            onRedo
                        }: ToolbarProps) {
    return (
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
                    onClick={onUndo}
                    disabled={!canUndo}
                    className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                    <Undo size={20}/>
                </button>
                <button
                    onClick={onRedo}
                    disabled={!canRedo}
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
    );
}
