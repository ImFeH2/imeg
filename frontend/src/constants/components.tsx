import {ComponentData} from "../types.tsx";

export const componentsData: ComponentData[] = [
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
        id: 'image',
        name: 'Image',
        icon: '🖼',
        defaultProps: {
            src: '/api/placeholder/300/200',
            alt: 'Image description',
            width: 300,
            height: 200
        }
    },
    {
        id: 'button',
        name: 'Button',
        icon: '⬢',
        defaultProps: {
            text: 'Click me',
            bgColor: '#3b82f6',
            textColor: '#ffffff',
            width: 120,
            height: 40
        }
    },
    {
        id: 'list',
        name: 'List',
        icon: '≡',
        defaultProps: {
            items: ['Item 1', 'Item 2', 'Item 3'],
            listStyle: 'disc',
            spacing: 4
        }
    }
];
