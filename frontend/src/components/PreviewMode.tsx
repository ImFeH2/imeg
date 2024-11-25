import {ElementRenderer} from './ElementRenderer';
import {Element, PageSettings} from '../types';
import {Pencil} from 'lucide-react';

interface PreviewModeProps {
    elements: Element[];
    pageSettings: PageSettings;
    onExitPreview: () => void;
}

const PreviewMode = ({elements, pageSettings, onExitPreview}: PreviewModeProps) => {
    const getContainerStyle = () => {
        if (pageSettings.responsive) {
            return {
                backgroundColor: pageSettings.bgColor,
                minHeight: '100vh'
            };
        }

        return {
            width: `${pageSettings.width}px`,
            height: `${pageSettings.height}px`,
            backgroundColor: pageSettings.bgColor,
            margin: '0 auto',
            position: 'relative' as const,
            overflow: 'hidden'
        };
    };

    return (
        <div className="fixed inset-0 bg-white z-50">
            {/* 预览模式退出按钮 */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={onExitPreview}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <Pencil size={16}/>
                    <span>Exit Preview</span>
                </button>
            </div>

            {/* 响应式布局容器 */}
            <div className={`w-full h-full overflow-auto ${
                pageSettings.responsive && pageSettings.maxWidth !== 'none'
                    ? pageSettings.maxWidth
                    : ''
            } mx-auto`}>
                <div className="relative" style={getContainerStyle()}>
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

            {/* 固定尺寸提示 */}
            {!pageSettings.responsive && (
                <div className="fixed bottom-4 right-4 bg-white px-3 py-2 rounded-md shadow-lg text-sm text-gray-600 flex items-center space-x-2">
                    <span className="font-medium">Dimensions:</span>
                    <span>{pageSettings.width}px × {pageSettings.height}px</span>
                </div>
            )}

            {/* 响应式提示 */}
            {pageSettings.responsive && (
                <div className="fixed bottom-4 right-4 bg-white px-3 py-2 rounded-md shadow-lg text-sm text-gray-600">
                    <span className="font-medium">Responsive Mode</span>
                </div>
            )}
        </div>
    );
};

export default PreviewMode;
