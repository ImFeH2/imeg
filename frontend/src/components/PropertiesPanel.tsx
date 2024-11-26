import {X} from 'lucide-react';
import {Element} from '../types';
import {componentsData} from '../constants/components';
import {useMemo} from 'react';

interface PropertiesPanelProps {
    element: Element;
    onClose: () => void;
    onUpdateProperties: (id: number, properties: Record<string, any>) => void;
}

export function PropertiesPanel({
                                    element,
                                    onClose,
                                    onUpdateProperties
                                }: PropertiesPanelProps) {
    const componentDef = componentsData.find(c => c.id === element.type);
    if (!componentDef) return null;

    // Group properties by category
    const groupedProperties = useMemo(() => {
        if (!componentDef) return {};

        return componentDef.properties.reduce((acc: Record<string, typeof componentDef.properties>, prop) => {
            if (!acc[prop.category]) {
                acc[prop.category] = [];
            }
            acc[prop.category].push(prop);
            return acc;
        }, {});
    }, [componentDef]);

    const renderPropertyField = (prop: (typeof componentDef.properties)[0]) => {
        const value = element.properties[prop.name];

        switch (prop.type) {
            case 'color':
                return (
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={value}
                            onChange={(e) => onUpdateProperties(element.id, {
                                [prop.name]: e.target.value
                            })}
                            className="w-8 h-8"
                        />
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => onUpdateProperties(element.id, {
                                [prop.name]: e.target.value
                            })}
                            className="flex-1 px-2 py-1 border rounded"
                        />
                    </div>
                );

            case 'select':
                return (
                    <select
                        value={value}
                        onChange={(e) => onUpdateProperties(element.id, {
                            [prop.name]: e.target.value
                        })}
                        className="w-full px-2 py-1 border rounded"
                    >
                        {prop.options?.map((option: string) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );

            case 'boolean':
                return (
                    <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => onUpdateProperties(element.id, {
                            [prop.name]: e.target.checked
                        })}
                        className="w-4 h-4"
                    />
                );

            case 'number':
                return (
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => onUpdateProperties(element.id, {
                            [prop.name]: Number(e.target.value)
                        })}
                        className="w-full px-2 py-1 border rounded"
                    />
                );

            default:
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onUpdateProperties(element.id, {
                            [prop.name]: e.target.value
                        })}
                        className="w-full px-2 py-1 border rounded"
                    />
                );
        }
    };

    return (
        <div className="w-64 border-l bg-white overflow-y-auto">
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-sm text-gray-700">
                        {componentDef.name} Properties
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <X size={16}/>
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Layout Properties */}
                    <div className="space-y-4">
                        <h3 className="font-medium text-sm text-gray-900">Position & Size</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">X</label>
                                <input
                                    type="number"
                                    value={element.properties.x}
                                    onChange={(e) => onUpdateProperties(element.id, {
                                        x: Number(e.target.value)
                                    })}
                                    className="w-full px-2 py-1 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Y</label>
                                <input
                                    type="number"
                                    value={element.properties.y}
                                    onChange={(e) => onUpdateProperties(element.id, {
                                        y: Number(e.target.value)
                                    })}
                                    className="w-full px-2 py-1 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Width</label>
                                <input
                                    type="number"
                                    value={element.properties.width}
                                    onChange={(e) => onUpdateProperties(element.id, {
                                        width: Number(e.target.value)
                                    })}
                                    className="w-full px-2 py-1 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Height</label>
                                <input
                                    type="number"
                                    value={element.properties.height}
                                    onChange={(e) => onUpdateProperties(element.id, {
                                        height: Number(e.target.value)
                                    })}
                                    className="w-full px-2 py-1 border rounded"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Component Properties by Category */}
                    {Object.entries(groupedProperties).map(([category, properties]) => (
                        <div key={category} className="space-y-4">
                            <h3 className="font-medium text-sm text-gray-900 capitalize">
                                {category}
                            </h3>
                            <div className="space-y-3">
                                {properties.map((prop) => (
                                    <div key={prop.name}>
                                        <label className="block text-xs text-gray-600 mb-1">
                                            {prop.label}
                                            {prop.required && <span className="text-red-500">*</span>}
                                        </label>
                                        {renderPropertyField(prop)}
                                        {prop.description && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {prop.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Content Editor */}
                    {componentDef.canContainContent && (
                        <div className="space-y-4">
                            <h3 className="font-medium text-sm text-gray-900">Content</h3>
                            <textarea
                                value={element.content
                                    .map(item => item.type === 'text' ? item.content : '')
                                    .join('\n')}
                                onChange={(e) => {
                                    const lines = e.target.value.split('\n');
                                    const newContent = lines.map(line => ({
                                        type: 'text' as const,
                                        content: line
                                    }));
                                    onUpdateProperties(element.id, {content: newContent});
                                }}
                                className="w-full px-2 py-1 border rounded h-24"
                                placeholder="Enter content..."
                            />
                            <p className="text-xs text-gray-500">
                                Separate multiple lines with Enter.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
