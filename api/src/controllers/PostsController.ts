import {Request, Response} from 'express';
import fs from 'fs';
import db from '../database/dbConnection';

export default new class {

    reportPosts(req: Request, res: Response) {
        let {id_user} = req.params;
        let sql = `
            SELECT 
                posts.post_description as post_description,
                posts.post_image as post_image,
                concat(users.firstname, ' ', users.lastname) as posted_by,
                posts.createdAt as createdAt,
                posts.updatedAt as updatedAt
            FROM posts
                INNER JOIN users ON posts.id_user = users.id
                INNER JOIN friendships ON friendships.id_friend = users.id
            WHERE friendships.id_user = ? AND posts.id_user = friendships.id_friend;
        `;

        db.query(sql, [
            id_user
        ], (err: any, result: any) => {
            if(err) res.status(402).json({error: err.message});

            res.status(200).json(result);
        });
    }

    reportUserPosts(req: Request, res: Response) {
        let {id_user} = req.params;
        let sql = `
            SELECT * FROM posts WHERE posts.id_user = ?
        `;

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
            let sql = `
                INSERT INTO posts (
                    post_description,
                    post_image,
                    id_user,
                    createdAt,
                    updatedAt
                ) VALUES (?, ?, ?, ?, ?)
            `;

            db.query(sql, [
                post_description,
                post_img,
                id_user,
                new Date(),
                new Date()
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
            let sql = `
                UPDATE posts SET
                    post_description = ?,
                    post_image = ?,
                    updatedAt = ?
                WHERE id = ?
            `;

            db.query(sql, [
                post_description,
                post_img,
                new Date(),
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

        let sql = `SELECT post_image FROM posts WHERE id = ?`;
        db.query(sql, id, (err: any, result: any) => {
            if(err) res.status(400).json({error: err.message});

            if(result[0].post_image !== null) {
                fs.unlink(`./src/uploads/posts/${result[0].post_image}`, (err: any) => {
                    if(err) res.status(400).json({error: err.message});
                });
            }

            let sql = `DELETE FROM posts WHERE id = ?`;
            db.query(sql, id, (err: any, result: any) => {
                if(err) res.status(400).json({error: err.message});

                res.status(200).json(result);
            });
        });
    }

}