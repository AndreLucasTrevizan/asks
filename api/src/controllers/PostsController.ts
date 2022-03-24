import {Request, Response} from 'express';
import db from '../database/dbConnection';

export default new class {

    createPost(req: Request, res: Response) {
        let {title, post_description, image, id_user, id_category} = req.body;
    }

}