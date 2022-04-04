import {Request, Response} from 'express';
import {validationResult} from 'express-validator';
import db from '../database/dbConnection';

export default new class {

    listRoles(req: Request, res: Response) {
        let sql = `CALL ReportRoles()`;
        db.query(sql, (err: any, result) => {
            if(err) throw new Error(err);

            res.status(200).json({roles: result});
        });
    }

    createRole(req: Request, res: Response) {
        let {role_description} = req.body;
        let sql = 'CALL InsertRoles(?)';
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.status(402).json(errors.array());
        } else {
            db.query(sql, [
                role_description,
            ], (err: any, result) => {
                if(err) res.status(400).json(err.message);
    
                res.status(201).json(result);
            });
        }

    }

    updateRole(req: Request, res: Response) {
        let {id, role_description} = req.body;
        let sql = `CALL UpdateRole(?, ?)`;

        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.status(402).json(errors.array());
        } else {
            db.query(sql, [
                role_description,
                id
            ], (err: any, result) => {
                if(err) res.status(400).json(err.message);
    
                res.status(200).json(result);
            });
        }
    }

    deleteRole(req: Request, res: Response) {
        let {id} = req.params;
        let sql = `CALL DeleteRole(?)`;
        db.query(sql, id, (err: any, result) => {
            if(err) res.status(400).json(err.message);

            res.status(200).json(result);
        });
    }

}