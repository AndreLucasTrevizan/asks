import {Request, Response} from 'express';
import {validationResult} from 'express-validator';
import db from '../database/dbConnection';

export default new class {

    reportCategories(req: Request, res: Response) {
        let sql = 'SELECT * FROM categories';
        db.query(sql, (err: any, result) => {
            if(err) res.status(400).json(err.message);

            res.status(201).json(result);
        });
    }
    
    createCategory(req: Request, res: Response) {
        let {category_description} = req.body;
        let sql = 'INSERT INTO categories (role_description, createdAt, updatedAt) VALUES (?, ?, ?)';
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.status(402).json(errors.array());
        } else {
            db.query(sql, [
                category_description,
                new Date(),
                new Date()
            ], (err: any, result) => {
                if(err) res.status(400).json(err.message);

                res.status(201).json(result);
            });
        }
    }

}