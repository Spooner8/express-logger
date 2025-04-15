import db from "../services/database";
import type { Request, Response, NextFunction } from 'express';
import { authService } from "../services/auth/auth";
import { match } from "path-to-regexp";
import { permissionService } from "../services/crud/permissions";
import { logger } from "../services/log/logger";

const RBAC = (process.env.RBAC  || 'true') === 'true';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (!RBAC) {
        return next();
    }
    (async () => {
        try {
            const user = await authService.getCurrentUser(req);
            const role = user && await db.role.findUnique({
                where: { id: user.roleId },
            });
            
            if (!user || !role || !role.isAdmin) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            
            next();
        } catch (error) {
            logger.error('Error in isAdmin middleware:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    })();
};

export const checkPermissions = (req: Request, res: Response, next: NextFunction): void => {
    if (!RBAC) {
        return next();
    }
    
    (async () => {
        try {
            const user = await authService.getCurrentUser(req);
            const method = req.method.toUpperCase();
            const url = req.originalUrl;

            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const permissions = await permissionService.getPermissionByRoleId(user.roleId);

            const hasPermission = permissions.some(permission => {
                const matchPath = match(permission.routePattern, { decode: decodeURIComponent });
                return permission.method === method && matchPath(url);
            });

            if (!hasPermission) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            next();
        } catch (error) {
            logger.error('Error in checkPermissions middleware:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    })();
};