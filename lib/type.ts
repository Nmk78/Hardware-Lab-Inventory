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


export interface attributeDefinitions {
    name: string;
    type: string;
    required: boolean;
  }
  
  export interface Category {
    id?: string;
    name: string;
    fields: attributeDefinitions[];
  }
  
  export interface ProductFormValues {
    name: string;
    categoryId: string;
    attributes: Record<string, string>;
  }