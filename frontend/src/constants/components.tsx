import {Component, ComponentElement, Property} from "../types";
import CryptoJS from 'crypto-js';

// Common property sets that are reused across components
const commonTextProperties: Property[] = [
    {
        name: 'color',
        label: 'Text Color',
        type: 'color',
        category: 'typography',
        value: '#000000'
    },
    {
        name: 'fontSize',
        label: 'Font Size',
        type: 'number',
        category: 'typography',
        value: 16
    },
    {
        name: 'textAlign',
        label: 'Text Alignment',
        type: 'select',
        category: 'typography',
        value: 'left',
        options: ['left', 'center', 'right', 'justify']
    },
    {
        name: 'fontWeight',
        label: 'Font Weight',
        type: 'select',
        category: 'typography',
        value: 'normal',
        options: ['normal', 'bold', 'lighter']
    }
];

const commonContainerProperties: Property[] = [
    {
        name: 'backgroundColor',
        label: 'Background Color',
        type: 'color',
        category: 'decoration',
        value: 'transparent'
    },
    {
        name: 'padding',
        label: 'Padding',
        type: 'string',
        category: 'layout',
        value: '8px'
    },
    {
        name: 'borderRadius',
        label: 'Corner Radius',
        type: 'number',
        category: 'decoration',
        value: 0
    },
    {
        name: 'borderColor',
        label: 'Border Color',
        type: 'color',
        category: 'decoration',
        value: '#e2e8f0'
    },
    {
        name: 'borderWidth',
        label: 'Border Width',
        type: 'number',
        category: 'decoration',
        value: 0
    }
];

// Component library storage
export let componentsLib: Component[] = [];

// Helper function to generate component hash
export function generateComponentHash(component: Component): number {
    const componentCopy = {...component};
    componentCopy.id = 0;
    const jsonString = JSON.stringify(componentCopy, (key, value) => {
        if (key === 'id') return 0;
        return value;
    }, 2);

    const hash = CryptoJS.SHA256(jsonString).toString();
    return parseInt(hash.substring(0, 8), 16);
}

// Function to add component to library
export function addComponent(component: Component) {
    const componentCopy = {...component};
    componentCopy.id = generateComponentHash(componentCopy);
    componentsLib.push(componentCopy);
    return componentCopy;
}

// Function to create a ComponentElement instance
export function createElement(
    prototype: Component,
    position: { x: number; y: number } = {x: 0, y: 0},
    size: { width: number; height: number } = {width: 200, height: 100}
): ComponentElement {
    const elementId = prototype.id + Math.floor(Math.random() * 1000000);
    const hashInput = `${elementId}-${Date.now()}`;
    const finalId = parseInt(CryptoJS.SHA256(hashInput).toString().substring(0, 8), 16);

    const properties = [
        {
            name: 'x',
            label: 'X Position',
            type: 'number' as const,
            category: 'layout' as const,
            value: position.x
        },
        {
            name: 'y',
            label: 'Y Position',
            type: 'number' as const,
            category: 'layout' as const,
            value: position.y
        },
        {
            name: 'width',
            label: 'Width',
            type: 'number' as const,
            category: 'layout' as const,
            value: size.width
        },
        {
            name: 'height',
            label: 'Height',
            type: 'number' as const,
            category: 'layout' as const,
            value: size.height
        },
        ...prototype.properties.map(prop => ({
            ...prop,
            value: prop.value
        }))
    ];

    return {
        id: finalId,
        properties: properties,
        content: [...prototype.defaultContent],
        type: prototype,
    };
}

// Default components definitions
const defaultComponents: Partial<Component>[] = [
    // Text Elements
    {
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
                value: '0 0 16px 0'
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
                value: '0 0 12px 0'
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
                value: 1.5
            },
            {
                name: 'margin',
                label: 'Margin',
                type: 'string',
                category: 'layout',
                value: '0 0 16px 0'
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
                value: 'Click me'
            },
            {
                name: 'backgroundColor',
                label: 'Background',
                type: 'color',
                category: 'decoration',
                value: '#3b82f6'
            },
            {
                name: 'color',
                label: 'Text Color',
                type: 'color',
                category: 'decoration',
                value: '#ffffff'
            },
            {
                name: 'borderRadius',
                label: 'Corner Radius',
                type: 'number',
                category: 'decoration',
                value: 4
            },
            {
                name: 'padding',
                label: 'Padding',
                type: 'string',
                category: 'layout',
                value: '8px 16px'
            },
            {
                name: 'disabled',
                label: 'Disabled',
                type: 'boolean',
                category: 'advanced',
                value: false
            }
        ],
        canContainContent: false,
        defaultContent: [],
        tags: ['button', 'interactive', 'click']
    },
    {
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
                value: 'Click here'
            },
            {
                name: 'href',
                label: 'URL',
                type: 'string',
                category: 'basic',
                value: '#'
            },
            {
                name: 'color',
                label: 'Text Color',
                type: 'color',
                category: 'typography',
                value: '#3b82f6'
            },
            {
                name: 'textDecoration',
                label: 'Text Decoration',
                type: 'select',
                category: 'typography',
                value: 'underline',
                options: ['none', 'underline', 'line-through']
            }
        ],
        canContainContent: false,
        defaultContent: [],
        tags: ['link', 'url', 'navigation']
    },

    // Media Elements
    {
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
                value: '/api/placeholder/300/200'
            },
            {
                name: 'alt',
                label: 'Alt Text',
                type: 'string',
                category: 'basic',
                value: 'Image description'
            },
            {
                name: 'objectFit',
                label: 'Object Fit',
                type: 'select',
                category: 'layout',
                value: 'cover',
                options: ['contain', 'cover', 'fill', 'none', 'scale-down']
            }
        ],
        canContainContent: false,
        defaultContent: [],
        tags: ['image', 'media', 'picture']
    },

    // Container Elements
    {
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
                value: 'block',
                options: ['block', 'flex', 'grid', 'inline-block']
            },
            {
                name: 'flexDirection',
                label: 'Flex Direction',
                type: 'select',
                category: 'layout',
                value: 'row',
                options: ['row', 'column']
            }
        ],
        canContainContent: true,
        defaultContent: [],
        tags: ['container', 'div', 'box']
    },

    // Form Elements
    {
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
                value: 'Enter text...'
            },
            {
                name: 'type',
                label: 'Input Type',
                type: 'select',
                category: 'basic',
                value: 'text',
                options: ['text', 'password', 'email', 'number', 'tel']
            },
            ...commonContainerProperties
        ],
        canContainContent: false,
        defaultContent: [],
        tags: ['input', 'form', 'text']
    },
    {
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
                value: 'Enter text...'
            },
            {
                name: 'rows',
                label: 'Rows',
                type: 'number',
                category: 'layout',
                value: 4
            },
            ...commonContainerProperties
        ],
        canContainContent: false,
        defaultContent: [],
        tags: ['textarea', 'form', 'input']
    }
];

// Initialize the component library
export function initializeComponentLibrary() {
    componentsLib = [];
    defaultComponents.forEach(component => {
        addComponent(component as Component);
    });
}

// Initialize on module load
initializeComponentLibrary();
