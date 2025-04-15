/**
 * @fileoverview
 * This file contains the CRUD services for the users table.  
 * The services are used to interact with the database and perform CRUD operations.
 * 
 * It handles the following operations:  
 * 
 */

import db from '../database';
import { Permission } from '../../../generated/prisma_client';

/**
 * @description
 * Create a new permission in the database.
 * 
 * @param {Permission} permission - The permission object to create.
 * @returns The created permission.
 */
async function createPermission(permission: Permission) {
    return await db.permission.create({ data: permission });
}

/**
 * @description
 * Fetch all permissions from the database and return the permission objects.
 * 
 * @returns The array of permission objects.
 */
async function getPermissions() {
    return await db.permission.findMany();
}

/**
 * @description
 * Fetch permissions by role ID from the database and return the permission objects.
 * 
 * @param {string} roleId - The ID of the role to fetch permissions for.
 * @returns The array of permission objects for the given role ID.
 */
async function getPermissionByRoleId(roleId: string) {
    return await db.permission.findMany({
        where: { roleId }
    });
}

/**
 * @description
 * Fetch a permission by its ID from the database and return the permission object.
 * 
 * @param {string} id - The ID of the permission to fetch.
 * @returns The permission object or null if not found.
 */
async function getPermissionById(id: string) {
    return (
        await db.permission.findUnique({
            where: { id }
        })
    );
}

/**
 * @description
 * Update a permission in the database.
 * 
 * @param {string} id - The ID of the permission to update.
 * @param {Permission} permission - The updated permission object.
 * @returns The updated permission object.
 */
async function updatePermission(id: string, permission: Permission) {
    return await db.permission.update({
        where: { id },
        data: permission
    });
}

/**
 * @description
 * Delete a permission by its ID from the database.
 * This is a hard delete operation.
 * 
 * @param {string} id - The ID of the permission to delete.
 * @returns The deleted permission object.
 */
async function deletePermission(id: string) {
    return await db.permission.delete({
        where: { id }
    });
}

export const permissionService = {
    createPermission,
    getPermissions,
    getPermissionByRoleId,
    getPermissionById,
    updatePermission,
    deletePermission
};