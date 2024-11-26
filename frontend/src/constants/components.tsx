import {ComponentData, Property} from "../types";

// 常用的属性验证器
const validators = {
    positiveNumber: {
        validate: (value: number) => value > 0,
        message: 'Value must be greater than 0'
    },
    nonNegativeNumber: {
        validate: (value: number) => value >= 0,
        message: 'Value cannot be negative'
    },
    nonEmptyString: {
        validate: (value: string) => value.trim().length > 0,
        message: 'Value cannot be empty'
    },
    hexColor: {
        validate: (value: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value) || value === 'transparent',
        message: 'Must be a valid hex color code or transparent'
    },
    url: {
        validate: (value: string) => /^(https?:\/\/|\/|\.\/|\.\.\/)/.test(value),
        message: 'Must be a valid URL or path'
    }
};

// 常用的文字样式属性
const commonTextProperties: Property[] = [
    {
        name: 'color',
        label: 'Text Color',
        type: 'color',
        category: 'typography',
        defaultValue: '#000000',
        validation: validators.hexColor
    },
    {
        name: 'fontSize',
        label: 'Font Size',
        type: 'number',
        category: 'typography',
        defaultValue: 16,
        validation: validators.positiveNumber
    },
    {
        name: 'textAlign',
        label: 'Text Alignment',
        type: 'select',
        category: 'typography',
        defaultValue: 'left',
        options: ['left', 'center', 'right', 'justify']
    },
    {
        name: 'fontWeight',
        label: 'Font Weight',
        type: 'select',
        category: 'typography',
        defaultValue: 'normal',
        options: ['normal', 'bold', 'lighter']
    }
];

// 常用的容器样式属性
const commonContainerProperties: Property[] = [
    {
        name: 'backgroundColor',
        label: 'Background Color',
        type: 'color',
        category: 'decoration',
        defaultValue: 'transparent',
        validation: validators.hexColor
    },
    {
        name: 'padding',
        label: 'Padding',
        type: 'string',
        category: 'layout',
        defaultValue: '8px'
    },
    {
        name: 'borderRadius',
        label: 'Corner Radius',
        type: 'number',
        category: 'decoration',
        defaultValue: 0,
        validation: validators.nonNegativeNumber
    },
    {
        name: 'borderColor',
        label: 'Border Color',
        type: 'color',
        category: 'decoration',
        defaultValue: '#e2e8f0',
        validation: validators.hexColor
    },
    {
        name: 'borderWidth',
        label: 'Border Width',
        type: 'number',
        category: 'decoration',
        defaultValue: 0,
        validation: validators.nonNegativeNumber
    }
];

export const componentsData: ComponentData[] = [
    // Text Elements
    {
        id: 'text',
        name: 'Text Block',
        icon: 'T',
        category: 'text',
        description: 'Basic text block for general content',
        properties: [
            ...commonTextProperties,
            ...commonContainerProperties
        ],
        canContainContent: true,
        defaultContent: [
            {
                type: 'text',
                content: 'Edit this text'
            }
        ],
        tags: ['text', 'content', 'basic']
    },
    {
        id: 'heading1',
        name: 'Heading 1',
        icon: 'H1',
        category: 'text',
        description: 'Large heading for main sections',
        properties: [
            ...commonTextProperties,
            {
                name: 'margin',
                label: 'Margin',
                type: 'string',
                category: 'layout',
                defaultValue: '0 0 16px 0'
            }
        ],
        canContainContent: true,
        defaultContent: [
            {
                type: 'text',
                content: 'Heading 1'
            }
        ],
        tags: ['heading', 'title', 'h1']
    },
    {
        id: 'heading2',
        name: 'Heading 2',
        icon: 'H2',
        category: 'text',
        description: 'Medium heading for subsections',
        properties: [
            ...commonTextProperties,
            {
                name: 'margin',
                label: 'Margin',
                type: 'string',
                category: 'layout',
                defaultValue: '0 0 12px 0'
            }
        ],
        canContainContent: true,
        defaultContent: [
            {
                type: 'text',
                content: 'Heading 2'
            }
        ],
        tags: ['heading', 'subtitle', 'h2']
    },
    {
        id: 'paragraph',
        name: 'Paragraph',
        icon: '¶',
        category: 'text',
        description: 'Paragraph text with line spacing',
        properties: [
            ...commonTextProperties,
            {
                name: 'lineHeight',
                label: 'Line Height',
                type: 'number',
                category: 'typography',
                defaultValue: 1.5,
                validation: validators.positiveNumber
            },
            {
                name: 'margin',
                label: 'Margin',
                type: 'string',
                category: 'layout',
                defaultValue: '0 0 16px 0'
            }
        ],
        canContainContent: true,
        defaultContent: [
            {
                type: 'text',
                content: 'Enter your paragraph text here'
            }
        ],
        tags: ['text', 'paragraph', 'content']
    },

    // Interactive Elements
    {
        id: 'button',
        name: 'Button',
        icon: '⬢',
        category: 'input',
        description: 'Clickable button element',
        properties: [
            {
                name: 'text',
                label: 'Button Text',
                type: 'string',
                category: 'basic',
                defaultValue: 'Click me',
                validation: validators.nonEmptyString
            },
            {
                name: 'backgroundColor',
                label: 'Background',
                type: 'color',
                category: 'decoration',
                defaultValue: '#3b82f6',
                validation: validators.hexColor
            },
            {
                name: 'color',
                label: 'Text Color',
                type: 'color',
                category: 'decoration',
                defaultValue: '#ffffff',
                validation: validators.hexColor
            },
            {
                name: 'borderRadius',
                label: 'Corner Radius',
                type: 'number',
                category: 'decoration',
                defaultValue: 4,
                validation: validators.nonNegativeNumber
            },
            {
                name: 'padding',
                label: 'Padding',
                type: 'string',
                category: 'layout',
                defaultValue: '8px 16px'
            },
            {
                name: 'disabled',
                label: 'Disabled',
                type: 'boolean',
                category: 'advanced',
                defaultValue: false
            }
        ],
        canContainContent: false,
        defaultContent: [],
        tags: ['button', 'interactive', 'click']
    },
    {
        id: 'link',
        name: 'Link',
        icon: '🔗',
        category: 'input',
        description: 'Hyperlink element',
        properties: [
            {
                name: 'text',
                label: 'Link Text',
                type: 'string',
                category: 'basic',
                defaultValue: 'Click here',
                validation: validators.nonEmptyString
            },
            {
                name: 'href',
                label: 'URL',
                type: 'string',
                category: 'basic',
                defaultValue: '#',
                validation: validators.url
            },
            {
                name: 'color',
                label: 'Text Color',
                type: 'color',
                category: 'typography',
                defaultValue: '#3b82f6',
                validation: validators.hexColor
            },
            {
                name: 'textDecoration',
                label: 'Text Decoration',
                type: 'select',
                category: 'typography',
                defaultValue: 'underline',
                options: ['none', 'underline', 'line-through']
            }
        ],
        canContainContent: false,
        defaultContent: [],
        tags: ['link', 'url', 'navigation']
    },

    // Media Elements
    {
        id: 'image',
        name: 'Image',
        icon: '🖼',
        category: 'media',
        description: 'Image display element',
        properties: [
            {
                name: 'src',
                label: 'Image Source',
                type: 'string',
                category: 'basic',
                defaultValue: '/api/placeholder/300/200',
                validation: validators.url
            },
            {
                name: 'alt',
                label: 'Alt Text',
                type: 'string',
                category: 'basic',
                defaultValue: 'Image description'
            },
            {
                name: 'objectFit',
                label: 'Object Fit',
                type: 'select',
                category: 'layout',
                defaultValue: 'cover',
                options: ['contain', 'cover', 'fill', 'none', 'scale-down']
            }
        ],
        canContainContent: false,
        defaultContent: [],
        tags: ['image', 'media', 'picture']
    },

    // Container Elements
    {
        id: 'div',
        name: 'Container',
        icon: '□',
        category: 'layout',
        description: 'Generic container element',
        properties: [
            ...commonContainerProperties,
            {
                name: 'display',
                label: 'Display',
                type: 'select',
                category: 'layout',
                defaultValue: 'block',
                options: ['block', 'flex', 'grid', 'inline-block']
            },
            {
                name: 'flexDirection',
                label: 'Flex Direction',
                type: 'select',
                category: 'layout',
                defaultValue: 'row',
                options: ['row', 'column']
            }
        ],
        canContainContent: true,
        defaultContent: [],
        tags: ['container', 'div', 'box']
    },

    // Form Elements
    {
        id: 'input',
        name: 'Input Field',
        icon: '⌨',
        category: 'input',
        description: 'Text input field',
        properties: [
            {
                name: 'placeholder',
                label: 'Placeholder',
                type: 'string',
                category: 'basic',
                defaultValue: 'Enter text...'
            },
            {
                name: 'type',
                label: 'Input Type',
                type: 'select',
                category: 'basic',
                defaultValue: 'text',
                options: ['text', 'password', 'email', 'number', 'tel']
            },
            ...commonContainerProperties
        ],
        canContainContent: false,
        defaultContent: [],
        tags: ['input', 'form', 'text']
    },
    {
        id: 'textarea',
        name: 'Text Area',
        icon: '📝',
        category: 'input',
        description: 'Multiline text input',
        properties: [
            {
                name: 'placeholder',
                label: 'Placeholder',
                type: 'string',
                category: 'basic',
                defaultValue: 'Enter text...'
            },
            {
                name: 'rows',
                label: 'Rows',
                type: 'number',
                category: 'layout',
                defaultValue: 4,
                validation: validators.positiveNumber
            },
            ...commonContainerProperties
        ],
        canContainContent: false,
        defaultContent: [],
        tags: ['textarea', 'form', 'input']
    }
];

// Helper function to get component by id
export const getComponentById = (id: string): ComponentData | undefined => {
    return componentsData.find(component => component.id === id);
};

// Helper function to create a new element instance
export const createElementInstance = (componentId: string, position = {x: 0, y: 0}) => {
    const component = componentsData.find(c => c.id === componentId);
    if (!component) return null;

    return {
        id: String(Date.now()), // 修改为字符串类型
        type: componentId,
        properties: {
            x: position.x,
            y: position.y,
            width: 200,
            height: 100,
            ...Object.fromEntries(
                component.properties.map(prop => [prop.name, prop.defaultValue])
            )
        },
        content: [...component.defaultContent]
    };
};
