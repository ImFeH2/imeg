import {X} from 'lucide-react';
import {ComponentProps, Element} from '../types';

interface PropertiesPanelProps {
    element: Element;
    onClose: () => void;
    onUpdateProps: (id: number, props: Partial<ComponentProps>) => void;
    onUpdatePosition: (axis: 'x' | 'y', value: number) => void;
    onUpdateSize: (dimension: 'width' | 'height', value: number) => void;
}

export function PropertiesPanel({
                                    element,
                                    onClose,
                                    onUpdateProps,
                                    onUpdatePosition,
                                    onUpdateSize
                                }: PropertiesPanelProps) {
    const renderPropertyField = (key: string, value: any) => {
        switch (typeof value) {
            case 'string':
                if (key.toLowerCase().includes('color')) {
                    return (
                        <input
                            type="color"
                            value={value}
                            onChange={(e) => onUpdateProps(element.id, {[key]: e.target.value})}
                            className="w-full"
                        />
                    );
                }
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onUpdateProps(element.id, {[key]: e.target.value})}
                        className="w-full px-2 py-1 border rounded"
                    />
                );
            case 'number':
                return (
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => onUpdateProps(element.id, {[key]: Number(e.target.value)})}
                        className="w-full px-2 py-1 border rounded"
                    />
                );
            case 'object':
                if (Array.isArray(value)) {
                    return (
                        <textarea
                            value={value.join('\n')}
                            onChange={(e) => onUpdateProps(element.id, {[key]: e.target.value.split('\n')})}
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

    return (
        <div className="w-64 border-l bg-white overflow-y-auto">
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-sm text-gray-700">Properties</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <X size={16}/>
                    </button>
                </div>
                <div className="space-y-4">
                    {Object.entries(element.props).map(([key, value]) => (
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
                                    value={element.position.x}
                                    onChange={(e) => onUpdatePosition('x', Number(e.target.value))}
                                    className="w-full px-2 py-1 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Y</label>
                                <input
                                    type="number"
                                    value={element.position.y}
                                    onChange={(e) => onUpdatePosition('y', Number(e.target.value))}
                                    className="w-full px-2 py-1 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Width</label>
                                <input
                                    type="number"
                                    value={element.size.width}
                                    onChange={(e) => onUpdateSize('width', Number(e.target.value))}
                                    className="w-full px-2 py-1 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Height</label>
                                <input
                                    type="number"
                                    value={element.size.height}
                                    onChange={(e) => onUpdateSize('height', Number(e.target.value))}
                                    className="w-full px-2 py-1 border rounded"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
