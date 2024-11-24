import {ElementRenderer} from './ElementRenderer';
import {Element} from '../types';
import {Pencil} from 'lucide-react';

interface PreviewModeProps {
    elements: Element[];
    onExitPreview: () => void;
}

const PreviewMode = ({elements, onExitPreview}: PreviewModeProps) => {
    return (
        <div className="fixed inset-0 bg-white z-50">
            <div className="absolute top-4 right-4">
                <button
                    onClick={onExitPreview}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <Pencil size={16}/>
                    <span>Exit Preview</span>
                </button>
            </div>

            <div className="w-full h-full overflow-auto">
                <div className="max-w-6xl mx-auto my-12 px-4">
                    <div className="relative min-h-screen bg-white rounded-lg">
                        {elements.map(element => (
                            <ElementRenderer
                                key={element.id}
                                element={element}
                                isSelected={false}
                                isPreview={true}
                                onSelect={() => {
                                }}
                                onDelete={() => {
                                }}
                                onMouseDown={() => {
                                }}
                                onDragStart={() => {
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewMode;
