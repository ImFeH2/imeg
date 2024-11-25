import {Trash2} from 'lucide-react';
import {Element} from '../types';

interface ElementRendererProps {
    element: Element;
    isSelected: boolean;
    isPreview: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onMouseDown: (e: React.MouseEvent, corner: string) => void;
    onDragStart: (e: React.MouseEvent) => void;
}

interface TextProps {
    text: string;
    fontSize: number;
    color: string;
    backgroundColor: string;
    fontWeight?: string;
}

interface HeadingProps {
    text: string;
    fontSize: number;
    color: string;
    fontWeight: string;
}

interface ParagraphProps {
    text: string;
    fontSize: number;
    lineHeight: number;
    color: string;
}

interface ButtonProps {
    text: string;
    bgColor: string;
    textColor: string;
    width: number;
    height: number;
    borderRadius: number;
    fontSize: number;
}

interface LinkProps {
    text: string;
    href: string;
    color: string;
    textDecoration: string;
    fontSize: number;
}

interface ImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    objectFit: string;
}

interface VideoProps {
    src: string;
    controls: boolean;
    width: number;
    height: number;
    autoplay: boolean;
    loop: boolean;
}

interface AudioProps {
    src: string;
    controls: boolean;
    width: number;
    height: number;
    autoplay: boolean;
    loop: boolean;
}

interface ContainerProps {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    padding: number;
}

interface SectionProps {
    backgroundColor: string;
    padding: number;
    marginTop: number;
    marginBottom: number;
}

interface ListProps {
    items: string[];
    listStyle: string;
    spacing: number;
}

interface TableProps {
    headers: string[];
    rows: string[][];
    borderColor: string;
    headerBgColor: string;
}

interface SelectProps {
    options: string[];
    width: number;
    height: number;
    borderColor: string;
    borderRadius: number;
}

interface CheckboxProps {
    label: string;
    checked: boolean;
    size: number;
}

interface RadioProps {
    label: string;
    checked: boolean;
    size: number;
}

interface NavProps {
    items: string[];
    backgroundColor: string;
    padding: number;
    spacing: number;
}

interface FooterProps {
    text: string;
    backgroundColor: string;
    padding: number;
    textAlign: string;
}

interface HeaderProps {
    title: string;
    subtitle: string;
    backgroundColor: string;
    padding: number;
    textAlign: string;
}

interface InputProps {
    placeholder: string;
    type: string;
    width: number;
    height: number;
    borderColor: string;
    borderRadius: number;
}

interface TextareaProps {
    placeholder: string;
    rows: number;
    width: number;
    height: number;
    borderColor: string;
    borderRadius: number;
}

export function ElementRenderer({
                                    element,
                                    isSelected,
                                    isPreview,
                                    onSelect,
                                    onDelete,
                                    onMouseDown,
                                    onDragStart
                                }: ElementRendererProps) {
    const style: React.CSSProperties = {
        position: 'absolute',
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
    };

    const renderContent = () => {
        switch (element.type) {
            case 'text': {
                const props = element.props as TextProps;
                return (
                    <div
                        style={{
                            fontSize: `${props.fontSize}px`,
                            color: props.color,
                            backgroundColor: props.backgroundColor,
                            width: '100%',
                            height: '100%',
                            padding: '8px',
                            fontWeight: props.fontWeight,
                            pointerEvents: isPreview ? 'auto' : 'none',
                        }}
                    >
                        {props.text}
                    </div>
                );
            }

            case 'heading1':
            case 'heading2':
            case 'heading3': {
                const props = element.props as HeadingProps;
                const HeadingTag = element.type === 'heading1' ? 'h1' : element.type === 'heading2' ? 'h2' : 'h3';
                return (
                    <HeadingTag
                        style={{
                            fontSize: `${props.fontSize}px`,
                            color: props.color,
                            fontWeight: props.fontWeight,
                            margin: 0,
                            padding: '8px',
                            pointerEvents: isPreview ? 'auto' : 'none',
                        }}
                    >
                        {props.text}
                    </HeadingTag>
                );
            }

            case 'paragraph': {
                const props = element.props as ParagraphProps;
                return (
                    <p
                        style={{
                            fontSize: `${props.fontSize}px`,
                            lineHeight: props.lineHeight,
                            color: props.color,
                            margin: 0,
                            padding: '8px',
                            pointerEvents: isPreview ? 'auto' : 'none',
                        }}
                    >
                        {props.text}
                    </p>
                );
            }

            case 'button': {
                const props = element.props as ButtonProps;
                return (
                    <button
                        style={{
                            backgroundColor: props.bgColor,
                            color: props.textColor,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            borderRadius: `${props.borderRadius}px`,
                            fontSize: `${props.fontSize}px`,
                            cursor: isPreview ? 'pointer' : 'move',
                            pointerEvents: isPreview ? 'auto' : 'none',
                        }}
                    >
                        {props.text}
                    </button>
                );
            }

            case 'link': {
                const props = element.props as LinkProps;
                return (
                    <a
                        href={isPreview ? props.href : '#'}
                        style={{
                            color: props.color,
                            textDecoration: props.textDecoration,
                            fontSize: `${props.fontSize}px`,
                            display: 'block',
                            padding: '8px',
                            cursor: isPreview ? 'pointer' : 'move',
                            pointerEvents: isPreview ? 'auto' : 'none',
                        }}
                    >
                        {props.text}
                    </a>
                );
            }

            case 'image': {
                const props = element.props as ImageProps;
                return (
                    <img
                        src={props.src}
                        alt={props.alt}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: props.objectFit as 'cover' | 'contain',
                            pointerEvents: isPreview ? 'auto' : 'none',
                        }}
                        draggable={false}
                    />
                );
            }

            case 'video': {
                const props = element.props as VideoProps;
                return (
                    <video
                        src={props.src}
                        controls={props.controls}
                        autoPlay={props.autoplay}
                        loop={props.loop}
                        style={{
                            width: '100%',
                            height: '100%',
                            pointerEvents: isPreview ? 'auto' : 'none',
                        }}
                    />
                );
            }

            case 'audio': {
                const props = element.props as AudioProps;
                return (
                    <audio
                        src={props.src}
                        controls={props.controls}
                        autoPlay={props.autoplay}
                        loop={props.loop}
                        style={{
                            width: '100%',
                            pointerEvents: isPreview ? 'auto' : 'none',
                        }}
                    />
                );
            }

            case 'div': {
                const props = element.props as ContainerProps;
                return (
                    <div
                        style={{
                            backgroundColor: props.backgroundColor,
                            border: `${props.borderWidth}px solid ${props.borderColor}`,
                            borderRadius: `${props.borderRadius}px`,
                            padding: `${props.padding}px`,
                            width: '100%',
                            height: '100%',
                            pointerEvents: isPreview ? 'auto' : 'none',
                        }}
                    />
                );
            }

            case 'section': {
                const props = element.props as SectionProps;
                return (
                    <section
                        style={{
                            backgroundColor: props.backgroundColor,
                            padding: `${props.padding}px`,
                            marginTop: `${props.marginTop}px`,
                            marginBottom: `${props.marginBottom}px`,
                            width: '100%',
                            height: '100%',
                            pointerEvents: isPreview ? 'auto' : 'none',
                        }}
                    />
                );
            }

            case 'unorderedList':
            case 'orderedList': {
                const props = element.props as ListProps;
                const ListTag = element.type === 'unorderedList' ? 'ul' : 'ol';
                return (
                    <ListTag
                        style={{
                            listStyleType: props.listStyle,
                            padding: '8px 24px',
                            margin: 0,
                            height: '100%',
                            overflowY: 'auto',
                            pointerEvents: isPreview ? 'auto' : 'none',
                        }}
                    >
                        {props.items.map((item, index) => (
                            <li key={index} style={{marginBottom: `${props.spacing}px`}}>
                                {item}
                            </li>
                        ))}
                    </ListTag>
                );
            }

            case 'table': {
                const props = element.props as TableProps;
                return (
                    <div style={{width: '100%', height: '100%', overflow: 'auto'}}>
                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                pointerEvents: isPreview ? 'auto' : 'none',
                            }}
                        >
                            <thead>
                            <tr>
                                {props.headers.map((header, index) => (
                                    <th
                                        key={index}
                                        style={{
                                            padding: '8px',
                                            backgroundColor: props.headerBgColor,
                                            border: `1px solid ${props.borderColor}`,
                                        }}
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {props.rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <td
                                            key={cellIndex}
                                            style={{
                                                padding: '8px',
                                                border: `1px solid ${props.borderColor}`,
                                            }}
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                );
            }

            case 'select': {
                const props = element.props as SelectProps;
                return (
                    <select
                        style={{
                            width: '100%',
                            height: '100%',
                            border: `1px solid ${props.borderColor}`,
                            borderRadius: `${props.borderRadius}px`,
                            padding: '0 8px',
                            pointerEvents: isPreview ? 'auto' : 'none',
                        }}
                    >
                        {props.options.map((option, index) => (
                            <option key={index}>{option}</option>
                        ))}
                    </select>
                );
            }

            case 'checkbox': {
                const props = element.props as CheckboxProps;
                return (
                    <label
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px',
                            pointerEvents: isPreview ? 'auto' : 'none',
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={props.checked}
                            style={{
                                width: `${props.size}px`,
                                height: `${props.size}px`,
                                marginRight: '8px',
                            }}
                            readOnly
                        />
                        {props.label}
                    </label>
                );
            }

            case 'radio': {
                const props = element.props as RadioProps;
                return (
                    <label
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px',
                            pointerEvents: isPreview ? 'auto' : 'none',
                        }}
                    >
                        <input
                            type="radio"
                            checked={props.checked}
                            style={{
                                width: `${props.size}px`,
                                height: `${props.size}px`,
                                marginRight: '8px',
                            }}
                            readOnly
                        />
                        {props.label}
                    </label>
                );
            }

            case 'nav': {
                const props = element.props as NavProps;
                return (
                    <nav
                        style={{
                            backgroundColor: props.backgroundColor,
                            padding: `${props.padding}px`,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            gap: `${props.spacing}px`,
                            alignItems: 'center',
                            pointerEvents: isPreview ? 'auto' : 'none',
                        }}
                    >
                        {props.items.map((item, index) => (
                            <a
                                key={index}
                                href="#"
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                }}
                            >
                                {item}
                            </a>
                        ))}
                    </nav>
                );
            }

            case 'footer': {
                const props = element.props as FooterProps;
                return (
                    <footer
                        style={{
                            backgroundColor: props.backgroundColor,
                            padding: `${props.padding}px`,
                            width: '100%',
                            height: '100%',
                            textAlign: props.textAlign as 'center' | 'left' | 'right',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: isPreview ? 'auto' : 'none',
                        }}
                    >
                        {props.text}
                    </footer>
                );
            }

            case 'header': {
                const props = element.props as HeaderProps;
                return (
                    <header
                        style={{
                            backgroundColor: props.backgroundColor,
                            padding: `${props.padding}px`,
                            width: '100%',
                            height: '100%',
                            textAlign: props.textAlign as 'center' | 'left' | 'right',
                            pointerEvents: isPreview ? 'auto' : 'none',
                        }}
                    >
                        <h1 style={{margin: '0 0 8px 0'}}>{props.title}</h1>
                        <p style={{margin: 0}}>{props.subtitle}</p>
                    </header>
                );
            }

            case 'input': {
                const props = element.props as InputProps;
                return (
                    <input
                        type={props.type}
                        placeholder={props.placeholder}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: `1px solid ${props.borderColor}`,
                            borderRadius: `${props.borderRadius}px`,
                            padding: '0 8px',
                            pointerEvents: isPreview ? 'auto' : 'none',
                        }}
                        readOnly={!isPreview}
                    />
                );
            }

            case 'textarea': {
                const props = element.props as TextareaProps;
                return (
                    <textarea
                        placeholder={props.placeholder}
                        rows={props.rows}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: `1px solid ${props.borderColor}`,
                            borderRadius: `${props.borderRadius}px`,
                            padding: '8px',
                            resize: 'none',
                            pointerEvents: isPreview ? 'auto' : 'none',
                        }}
                        readOnly={!isPreview}
                    />
                );
            }

            default:
                return <div>Unknown Component</div>;
        }
    };

    return (
        <div
            style={style}
            className={`absolute ${isPreview ? '' : 'border border-gray-200'} ${
                isSelected && !isPreview ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={(e) => {
                e.preventDefault();
                onSelect();
            }}
            onMouseDown={(e) => {
                if (!isPreview) {
                    e.preventDefault();
                }
            }}
        >
            {!isPreview && (
                <>
                    <div
                        className="absolute -top-6 left-0 right-0 flex items-center justify-between bg-blue-500 text-white text-xs px-2 py-1 rounded-t"
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                    >
                        <span>{element.type}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onDelete();
                            }}
                            className="hover:bg-blue-600 p-1 rounded"
                        >
                            <Trash2 size={12}/>
                        </button>
                    </div>
                    <div
                        className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 cursor-nw-resize"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onMouseDown(e, 'top-left');
                        }}
                    />
                    <div
                        className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 cursor-ne-resize"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onMouseDown(e, 'top-right');
                        }}
                    />
                    <div
                        className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 cursor-sw-resize"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onMouseDown(e, 'bottom-left');
                        }}
                    />
                    <div
                        className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 cursor-se-resize"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onMouseDown(e, 'bottom-right');
                        }}
                    />
                </>
            )}
            <div
                className={`w-full h-full ${!isPreview ? 'cursor-move' : ''}`}
                onMouseDown={(e) => {
                    if (!isPreview) {
                        e.preventDefault();
                        onDragStart(e);
                    }
                }}
            >
                {renderContent()}
            </div>
        </div>
    );
}
