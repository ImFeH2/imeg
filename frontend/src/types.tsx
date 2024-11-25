export interface Position {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface ComponentProps {
    [key: string]: any;
}

export interface Element {
    id: number;
    type: string;
    position: Position;
    size: Size;
    props: ComponentProps;
}

export interface ComponentData {
    id: string;
    name: string;
    icon: string;
    defaultProps: ComponentProps;
}

export interface PageSettings {
    responsive: boolean;
    width: number;
    height: number;
    maxWidth: string;
    bgColor: string;
}

export interface PageContent {
    elements: Element[];
    settings: PageSettings;
}
