export interface NavItem {
    name: string;
    icon: IconType;
    href: string;
    badge?: number;
    role?: string | null;
}