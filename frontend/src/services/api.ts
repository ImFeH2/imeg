import {Component, PageContent} from '../types';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

const API_BASE_URL = 'http://localhost:3000/api';

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<T> = await response.json();
    if (!data.success) {
        throw new Error(data.error || 'API request failed');
    }

    return data.data!;
}

export async function savePage(content: PageContent): Promise<PageContent> {
    const response = await fetch(`${API_BASE_URL}/page`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
    });

    return handleResponse<PageContent>(response);
}

export async function getPage(): Promise<PageContent> {
    const response = await fetch(`${API_BASE_URL}/page`);
    return handleResponse<PageContent>(response);
}

export async function getComponents(): Promise<Component[]> {
    const response = await fetch(`${API_BASE_URL}/components`);
    return handleResponse<Component[]>(response);
}

export async function saveComponent(component: Component): Promise<Component> {
    const response = await fetch(`${API_BASE_URL}/components`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(component),
    });

    return handleResponse<Component>(response);
}

export async function deleteComponent(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/components/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(id),
    });

    return handleResponse<void>(response);
}
