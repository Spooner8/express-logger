import type { Request, Response } from 'express';
import { Router } from 'express';
import { logger } from '../services/log/logger';
import type { Permission, Role } from '../../generated/prisma_client';
import { roleService } from '../services/crud/roles';
import { permissionService } from '../services/crud/permissions';

const router = Router();

router.post('/create', async (req: Request, res: Response) => {
    try {
        const permission: Permission = req.body;
        if (!permission) {
            res.status(400).send({ message: 'Permission is required' });
            return;
        }

        const { roleId } = req.body;
        if (!roleId) {
            res.status(400).send({ message: 'Role is required' });
            return;
        }

        const response = await permissionService.createPermission(permission);
        if (!response) {
            res.status(401).send({ message: 'Permission not created' });
        } else {
            res.status(201).send({ 'Permission created': response });
        }
    }
    catch (error: unknown) {
        logger.error(error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

router.get('/', async (_req: Request, res: Response) => {
    try {
        const permissions = await permissionService.getPermissions();
        if (!permissions) {
            res.status(404).send({ message: 'Permissions not found' });
        } else {
            res.status(200).send(permissions);
        }
    }
    catch (error: unknown) {
        logger.error(error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const permission = id && (await permissionService.getPermissionById(id));
        if (!permission) {
            res.status(404).send({ message: 'Permission not found' });
        } else {
            res.status(200).send(permission);
        }
    }
    catch (error: unknown) {
        logger.error(error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const permission: Permission = req.body;
        const response = id && (await permissionService.updatePermission(id, permission));
        if (!response) {
            res.status(404).send({ message: 'Permission not found' });
        } else {
            res.status(200).send({ 'Permission updated': response });
        }
    }
    catch (error: unknown) {
        logger.error(error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = id && (await permissionService.deletePermission(id));
        if (!response) {
            res.status(404).send({ message: 'Permission not found' });
        } else {
            res.status(200).send({ 'Permission deleted': response });
        }
    }
    catch (error: unknown) {
        logger.error(error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

export default router;