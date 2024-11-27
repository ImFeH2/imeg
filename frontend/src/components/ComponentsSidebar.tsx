import {Component} from '../types';
import {Search, Trash2} from 'lucide-react';
import {useEffect, useMemo, useRef, useState} from 'react';

interface ComponentsSidebarProps {
    components: Component[];
    onAddElement: (componentId: number, x: number, y: number) => void;
    onDeleteCustomComponent?: (componentId: number) => void;
}

export function ComponentsSidebar({
                                      components,
                                      onAddElement,
                                      onDeleteCustomComponent
                                  }: ComponentsSidebarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const categoriesRef = useRef<HTMLDivElement>(null);
    const dragStartX = useRef<number>(0);
    const scrollLeft = useRef<number>(0);

    const categories = useMemo(() => {
        const groups = components.reduce((acc, component) => {
            const category = component.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(component);
            return acc;
        }, {} as Record<string, Component[]>);

        return Object.entries(groups).map(([category, items]) => ({
            name: category,
            items: items.sort((a, b) => a.name.localeCompare(b.name))
        }));
    }, [components]);

    const filteredComponents = useMemo(() => {
        let filtered = components;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(component =>
                component.name.toLowerCase().includes(query) ||
                component.description?.toLowerCase().includes(query) ||
                component.tags?.some(tag => tag.toLowerCase().includes(query))
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(component =>
                component.category === selectedCategory.toLowerCase()
            );
        }

        return filtered;
    }, [components, searchQuery, selectedCategory]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !categoriesRef.current) return;

            const x = e.pageX;
            const walk = (x - dragStartX.current) * 2;
            if (categoriesRef.current) {
                categoriesRef.current.scrollLeft = scrollLeft.current - walk;
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.cursor = '';
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'grabbing';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
        };
    }, [isDragging]);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        dragStartX.current = e.pageX;
        scrollLeft.current = categoriesRef.current?.scrollLeft || 0;
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        if (categoriesRef.current) {
            categoriesRef.current.scrollLeft += e.deltaY;
        }
    };

    const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, componentId: number) => {
        e.dataTransfer.setData('componentId', componentId.toString());
        e.dataTransfer.effectAllowed = 'copy';

        // Create a custom drag image
        const dragImage = document.createElement('div');
        dragImage.className = 'bg-white border rounded-lg shadow-lg p-2 text-sm';
        dragImage.textContent = components.find(c => c.id === componentId)?.name || 'Component';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 0, 0);

        setTimeout(() => {
            document.body.removeChild(dragImage);
        }, 0);
    };

    return (
        <div className="w-72 border-r bg-white flex flex-col h-full">
            {/* Search */}
            <div className="p-4 border-b">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search components..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                </div>
            </div>

            {/* Categories */}
            <div
                ref={categoriesRef}
                className="flex p-2 border-b space-x-2 overflow-x-auto scrollbar-none"
                style={{
                    cursor: isDragging ? 'grabbing' : 'grab',
                    userSelect: 'none',
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch',
                }}
                onMouseDown={handleMouseDown}
                onWheel={handleWheel}
            >
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`flex-none px-3 py-1 rounded-md text-sm whitespace-nowrap
                        ${!selectedCategory
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    All
                </button>
                {categories.map((category) => (
                    <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`flex-none px-3 py-1 rounded-md text-sm whitespace-nowrap
                            ${selectedCategory === category.name
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Components Grid */}
            <div className="flex-1 overflow-y-auto scrollbar-none">
                <div className="grid grid-cols-2 gap-3 p-4">
                    {filteredComponents.map((component) => (
                        <div key={component.id} className="relative group">
                            <button
                                draggable
                                onDragStart={(e) => handleDragStart(e, component.id)}
                                onClick={() => onAddElement(component.id, 100, 100)}
                                className="w-full p-3 flex flex-col items-center justify-center space-y-2 bg-white border rounded-lg hover:border-blue-500 hover:shadow-sm transition-all duration-200 cursor-move"
                                title={component.description}
                            >
                                <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md text-lg">
                                    {component.icon}
                                </span>
                                <span className="text-xs text-gray-600 text-center">
                                    {component.name}
                                </span>
                            </button>

                            {/* Delete button for custom components */}
                            {component.category === 'custom' && onDeleteCustomComponent && (
                                <button
                                    onClick={() => onDeleteCustomComponent(component.id)}
                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                                    title="Delete Custom Component"
                                >
                                    <Trash2 size={12}/>
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {filteredComponents.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                        <span className="text-lg mb-2">No components found</span>
                        <span className="text-sm text-gray-400">
                            Try adjusting your search
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
