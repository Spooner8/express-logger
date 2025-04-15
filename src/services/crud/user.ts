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

import bcrypt from 'bcrypt';
import db from '../database';
import type { User } from '../../../generated/prisma_client';

/**
 * @description
 * Create a new user in the database.
 * 
 * @param {string} email - The username of the user.
 * @param {string} password - The password of the user.
 * 
 * @returns The created user.
*/
async function createUser(email: string, password: string) {
    const userExists = await db.user.findUnique({
        where: { email },
    });

    if (userExists) {
        throw new Error('User already exists');
    }

    const defaultRole = await db.role.findUnique({
        where: { isDefault: true },
        select: { id: true },
    });

    if (!defaultRole) {
        throw new Error('Default role not found');
    }

    const salt = await bcrypt.genSalt(10);
    const data = {
        email: email,
        password: await bcrypt.hash(password, salt),
        roleId: defaultRole.id,
    };
    
    return await db.user.create({ data });
}

/**
 * @description
 * Fetch all users from the database and return the user objects.
*/
async function getUsers() {
    return await db.user.findMany();
}

/**
 * @description
 * Fetch a user by its ID from the database and return the user object.
 * 
 * @param {string} id - The ID of the user to fetch.
*/
async function getUserById(id: string) {
    return (
        await db.user.findUnique({
            where: { id }
        })
    );
}

async function getUserByUsername(username: string) {
    return await db.user.findUnique({
        where: { email: username }
    });
}

/**
 * @description
 * Update a user in the database.
 * 
 * @param {string} id - The ID of the user to update.
 * @param {User} data - The updated user data.
*/
async function updateUser(id: string, data: User) {
    if (data.password) {
        const user = await db.user.findUnique({ where: { id } });
        if (user && user.password !== data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
    }
    
    return await db.user.update({
        where: { id }, data
    });
}

/**
 * @description
 * Delete a user from the database.
 * 
 * @param {string} id - The ID of the user to delete.
*/
async function deleteUser(id: string) {
    return await db.user.delete({
        where: { id }
    });
}

export const userService = {
    createUser,
    getUsers,
    getUserById,
    getUserByUsername,
    updateUser,
    deleteUser,
};