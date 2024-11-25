import {ComponentData} from "../types.tsx";

export const componentsData: ComponentData[] = [
    // Text Elements
    {
        id: 'text',
        name: 'Text Block',
        icon: 'T',
        defaultProps: {
            text: 'Edit this text',
            fontSize: 16,
            color: '#000000',
            backgroundColor: 'transparent'
        }
    },
    {
        id: 'heading1',
        name: 'Heading 1',
        icon: 'H1',
        defaultProps: {
            text: 'Heading 1',
            fontSize: 32,
            color: '#000000',
            fontWeight: 'bold'
        }
    },
    {
        id: 'heading2',
        name: 'Heading 2',
        icon: 'H2',
        defaultProps: {
            text: 'Heading 2',
            fontSize: 24,
            color: '#000000',
            fontWeight: 'bold'
        }
    },
    {
        id: 'heading3',
        name: 'Heading 3',
        icon: 'H3',
        defaultProps: {
            text: 'Heading 3',
            fontSize: 20,
            color: '#000000',
            fontWeight: 'bold'
        }
    },
    {
        id: 'paragraph',
        name: 'Paragraph',
        icon: '¶',
        defaultProps: {
            text: 'Enter your paragraph text here',
            fontSize: 16,
            lineHeight: 1.5,
            color: '#000000'
        }
    },

    // Interactive Elements
    {
        id: 'button',
        name: 'Button',
        icon: '⬢',
        defaultProps: {
            text: 'Click me',
            bgColor: '#3b82f6',
            textColor: '#ffffff',
            width: 120,
            height: 40,
            borderRadius: 4,
            fontSize: 16
        }
    },
    {
        id: 'link',
        name: 'Link',
        icon: '🔗',
        defaultProps: {
            text: 'Click here',
            href: '#',
            color: '#3b82f6',
            textDecoration: 'underline',
            fontSize: 16
        }
    },
    {
        id: 'input',
        name: 'Input Field',
        icon: '⌨',
        defaultProps: {
            placeholder: 'Enter text...',
            type: 'text',
            width: 200,
            height: 40,
            borderColor: '#e2e8f0',
            borderRadius: 4
        }
    },
    {
        id: 'textarea',
        name: 'Text Area',
        icon: '📝',
        defaultProps: {
            placeholder: 'Enter text...',
            rows: 4,
            width: 300,
            height: 120,
            borderColor: '#e2e8f0',
            borderRadius: 4
        }
    },

    // Media Elements
    {
        id: 'image',
        name: 'Image',
        icon: '🖼',
        defaultProps: {
            src: '/api/placeholder/300/200',
            alt: 'Image description',
            width: 300,
            height: 200,
            objectFit: 'cover'
        }
    },
    {
        id: 'video',
        name: 'Video',
        icon: '🎥',
        defaultProps: {
            src: '',
            controls: true,
            width: 480,
            height: 270,
            autoplay: false,
            loop: false
        }
    },
    {
        id: 'audio',
        name: 'Audio',
        icon: '🔊',
        defaultProps: {
            src: '',
            controls: true,
            width: 300,
            height: 54,
            autoplay: false,
            loop: false
        }
    },

    // Container Elements
    {
        id: 'div',
        name: 'Container',
        icon: '□',
        defaultProps: {
            backgroundColor: '#f8fafc',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            borderRadius: 4,
            padding: 16
        }
    },
    {
        id: 'section',
        name: 'Section',
        icon: '▣',
        defaultProps: {
            backgroundColor: 'transparent',
            padding: 24,
            marginTop: 16,
            marginBottom: 16
        }
    },

    // List Elements
    {
        id: 'unorderedList',
        name: 'Bullet List',
        icon: '•',
        defaultProps: {
            items: ['Item 1', 'Item 2', 'Item 3'],
            listStyle: 'disc',
            spacing: 8
        }
    },
    {
        id: 'orderedList',
        name: 'Numbered List',
        icon: '1.',
        defaultProps: {
            items: ['First item', 'Second item', 'Third item'],
            listStyle: 'decimal',
            spacing: 8
        }
    },

    // Table Elements
    {
        id: 'table',
        name: 'Table',
        icon: '▦',
        defaultProps: {
            headers: ['Header 1', 'Header 2', 'Header 3'],
            rows: [
                ['Row 1, Cell 1', 'Row 1, Cell 2', 'Row 1, Cell 3'],
                ['Row 2, Cell 1', 'Row 2, Cell 2', 'Row 2, Cell 3']
            ],
            borderColor: '#e2e8f0',
            headerBgColor: '#f8fafc'
        }
    },

    // Form Elements
    {
        id: 'select',
        name: 'Select',
        icon: '↓',
        defaultProps: {
            options: ['Option 1', 'Option 2', 'Option 3'],
            width: 200,
            height: 40,
            borderColor: '#e2e8f0',
            borderRadius: 4
        }
    },
    {
        id: 'checkbox',
        name: 'Checkbox',
        icon: '☐',
        defaultProps: {
            label: 'Checkbox label',
            checked: false,
            size: 16
        }
    },
    {
        id: 'radio',
        name: 'Radio Button',
        icon: '○',
        defaultProps: {
            label: 'Radio label',
            checked: false,
            size: 16
        }
    },

    // Semantic Elements
    {
        id: 'nav',
        name: 'Navigation',
        icon: '≡',
        defaultProps: {
            items: ['Home', 'About', 'Contact'],
            backgroundColor: '#f8fafc',
            padding: 16,
            spacing: 24
        }
    },
    {
        id: 'footer',
        name: 'Footer',
        icon: '⟱',
        defaultProps: {
            text: '© 2024 Your Company',
            backgroundColor: '#f8fafc',
            padding: 24,
            textAlign: 'center'
        }
    },
    {
        id: 'header',
        name: 'Header',
        icon: '⟰',
        defaultProps: {
            title: 'Page Title',
            subtitle: 'Page description goes here',
            backgroundColor: '#f8fafc',
            padding: 24,
            textAlign: 'center'
        }
    }
];
