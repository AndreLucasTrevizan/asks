import {Request, Response} from 'express';
import {validationResult} from 'express-validator';
import db from '../database/dbConnection';

export default new class {

    reportPosts(req: Request, res: Response) {
        let {id_friend} = req.params;
        let sql = `SELECT users.id FROM friendships INNER JOIN users ON friendships.id_friend = users.id`;
        let posts: any = [];

        db.query(sql, [
            id_friend
        ], (err: any, result: any) => {
            if(err) res.status(402).json({error: err.message});

            let ids: any = result;

            ids.forEach((item: any) => {
                let sql = `SELECT * FROM posts WHERE id_user = ${item.id}`;

                db.query(sql, (err: any, result: any) => {
                    if(err) res.status(402).json({error: err.message});
                    
                    if(result.length !== 0) {
                        result.forEach((item: any) => {
                            posts.push(item);
                        });
                    }
                });
            });
        });
    }

    createPost(req: Request, res: Response) {
        let {post_description, post_image, id_user} = req.body;
        if(req.file === undefined && (post_description === '' ||  post_description === undefined)) {
            res.status(402).json({msg: 'Ops! We need at least a description to your post.'});
        } else {
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
                post_image,
                id_user,
                new Date(),
                new Date()
            ], (err: any, result: any) => {
                if(err) res.status(402).json({errors: err.message});

                res.status(201).json(result);
            });
        }
    }

}