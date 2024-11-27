import {X} from 'lucide-react';
import {ComponentElement, Property} from '../types';
import {useMemo} from 'react';

interface PropertiesPanelProps {
    element: ComponentElement;
    onClose: () => void;
    onUpdateProperties: (id: number, updates: Array<{ name: string, value: any }>) => void;
}

export function PropertiesPanel({
                                    element,
                                    onClose,
                                    onUpdateProperties
                                }: PropertiesPanelProps) {
    // Group properties by category
    const groupedProperties = useMemo(() => {
        return element.properties.reduce((acc: Record<string, Property[]>, prop) => {
            if (!acc[prop.category]) {
                acc[prop.category] = [];
            }
            acc[prop.category].push(prop);
            return acc;
        }, {});
    }, [element.properties]);

    const handlePropertyUpdate = (propertyName: string, newValue: any) => {
        onUpdateProperties(element.id, [{name: propertyName, value: newValue}]);
    };

    const renderPropertyField = (prop: Property) => {
        switch (prop.type) {
            case 'color':
                return (
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={prop.value}
                            onChange={(e) => handlePropertyUpdate(prop.name, e.target.value)}
                            className="w-8 h-8"
                        />
                        <input
                            type="text"
                            value={prop.value}
                            onChange={(e) => handlePropertyUpdate(prop.name, e.target.value)}
                            className="flex-1 px-2 py-1 border rounded"
                        />
                    </div>
                );

            case 'select':
                return (
                    <select
                        value={prop.value}
                        onChange={(e) => handlePropertyUpdate(prop.name, e.target.value)}
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
                        checked={prop.value}
                        onChange={(e) => handlePropertyUpdate(prop.name, e.target.checked)}
                        className="w-4 h-4"
                    />
                );

            case 'number':
                return (
                    <input
                        type="number"
                        value={prop.value}
                        onChange={(e) => handlePropertyUpdate(prop.name, Number(e.target.value))}
                        className="w-full px-2 py-1 border rounded"
                    />
                );

            default:
                return (
                    <input
                        type="text"
                        value={prop.value}
                        onChange={(e) => handlePropertyUpdate(prop.name, e.target.value)}
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
                        {element.type.name} Properties
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <X size={16}/>
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Properties by Category */}
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
                    {element.type.canContainContent && (
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
                                    onUpdateProperties(element.id, [{name: 'content', value: newContent}]);
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
