import { Request, Response, NextFunction } from 'express';
import { ValidationError, ForeignKeyConstraintError, DatabaseError } from 'sequelize';

const errorHandler = (
    error: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    // Error de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
        const errObj: { [key: string]: string } = {};
        error.errors.map((er: any) => {
            errObj[er.path] = er.message;
        });
        return res.status(400).json(errObj);
    }
    
    // Error de clave foránea
    if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({ 
            message: error.message,
            error: error.parent?.detail || 'Error de clave foránea'
        });
    }
    
    // Error de base de datos
    if (error.name === 'SequelizeDatabaseError') {
        return res.status(400).json({ 
            message: error.message
        });
    }
    
    // Error genérico
    console.error('Error:', error);
    return res.status(500).json({
        message: error.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { error: error })
    });
};

export default errorHandler; // 👈 Exportación por defecto