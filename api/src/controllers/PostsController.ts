import {Request, Response} from 'express';
import fs from 'fs';
import db from '../database/dbConnection';

export default new class {

    likingPost(req: Request, res: Response) {
        let {id_user, id_post} = req.body;
        let sql = `CALL GetAllLikesOfUser(?)`;
        db.query(sql, id_user, (err: any, result: any) => {
            if(err) res.status(402).json({msg: err.message});

            if(result[0].length > 0) {
                let sql = 'CALL UnlikingPost(?)';

                db.query(sql, id_user, (err: any, result: any) => {
                    if(err) res.status(402).json({msg: err.message});

                    res.status(200).json(result);
                });
            } else {
                let sql = `CALL LikingPost(?, ?)`;

                db.query(sql, [
                    id_user,
                    id_post
                ], (err: any, result: any) => {
                    if(err) res.status(402).json({msg: err.message});

                    res.status(200).json(result);
                });
            }
        });
    }

    reportPosts(req: Request, res: Response) {
        let {id_user} = req.params;
        let sql = `CALL ReportPosts(?)`;

        db.query(sql, [
            id_user
        ], (err: any, result: any) => {
            if(err) res.status(402).json({error: err.message});

            res.status(200).json(result);
        });
    }

    reportUserPosts(req: Request, res: Response) {
        let {id_user} = req.params;
        let sql = `CALL ReportPosts(?)`;

        db.query(sql, id_user, (err: any, result: any) => {
            if(err) res.status(402).json({error: err.message});

            res.status(200).json(result);
        });
    }

    createPost(req: any, res: Response) {
        let {post_description, post_image, id_user} = req.body;
        
        if(req.file === undefined && (post_description === '' ||  post_description === undefined)) {
            res.status(402).json({msg: 'Ops! We need at least a description to your post.'});
        } else {
            let post_img = (req.file !== undefined) ? req.file.filename : null;
            let sql = `CALL CreatePost(?, ?, ?)`;

            db.query(sql, [
                post_description,
                post_img,
                id_user
            ], (err: any, result: any) => {
                if(err) res.status(402).json({errors: err.message});

                res.status(201).json(result);
            });
        }
    }

    updatePost(req: any, res: Response) {
        let {id, post_description, post_image} = req.body;
        
        if(req.file !== undefined && (post_description == undefined || post_description == '')) {
            res.status(402).json({msg: 'Ops! We need at least a description to your post.'});
        } else {
            let post_img = (req.file !== undefined) ? req.file.filename : post_image;
            let sql = `CALL UpdatePost(?, ?, ?)`;

            db.query(sql, [
                post_description,
                post_img,
                id
            ], (err: any, result: any) => {
                if(err) {
                    if(req.file !== undefined) {
                        fs.unlink(`./src/uploads/posts/${req.file.filename}`, (err: any) => {
                            if(err) res.status(402).json({error: err.message});
                        });
                    }
                    res.status(402).json({error: err.message});
                }

                
                res.status(200).json(result);
            });
        }
    }

    deletePost(req: Request, res: Response) {
        let {id} = req.params;

        let sql = `CALL GetImageOfPostById(?)`;
        db.query(sql, id, (err: any, result: any) => {
            if(err) res.status(400).json({error: err.message});

            if(result[0][0].post_image !== null) {
                fs.unlink(`./src/uploads/posts/${result[0][0].post_image}`, (err: any) => {
                    if(err) res.status(400).json({error: err.message});
                });
            }

            let sql = `CALL DeletePost(?)`;
            db.query(sql, id, (err: any, result: any) => {
                if(err) res.status(400).json({error: err.message});

                res.status(200).json(result);
            });
        });
    }

}