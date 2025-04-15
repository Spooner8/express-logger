/**
 * @fileoverview
 * This file contains the CRUD services for the users table.  
 * The services are used to interact with the database and perform CRUD operations.
 * 
 * It handles the following operations:  
 * 1. createUser - Create a new user in the database.  
 * 2. getUsers - Fetch all users from the database.  
 * 3. getUserById - Fetch a user by its ID from the database.  
 * 4. getUserByUsername - Fetch a user by its username from the database.  
 * 5. updateUser - Update a user in the database.  
 * 6. deleteUser - Delete a user from the database.
 */

import db from '../database';
import { Role } from '../../../generated/prisma_client';

/**
 * @description
 * Create a new role in the database.
 * 
 * @returns The the created role.
*/
async function createRole(role: Role) {
    return await db.role.create({ data: role });
}

/**
 * @description
 * Fetch all roles from the database and return the role objects.
*/
async function getRoles() {
    return await db.role.findMany();
}

/**
 * @description
 * Fetch a role by its ID from the database and return the role object.
 * 
 * @param {string} id - The ID of the role to fetch.
 * @returns The role object or null if not found.
 */
async function getRoleById(id: string) {
    return (
        await db.role.findUnique({
            where: { id }
        })
    );
}

/**
 * @description
 * Fetch the default role from the database and return the id.
 * 
 * @returns The id of the default role or null if not found.
 */
async function getDefaultRole() {
    const defaultRoleId = await db.role.findUnique({
        where: { isDefault: true },
    });

    return defaultRoleId?.id;
}


/**
 * @description
 * Fetch the admin role from the database and return the id.
 * 
 * @returns The id of the admin role or null if not found.
 */
async function getAdminRole() {
    const adminRoleId = await db.role.findUnique({
        where: { isAdmin: true },
    });

    return adminRoleId?.id;
}


/**
 * @description
 * Update a role in the database.
 * 
 * @param {string} id - The ID of the role to update.
 * @param {Role} role - The updated role data.
 */
async function updateRole(id: string, role: Role) {
    return await db.role.update({
        where: { id },
        data: role,
    });
}

/**
 * @description
 * Delete a role from the database by setting isActive to false.  
 * This is a soft delete.
 * 
 * @param {string} id - The ID of the role to deactivate.
 */
async function deleteRole(id: string) {
    return await db.role.update({
        where: { id },
        data: {
            isActive: false,
        },
    });
}

export const roleService = {
    createRole,
    getRoles,
    getRoleById,
    getDefaultRole,
    getAdminRole,
    updateRole,
    deleteRole,
};
