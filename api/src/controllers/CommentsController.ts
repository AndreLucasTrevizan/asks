import {Request, Response} from 'express';
import db from '../database/dbConnection';
import fs from 'fs';

export default new class {

    likingComments(req: Request, res: Response) {
        let {id_user, id_comment} = req.body;
        let sql = `CALL GettingLikesOfCommentByUser(?)`;
    
        db.query(sql, id_user, (err: any, result: any) => {
            if(err) res.status(402).json({error: err.message});

            if(result[0].length > 0) {
                let sql = 'CALL RemovingLikeOfComment(?)';

                db.query(sql, id_user, (err: any, result: any) => {
                    if(err) res.status(402).json({error: err.message});

                    res.status(200).json(result);
                });
            } else {
                let sql = `CALL LikingComment(?, ?)`;

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
        let sql = `CALL ReportCommentsOfPost(?)`;
        db.query(sql, id_post, (err: any, result: any) => {
            if(err) res.status(402).json({error: err.message});

            res.status(200).json(result);
        });
    }

    createComment(req: Request, res: Response) {
        let {comment_description, comment_image, id_user, id_post} = req.body;
        let comment_img = req.file !== undefined ? req.file.filename : null;
        let sql = `CALL CreatingComment(?, ?, ?, ?)`;

        db.query(sql, [
            comment_description,
            comment_img,
            id_user,
            id_post
        ], (err: any, result: any) => {
            if(err) res.status(402).json({error: err.message});

            res.status(201).json(result);
        });
    }

    updateComment(req: Request, res: Response) {
        let {id, comment_description, comment_image} = req.body;
        let cmt_image = req.file !== undefined ? req.file.filename : comment_image;
        let sql = `CALL UpdateComment(?, ?, ?)`;

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
        let sql = 'CALL GetCommentImage(?)';

        db.query(sql, id, (err: any, result: any) => {
            if(err) res.status(402).json({error: err.message});

            if(result[0].length > 0) {
                fs.unlink(`./src/uploads/comments/${result[0][0].post_image}`, (err: any) => {
                    if(err) res.status(402).json({error: err.message});
                });
            }

            let sql = `CALL DeleteComment(?)`;
            db.query(sql, id, (err: any, result: any) => {
                if(err) res.status(402).json({error: err.message});

                res.status(200).json(result);
            });
        });
    }

}