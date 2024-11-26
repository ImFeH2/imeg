import {ComponentData} from '../types';
import {Search} from 'lucide-react';
import {useEffect, useMemo, useRef, useState} from 'react';

interface ComponentsSidebarProps {
    components: ComponentData[];
    onAddElement: (componentId: string) => void;
}

export function ComponentsSidebar({
                                      components,
                                      onAddElement
                                  }: ComponentsSidebarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const categoriesRef = useRef<HTMLDivElement>(null);
    const dragStartX = useRef<number>(0);
    const scrollLeft = useRef<number>(0);

    // Group components by category
    const categories = useMemo(() => {
        const groups = components.reduce((acc, component) => {
            if (!acc[component.category]) {
                acc[component.category] = [];
            }
            acc[component.category].push(component);
            return acc;
        }, {} as Record<string, ComponentData[]>);

        return Object.entries(groups).map(([category, items]) => ({
            name: category.charAt(0).toUpperCase() + category.slice(1),
            items: items.sort((a, b) => a.name.localeCompare(b.name))
        }));
    }, [components]);

    // Filter components
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

    // Handle mouse events for dragging
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

    // Handle drag start
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        dragStartX.current = e.pageX;
        scrollLeft.current = categoriesRef.current?.scrollLeft || 0;
    };

    // Handle wheel scroll
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        if (categoriesRef.current) {
            categoriesRef.current.scrollLeft += e.deltaY;
        }
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
                    msOverflowStyle: 'none',  /* Hide scrollbar IE and Edge */
                    scrollbarWidth: 'none',  /* Hide scrollbar Firefox */
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
                        <button
                            key={component.id}
                            onClick={() => onAddElement(component.id)}
                            className="p-3 flex flex-col items-center justify-center space-y-2 bg-white border rounded-lg hover:border-blue-500 hover:shadow-sm transition-all duration-200"
                            title={component.description}
                        >
                            <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md text-lg">
                                {component.icon}
                            </span>
                            <span className="text-xs text-gray-600 text-center">
                                {component.name}
                            </span>
                        </button>
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
