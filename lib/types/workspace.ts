export type Workspace = {
    id: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type WorkspaceCreate = {
    name: string;
    user_id: string;
}
