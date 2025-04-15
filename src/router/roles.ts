import type { Request, Response } from 'express';
import { Router } from 'express';
import { logger } from '../services/log/logger';
import type { Role } from '../../generated/prisma_client';
import { roleService } from '../services/crud/roles';

const router = Router();

router.post('/create' , async (req: Request, res: Response) => {
    try {
        const role: Role = req.body;
        if (!role) {
            res.status(400).send({ message: 'Role is required' });
            return;
        }
        const response = await roleService.createRole(role);
        if (!response) {
            res.status(401).send({ message: 'Role not created' });
        } else {
            res.status(201).send({ 'Role created': response });
        }
    } catch (error: unknown) {
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
        const roles = await roleService.getRoles();
        if (!roles) {
            res.status(404).send({ message: 'Roles not found' });
        } else {
            res.status(200).send(roles);
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
        const role = id && (await roleService.getRoleById(id));
        if (!role) {
            res.status(404).send({ message: 'Role not found' });
        } else {
            res.status(200).send(role);
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
        const data: Role = req.body;
        const response = data && (await roleService.updateRole(id, data));
        if (!response) {
            res.status(404).send({ message: 'Role not found' });
        } else {
            res.status(200).send({ 'Role updated': response });
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
        const response = id && (await roleService.deleteRole(id));
        if (!response) {
            res.status(404).send({ message: 'Role not found' });
        } else {
            res.status(200).send({ 'Role deactivated': response });
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