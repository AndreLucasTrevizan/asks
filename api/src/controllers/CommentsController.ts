import {Request, Response} from 'express';
import db from '../database/dbConnection';
import fs from 'fs';

export default new class {

    likingComments(req: Request, res: Response) {
        let {id_user, id_comment} = req.body;
        let sql = `SELECT * FROM comment_likes WHERE id_user = ?`;
    
        db.query(sql, id_user, (err: any, result: any) => {
            if(err) res.status(402).json({error: err.message});

            if(result.length > 0) {
                let sql = 'DELETE FROM comment_likes WHERE id_user = ?';

                db.query(sql, id_user, (err: any, result: any) => {
                    if(err) res.status(402).json({error: err.message});

                    res.status(200).json(result);
                });
            } else {
                let sql = `
                    INSERT INTO comment_likes (
                        id_user,
                        id_comment
                    ) VALUES (?, ?, ?, ?);
                `;

                db.query(sql, [
                    id_user,
                    id_comment
                ], (err: any, result: any) => {
                    if(err) res.status(402).json({error: err.message});

                    res.status(200).json(result);
                });
            }
        });
    }

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
        let {id, comment_description, comment_image} = req.body;
        let cmt_image = req.file !== undefined ? req.file.filename : comment_image;
        let sql = `
            UPDATE comments SET 
                comment_description = ?,
                comment_image = ?
            WHERE id = ?
        `;

        db.query(sql, [
            comment_description,
            cmt_image,
            id
        ], (err: any, result: any) => {
            if(err) {
                if(req.file !== undefined) {
                    fs.unlink(`./src/uploads/comments/${req.file.filename}`, (err: any) => {
                        if(err) res.status(402).json({error: err.message});
                    });
                }

                res.status(402).json({error: err.message});
            }

            res.status(200).json(result);
        });
    }

    deleteComment(req: Request, res: Response) {
        let {id} = req.params;
        let sql = 'SELECT comment_image FROM comments WHERE id = ?';

        db.query(sql, id, (err: any, result: any) => {
            if(err) res.status(402).json({error: err.message});

            if(result.length > 0) {
                fs.unlink(`./src/uploads/comments/${result[0].post_image}`, (err: any) => {
                    if(err) res.status(402).json({error: err.message});
                });
            }

            let sql = `DELETE FROM comments WHERE id = ${id}`;
            db.query(sql, id, (err: any, result: any) => {
                if(err) res.status(402).json({error: err.message});

                res.status(200).json(result);
            });
        });
    }

}