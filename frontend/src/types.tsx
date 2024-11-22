export interface ComponentProps {
    text?: string;
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    bgColor?: string;
    textColor?: string;
    items?: string[];
    listStyle?: string;
    spacing?: number;
}

export interface ComponentData {
    id: string;
    name: string;
    icon: string;
    defaultProps: ComponentProps;
}

export interface Position {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface Element {
    id: number;
    type: string;
    position: Position;
    size: Size;
    props: ComponentProps;
}

export interface ResizingState {
    elementId: number;
    corner: string;
    startX: number;
    startY: number;
}
