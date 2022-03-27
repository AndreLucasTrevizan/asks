import {Request, Response} from 'express';
import db from '../database/dbConnection';

export default new class {

    reportOfFriendsFromUser(req: Request, res: Response) {
        let {id_user} = req.params;
        let sql = `
            SELECT
                users.id as id,
                concat(users.firstname, ' ', users.lastname) as name,
            FROM users
            INNER JOIN friendships ON friendships.id_user = ? AND friendships.id_friend = users.id 
        `;

        db.query(sql, id_user, (err: any, result: any) => {
            if(err) res.status(402).json({error: err.message});

            res.status(200).json(result);
        });
    }

    createFriendship(req: Request, res: Response) {
        let {id_user, id_friend} = req.body;
        let sql = `
            INSERT INTO friendships (
                id_user, id_friend, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?)
        `;

        db.query(sql, [
            id_user,
            id_friend,
            new Date(),
            new Date()
        ], (err: any, result: any) => {
            if(err) res.status(402).json({error: err.message});

            res.status(201).json(result);
        });
    }

    deleteFriend(req: Request, res: Response) {
        let {id} = req.params;
        let sql = `DELETE FROM friendships WHERE id = ?`;
        db.query(sql, id, (err: any, result: any) => {
            if(err) res.status(402).json({error: err.message});

            res.status(200).json(result);
        });
    }

}