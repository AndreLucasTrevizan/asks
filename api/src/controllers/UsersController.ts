import {Request, Response} from 'express';
import config from 'config';
import {validationResult} from 'express-validator';
import jwt from 'jsonwebtoken';
import brcyptjs from 'bcryptjs';
import db from '../database/dbConnection';

export default new class {

    sign_in(req: Request, res: Response) {
        let {email, user_password} = req.body;
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.status(402).json(errors.array());
        } else {
            let sql = `SELECT
                            firstname,
                            lastname,
                            email,
                            user_password,
                            id_role
                        FROM users WHERE email = ?`;
            db.query(sql, email, (err: any, result: any) => {
                if(err) res.status(400).json(err.message);
                
                if(result.length > 0 && brcyptjs.compareSync(user_password, result[0].user_password)) {
                    let payload = {
                        firstname: result[0].firstname,
                        lastname: result[0].lastname,
                        email: result[0].email,
                        id_role: result[0].id_role
                    };

                    let token = jwt.sign({payload}, config.get<string>('secret'), {expiresIn: '1h'});

                    let user = {
                        firstname: result[0].firstname,
                        lastname: result[0].lastname,
                        email: result[0].email,
                        id_role: result[0].id_role,
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
        let sql =  `SELECT
                        concat(users.firstname, ' ', users.lastname) as name,
                        users.email as email,
                        roles.role_description as role,
                        users.createdAt as created_at,
                        users.updatedAt as last_update
                    FROM users INNER JOIN roles ON users.id_role = roles.id`;
        db.query(sql, (err: any, result: any) => {
            if(err) res.status(400).json(err.message);

            res.status(200).json({users: result});
        });
    }

    createUser(req: Request, res: Response) {
        let {firstname, lastname, email, user_password} = req.body;
        let role = req.body.role ? req.body.role : 2;

        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.status(402).json(errors.array());
        } else {
            let hash = brcyptjs.hashSync(user_password, 15);
            let sql = `INSERT INTO users (
                            firstname, lastname, email, user_password, id_role, createdAt, updatedAt
                        ) VALUES (
                            ${firstname},
                            ${lastname},
                            ${email},
                            ${hash},
                            ${new Date()},
                            ${new Date()},
                            ${role}
                        )`;

            db.query(sql, [
                firstname,
                lastname,
                email,
                hash,
                role,
                new Date(),
                new Date()
            ],(err: any, result) => {
                if(err) res.status(400).json(err.message);

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
            let sql = `UPDATE users SET
                            firstname = ${firstname},
                            lastname = ${lastname},
                            email = ${email}?,
                            updatedAt = ${new Date()}
                        WHERE id = ${id}`;

            db.query(sql, (err: any, result) => {
                if(err) res.status(400).json(err.message);

                res.status(200).json(result);
            });
        }
    }

    deleteUser(req: Request, res: Response) {
        let { id } = req.params;
        let sql = `DELETE FROM users WHERE id = ${id}`;
    }

}