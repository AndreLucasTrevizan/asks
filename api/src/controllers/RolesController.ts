import {Request, Response} from 'express';
import db from '../database/dbConnection';

export default new class {

    listRoles(req: Request, res: Response) {
        let sql = `SELECT * FROM roles`;
        db.query(sql, (err: any, result) => {
            if(err) throw new Error(err);

            res.status(200).json({roles: result});
        });
    }

}