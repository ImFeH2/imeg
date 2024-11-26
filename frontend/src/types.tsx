// 属性验证器类型
export type PropertyValidator = {
    validate: (value: any) => boolean;
    message: string;
}

// 单个属性的完整定义
export interface Property {
    name: string;               // 属性标识
    label: string;             // 显示名称
    type: 'string' | 'number' | 'boolean' | 'color' | 'select' | 'text' | 'file'; // 属性类型
    category: 'layout' | 'typography' | 'decoration' | 'basic' | 'advanced';      // 属性分类，用于在属性面板中分组显示
    defaultValue: any;         // 默认值
    options?: string[];        // select 类型的选项
    required?: boolean;        // 是否必填
    description?: string;      // 属性说明
    validation?: PropertyValidator | PropertyValidator[];  // 验证规则
}

// Content can be either text or another element
export type ContentItem = {
    type: 'text';
    content: string;
} | {
    type: 'element';
    elementId: number;
};

// 所有组件必须包含的基础属性
export const baseProperties: Property[] = [
    {
        name: 'x',
        label: 'X Position',
        type: 'number',
        category: 'layout',
        defaultValue: 0,
        required: true,
        validation: {
            validate: (value: number) => Number.isFinite(value),
            message: 'X position must be a valid number'
        }
    },
    {
        name: 'y',
        label: 'Y Position',
        type: 'number',
        category: 'layout',
        defaultValue: 0,
        required: true,
        validation: {
            validate: (value: number) => Number.isFinite(value),
            message: 'Y position must be a valid number'
        }
    },
    {
        name: 'width',
        label: 'Width',
        type: 'number',
        category: 'layout',
        defaultValue: 200,
        required: true,
        validation: {
            validate: (value: number) => value > 0,
            message: 'Width must be greater than 0'
        }
    },
    {
        name: 'height',
        label: 'Height',
        type: 'number',
        category: 'layout',
        defaultValue: 100,
        required: true,
        validation: {
            validate: (value: number) => value > 0,
            message: 'Height must be greater than 0'
        }
    }
];

// 元素实例（组件的具体实例）
export interface Element {
    id: number;                // 实例ID
    type: string;              // 组件类型
    properties: {              // 属性值集合
        [key: string]: any;    // 包含基础属性(x/y/width/height)和组件特有属性
    };
    content: ContentItem[];    // 内容列表
}

// 组件定义（用于组件面板展示和创建新实例）
export interface ComponentData {
    id: string;               // 组件类型标识
    name: string;            // 显示名称
    icon: string;            // 图标
    category: 'text' | 'container' | 'media' | 'input' | 'layout' | 'custom'; // 组件分类
    description?: string;    // 组件描述
    properties: Property[];  // 组件特有属性定义（不包含基础属性）
    canContainContent: boolean; // 是否可以包含内容
    defaultContent: ContentItem[]; // 默认内容
    tags?: string[];        // 搜索标签
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
