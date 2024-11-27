export interface Property {
    name: string;
    value: any;
    label: string;
    type: 'string' | 'number' | 'boolean' | 'color' | 'select' | 'text' | 'file';
    category: 'layout' | 'typography' | 'decoration' | 'basic' | 'advanced';
    options?: string[];
    required?: boolean;
    description?: string;
}

export type Content = {
    type: 'text';
    content: string;
} | {
    type: 'element';
    content: ComponentElement;
};

export interface ComponentElement {
    id: number;
    properties: Property[];
    content: Content[];
    type: Component;
}

export interface Component {
    id: number;
    name: string;
    icon: string;
    category: 'text' | 'container' | 'media' | 'input' | 'layout' | 'custom';
    description?: string;
    properties: Property[];
    canContainContent: boolean;
    defaultContent: Content[];
    tags?: string[];
}

export interface PageSettings {
    responsive: boolean;
    width: number;
    height: number;
    maxWidth: string;
    bgColor: string;
}

export interface PageContent {
    elements: ComponentElement[];
    settings: PageSettings;
}
