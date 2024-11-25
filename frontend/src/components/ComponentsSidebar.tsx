import {ComponentData} from '../types';
import {Search} from 'lucide-react';
import {useMemo, useRef, useState} from 'react';

interface ComponentsSidebarProps {
    components: ComponentData[];
    onAddElement: (type: string) => void;
}

interface Category {
    name: string;
    icon: string;
    items: ComponentData[];
}

export function ComponentsSidebar({components, onAddElement}: ComponentsSidebarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const categoriesRef = useRef<HTMLDivElement>(null);
    const componentsRef = useRef<HTMLDivElement>(null);

    const [isDraggingCategories, setIsDraggingCategories] = useState(false);
    const [categoryStartX, setCategoryStartX] = useState(0);
    const [categoryScrollLeft, setCategoryScrollLeft] = useState(0);

    const categories: Category[] = useMemo(() => [
        {
            name: 'Text',
            icon: 'T',
            items: components.filter(c => ['text', 'heading1', 'heading2', 'heading3', 'paragraph'].includes(c.id))
        },
        {
            name: 'Interactive',
            icon: '⬢',
            items: components.filter(c => ['button', 'link', 'input', 'textarea'].includes(c.id))
        },
        {
            name: 'Media',
            icon: '🖼',
            items: components.filter(c => ['image', 'video', 'audio'].includes(c.id))
        },
        {
            name: 'Layout',
            icon: '□',
            items: components.filter(c => ['div', 'section'].includes(c.id))
        },
        {
            name: 'Lists',
            icon: '•',
            items: components.filter(c => ['unorderedList', 'orderedList'].includes(c.id))
        },
        {
            name: 'Data',
            icon: '▦',
            items: components.filter(c => ['table'].includes(c.id))
        },
        {
            name: 'Form',
            icon: '⌨',
            items: components.filter(c => ['select', 'checkbox', 'radio'].includes(c.id))
        },
        {
            name: 'Structure',
            icon: '≡',
            items: components.filter(c => ['nav', 'footer', 'header'].includes(c.id))
        }
    ], [components]);

    const filteredComponents = useMemo(() => {
        const filtered = components.filter(component =>
            component.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (selectedCategory) {
            return filtered.filter(component =>
                categories.find(cat => cat.name === selectedCategory)?.items.includes(component)
            );
        }

        return filtered;
    }, [components, searchQuery, selectedCategory, categories]);

    const handleCategoryMouseDown = (e: React.MouseEvent) => {
        if (!categoriesRef.current) return;
        setIsDraggingCategories(true);
        setCategoryStartX(e.pageX);
        setCategoryScrollLeft(categoriesRef.current.scrollLeft);
    };

    const handleCategoryMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingCategories || !categoriesRef.current) return;
        e.preventDefault();
        const dx = e.pageX - categoryStartX;
        categoriesRef.current.scrollLeft = categoryScrollLeft - dx;
    };

    const handleCategoryMouseUp = () => {
        setIsDraggingCategories(false);
    };

    const handleCategoryWheel = (e: React.WheelEvent) => {
        if (!categoriesRef.current) return;
        e.preventDefault();
        categoriesRef.current.scrollLeft += e.deltaY;
    };

    return (
        <div className="w-72 border-r bg-white flex flex-col h-full">
            {/* Search Section */}
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

            {/* Categories with Horizontal Scrolling */}
            <div
                ref={categoriesRef}
                className="flex p-2 border-b select-none overflow-x-auto"
                onMouseDown={handleCategoryMouseDown}
                onMouseMove={handleCategoryMouseMove}
                onMouseUp={handleCategoryMouseUp}
                onMouseLeave={handleCategoryMouseUp}
                onWheel={handleCategoryWheel}
                style={{
                    cursor: isDraggingCategories ? 'grabbing' : 'grab',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                <div className="flex space-x-2 min-w-max">
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
            </div>

            {/* Components List with Wheel Scrolling Only */}
            <div
                ref={componentsRef}
                className="flex-1 overflow-y-auto p-4"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                <div className="grid grid-cols-2 gap-3">
                    {filteredComponents.map((component) => (
                        <button
                            key={component.id}
                            onClick={() => onAddElement(component.id)}
                            className="p-3 flex flex-col items-center justify-center space-y-2 bg-white border rounded-lg hover:border-blue-500 hover:shadow-sm transition-all duration-200"
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
                        <span className="text-sm text-gray-400">Try adjusting your search</span>
                    </div>
                )}
            </div>
        </div>
    );
}
