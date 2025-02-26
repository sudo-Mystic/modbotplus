export interface Rule {
    id: string;
    name: string;
    condition: string; // e.g., "user_is_mod", "post_has_keyword"
    action: string;    // e.g., "ban_user", "remove_post"
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}