export interface Action {
    id: string;
    type: string;
    parameters: Record<string, any>;
    description?: string;
}