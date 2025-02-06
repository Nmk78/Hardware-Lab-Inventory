// Define the roles
enum Role {
    Admin = 'Admin',
    User = 'User'
}

// Define the permissions
enum Permission {
    ViewInventory = 'ViewInventory',
    ManageInventory = 'ManageInventory'
}

// Define the role permissions
const rolePermissions: { [key in Role]: Permission[] } = {
    [Role.Admin]: [Permission.ViewInventory, Permission.ManageInventory],
    [Role.User]: [Permission.ViewInventory]
};

export { Role, Permission, rolePermissions };