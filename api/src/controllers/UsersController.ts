import {Request, Response} from 'express';
import config from 'config';
import {validationResult} from 'express-validator';
import jwt from 'jsonwebtoken';
import brcyptjs from 'bcryptjs';
import fs from 'fs';
import db from '../database/dbConnection';

export default new class {

    signIn(req: Request, res: Response) {
        let {email, user_password} = req.body;
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.status(402).json(errors.array());
        } else {
            let sql = `CALL GetUserByEmail(?)`;
            db.query(sql, email, (err: any, result: any) => {
                if(err) res.status(400).json({error: err.message});
                if(result[0].length > 0 && brcyptjs.compareSync(user_password, result[0][0].user_password)) {
                    let payload = {
                        firstname: result[0][0].firstname,
                        lastname: result[0][0].lastname,
                        email: result[0][0].email,
                        id_role: result[0][0].id_role
                    };

                    let token = jwt.sign({payload}, config.get<string>('secret'), {expiresIn: '1h'});

                    let user = {
                        firstname: result[0][0].firstname,
                        lastname: result[0][0].lastname,
                        email: result[0][0].email,
                        id_role: result[0][0].id_role,
                        token: token
                    };

                    res.status(200).json(user);
                } else {
                    res.status(402).json({msg: 'Inválid Email or Password!'});
                }
            });
        }
    }

    reportUsers(req: Request, res: Response) {
        let sql =  `CALL ReportUsers()`;
        db.query(sql, (err: any, result: any) => {
            if(err) res.status(400).json({error: err.message});

            res.status(200).json(result[0]);
        });
    }

    signUp(req: any, res: Response) {
        let {firstname, lastname, email, user_password} = req.body;
        let avatar = (req.file !== undefined) ? req.file.filename : 'default.jpg';
        let id_role = req.body.id_role ? req.body.id_role : 2;
        
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.status(402).json(errors.array());
        } else {
            let hash = brcyptjs.hashSync(user_password, 15);
            let sql = `CALL InsertUsers(?, ?, ?, ?, ?, ?, ?)`;

            db.query(sql, [
                avatar,
                firstname,
                lastname,
                email,
                hash,
                1,
                id_role
            ],(err: any, result) => {
                if(err) {
                    fs.unlink(`./src/uploads/avatars/${avatar}`, (err : any) => {
                        if(err) res.status(400).json(err);
                    });

                    res.status(400).json({error: err.message});
                }

                res.status(201).json(result);
            });
        }
    }

    updateUser(req: Request, res: Response) {
        let {id, firstname, lastname, email} = req.body;
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.status(402).json(errors.array());
        } else {
            let sql = `CALL UpdateUser(?, ?, ?, ?)`;
            db.query(sql, [
                firstname,
                lastname,
                email,
                id
            ], (err: any, result) => {
                if(err) res.status(400).json({error: err.message});

                res.status(200).json(result);
            });
        }
    }

    deleteUser(req: Request, res: Response) {
        let { id } = req.params;
        let sql = `CALL GetAvatarFromUserById(?)`;
        db.query(sql, id, (err: any, result: any) => {
            if(err) res.status(400).json({error: err.message});

            if(result[0].length > 0) {
                if((result[0][0].avatar !== 'default.jpg') && (result[0][0].avatar !== null)) {
                    fs.unlink(`./src/uploads/avatars/${result[0][0].avatar}`, (err: any) => {
                        if(err) res.status(400).json({error: err.message});
                    });
                }

                let sql = 'CALL DeleteUser(?)';
                db.query(sql, id, (err: any, result: any) => {
                    if(err) res.status(400).json({error: err.message});

                    res.status(200).json(result);
                });
            }
        });
    }

    updateAvatar(req: Request, res: Response) {
        let {id} = req.params;
        let avatar = req.file !== undefined ? req.file.filename : '';
        let sql = 'CALL GetAvatarFromUserById(?)';
        
        db.query(sql, id, (err: any, result: any) => {
            if(err) res.status(400).json({error: err.message});

            if(result[0][0].avatar !== 'default.jpg') {
                fs.unlink(`./src/uploads/${result[0].avatar}`, (err: any) => {
                    if(err) res.status(400).json({error: err.message});
                });
            }

            let sql = 'CALL UpdateAvatarFromUserById(?, ?)';
            db.query(sql, [
                avatar,
                id
            ], (err: any, result: any) => {
                if(err) res.status(400).json({error: err.message});
            
                res.status(200).json(result);
            });
        });
    }

}