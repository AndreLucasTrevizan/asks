import {Request, Response} from 'express';
import db from '../database/dbConnection';

export default new class {

    reportCommentFromPost(req: Request, res: Response){
        let {id_post} = req.params;
        let sql = `SELECT * FROM comments WHERE id_post = ?`;
        db.query(sql, id_post, (err: any, result: any) => {
            if(err) res.status(402).json({error: err.message});

            res.status(200).json(result);
        });
    }

    createComment(req: Request, res: Response) {
        let {comment_description, comment_image, id_user, id_post} = req.body;
        let comment_img = req.file !== undefined ? req.file.filename : null;
        let sql = `
            INSERT INTO comments (
                comment_description,
                comment_image,
                id_user,
                id_post,
                createdAt,
                updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?);
        `;

        db.query(sql, [
            comment_description,
            comment_img,
            id_user,
            id_post,
            new Date(),
            new Date(),
        ], (err: any, result: any) => {
            if(err) res.status(402).json({error: err.message});

            res.status(201).json(result);
        });
    }

    updateComment(req: Request, res: Response) {
        let {comment_description, comment_image, id_user, id_post} = req.body;
    }

    deleteComment(req: Request, res: Response);

}