import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';

export default (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.headers['authorization'];
    
    if(authToken) {
        let splitedToken = authToken.split(' ');
        let token = splitedToken[1];

        jwt.verify(token, config.get<string>('secret'), (err: any, decoded: any) => {
            if(err) res.status(406).json({msg: 'Invalid Token'});

            if(decoded.payload.id_role == 1) {
                next();
            } else {
                res.status(406).json({msg: `You don't have permission to access this.`});
            }
        });
    } else {
        res.status(404).json({msg: 'Toke Not Provided.'});
    }
};