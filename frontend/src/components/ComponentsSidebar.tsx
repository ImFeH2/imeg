import {ComponentData} from '../types';

interface ComponentsSidebarProps {
    components: ComponentData[];
    onAddElement: (type: string) => void;
}

export function ComponentsSidebar({components, onAddElement}: ComponentsSidebarProps) {
    return (
        <div className="w-64 border-r bg-white">
            <div className="p-4">
                <h2 className="font-semibold text-sm text-gray-700 mb-4">Components</h2>
                <div className="space-y-2">
                    {components.map(component => (
                        <button
                            key={component.id}
                            onClick={() => onAddElement(component.id)}
                            className="w-full p-3 flex items-center space-x-3 rounded hover:bg-gray-50 border"
                        >
                            <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded">
                                {component.icon}
                            </span>
                            <span className="text-sm">{component.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
