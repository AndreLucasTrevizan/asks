import {Request, Response} from 'express';
import db from '../database/dbConnection';

export default new class {

    reportOfFriendsFromUser(req: Request, res: Response) {
        let {id_user} = req.params;
        let sql = `CALL ReportFriendsOfUser(?)`;

        db.query(sql, id_user, (err: any, result: any) => {
            if(err) res.status(402).json({error: err.message});

            res.status(200).json(result[0]);
        });
    }

    createFriendship(req: Request, res: Response) {
        let {id_user, id_friend} = req.body;
        let sql = `CALL AddingFriend(?, ?)`;

        db.query(sql, [
            id_user,
            id_friend
        ], (err: any, result: any) => {
            if(err) res.status(402).json({error: err.message});

            res.status(201).json(result);
        });
    }

    deleteFriend(req: Request, res: Response) {
        let {id} = req.params;
        let sql = `CALL RemovingFriend(?)`;
        db.query(sql, id, (err: any, result: any) => {
            if(err) res.status(402).json({error: err.message});

            res.status(200).json(result);
        });
    }

}