type Role = keyof typeof Roles;
type Permission = (typeof Roles)[Role][number];

const Roles = {
  admin: [
    "view:items",
    "create:items",
    "edit:items",
    "lend:items",
    "delete:items",
    "view:users",
    "invite:users",
    "delete:users",
  ],
  user: ["view:items", "create:items", "edit:items", "delete:items"],
} as const; // `as const` for makeing ROLES type read-only

export const hasPermission = (role: Role, permission: Permission): boolean => {
  return (Roles[role] as readonly Permission[]).includes(permission);
};
