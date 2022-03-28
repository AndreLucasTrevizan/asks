import express from 'express';
import RolesController from '../controllers/RolesController';
import UsersController from '../controllers/UsersController';
import PostsController from '../controllers/PostsController';
import FriendsController from '../controllers/FriendsController';
import CommentsController from '../controllers/CommentsController';
import {check} from 'express-validator';
import isAdmin from '../middlewares/isAdmin';
import upAvatar from '../middlewares/upAvatar';
import upPostImage from '../middlewares/upPostImage';
import upCommentImage from '../middlewares/upCommentImage';
const router = express.Router();

//------------------------------------------------------------------------------------------------------

router.get('/roles', RolesController.listRoles);
router.post('/roles', [
    check('role_description').notEmpty().withMessage('Field Role Description cannot be empty'),
    check('role_description').isLength({min: 5}).withMessage('Field Role Description must be greater than 5 characters')
], RolesController.createRole);

router.put('/roles', [
    check('role_description').notEmpty().withMessage('Field Role Description cannot be empty'),
    check('role_description').isLength({min: 5}).withMessage('Field Role Description must be greater than 5 characters')
], RolesController.updateRole);
router.delete('/roles/:id', RolesController.deleteRole);

//------------------------------------------------------------------------------------------------------

router.get('/users', isAdmin, UsersController.reportUsers);

router.post('/users', upAvatar, [
    check('firstname').not().isEmpty().withMessage('Name must have more than 5 characters'),
    check('lastname').not().isEmpty().withMessage('Lastname must have more than 5 characters'),
    check('email').not().isEmpty().isEmail().normalizeEmail().withMessage('Enter a valid email value'),
    check('user_password').not().isEmpty().withMessage('Password cannot be empty')
], UsersController.createUser);

router.put('/users', [
    check('firstname').not().isEmpty().withMessage('Name must have more than 5 characters'),
    check('lastname').not().isEmpty().withMessage('Lastname must have more than 5 characters'),
    check('email').not().isEmpty().isEmail().normalizeEmail().withMessage('Enter a valid email value'),
], UsersController.updateUser);

router.post('/sign_in', [
    check('email').not().isEmpty().isEmail().normalizeEmail().withMessage('Enter a valid email value'),
    check('user_password').not().isEmpty().withMessage('Password cannot be empty')
], UsersController.sign_in);

router.delete('/users/:id', UsersController.deleteUser);

router.put('/users/:id/avatar', upAvatar, UsersController.updateAvatar);

//------------------------------------------------------------------------------------------------------

router.get('/posts/friends/:id_user', PostsController.reportPosts);
router.get('/posts/user/:id_user', PostsController.reportUserPosts);
router.post('/posts', upPostImage, PostsController.createPost);
router.post('/posts/like', PostsController.likingPost);
router.put('/posts', upPostImage, PostsController.updatePost);
router.delete('/posts/:id', PostsController.deletePost);

//------------------------------------------------------------------------------------------------------

router.get('/friends/:id_user', FriendsController.reportOfFriendsFromUser);
router.post('/friends', FriendsController.createFriendship);
router.delete('/friends/:id', FriendsController.deleteFriend);

//------------------------------------------------------------------------------------------------------

router.get('/comments/:id_post', CommentsController.reportCommentFromPost);
router.post('/comments', upCommentImage, CommentsController.createComment);
router.post('/comments/like', CommentsController.likingComments);
router.put('/comments', upCommentImage, CommentsController.updateComment);
router.delete('/comments/:id', CommentsController.deleteComment);

//------------------------------------------------------------------------------------------------------

export default router;