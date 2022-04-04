create table roles(
    id int not null auto_increment,
    role_description varchar(100) unique,
    createdAt timestamp,
    updatedAt timestamp,
    primary key (id)
);

create table users(
    id int not null auto_increment,
    avatar varchar(150),
    firstname varchar(20),
    lastname varchar(50),
    email varchar(50) unique,
    user_password varchar(250),
    user_status boolean,
    id_role int not null,
    createdAt timestamp,
    updatedAt timestamp,
    primary key (id),
    constraint fk_user_role foreign key (id_role) references roles(id)
);

create table posts(
    id int not null auto_increment,
    post_description text,
    post_image varchar(150),
    id_user int not null,
    createdAt timestamp,
    updatedAt timestamp,
    primary key (id),
    constraint fk_post_user foreign key (id_user) references users(id)
);

create table friendships(
    id int not null auto_increment,
    id_user int not null,
    id_friend int not null default 0,
    createdAt timestamp,
    updatedAt timestamp,
    primary key (id),
    constraint fk_friend foreign key (id_user) references users(id)
);

create table post_likes(
    id int not null auto_increment,
    id_user int not null,
    id_post int not null,
    createdAt timestamp,
    updatedAt timestamp,
    primary key (id),
    constraint fk_user_liked_post foreign key (id_user) references users(id),
    constraint fk_post_liked foreign key (id_post) references posts(id)
);

create table comments(
    id int not null auto_increment,
    comment_description text,
    comment_image varchar(150),
    id_user int not null,
    id_post int not null,
    createdAt timestamp,
    updatedAt timestamp,
    primary key (id),
    constraint fk_user_comment foreign key (id_user) references users(id),
    constraint fk_post_comment foreign key (id_post) references posts(id)
);

create table comment_likes(
    id int not null auto_increment,
    id_user int not null,
    id_comment int not null,
    createdAt timestamp,
    updatedAt timestamp,
    primary key (id),
    constraint fk_user_liked_comment foreign key (id_user) references users(id),
    constraint fk_comment_liked foreign key (id_comment) references comments(id)
);

-- User Procedures ------------------------------------------------------------------------------------

delimiter $$
create procedure InsertUsers(
    avatar varchar(150),
    firstname varchar(20),
    lastname varchar(50),
    email varchar(50),
    user_password varchar(250),
    user_status boolean,
    id_role int
)
begin
    insert into users (
        `avatar`,
        `firstname`,
        `lastname`,
        `email`,
        `user_password`,
        `user_status`,
        `id_role`,
        `createdAt`,
        `updatedAt`
    ) values (
        avatar, firstname, lastname, email, user_password, user_status, id_role, current_timestamp(), current_timestamp()
    );
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure UpdateUser(
	p_firstname varchar(20),
    p_lastname varchar(50),
    p_email varchar(50),
    p_id int
)
begin
	update asksdb.users
    set
    firstname = p_firstname,
    lastname = p_lastname,
    email = p_email,
    updatedAt = current_timestamp()
    where id = p_id;
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure GetAvatarFromUserById(p_id int)
begin
	select avatar from users where id = p_id;
end $$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure UpdateAvatarFromUserById(p_avatar varchar(150), p_id int)
begin
	update users
    set avatar = p_avatar
    where id = p_id;
end$$
delimiter ;

--------------------------------------------------------------------------------------------------------

delimiter $$
create procedure DeleteUser(p_id int)
begin 
	delete from users where id = p_id;
end $$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure ReportUsers()
begin
	SELECT
		users.id as id,
		users.firstname as firstname,
		users.lastname as lastname,
		concat(users.firstname, ' ', users.lastname) as name,
		users.email as email,
		roles.id as id_role,
		roles.role_description as role,
		users.createdAt as created_at,
		users.updatedAt as last_update
	FROM users INNER JOIN roles ON users.id_role = roles.id;
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure GetUserByEmail(p_email varchar(50))
begin
	select
		firstname,
        lastname,
        email,
        user_password,
        id_role
	from users where email = p_email;
end$$
delimiter ;
-- ------------------------------------------------------------------------------------------------------
-- Roles Procedures -------------------------------------------------------------------------------------

delimiter $$
create procedure InsertRoles(role_description varchar(100))
begin
    insert into roles (
		`role_description`,
        `createdAt`,
        `updatedAt`)
	values (role_description, current_timestamp(), current_timestamp());
end$$
delimiter ;

call InsertRoles('Administrator');
call InsertRoles('Common');

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure ReportRoles()
begin
	select * from roles;
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure UpdateRole(
    p_role_description varchar(100),
    p_id int
)
begin
    update role set
        role_description = p_role_description,
        updatedAt = current_timestamp()
    where id = p_id;
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure DeleteRole(p_id int)
begin
    delete from roles where id = p_id;
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------
-- Posts Procedures -------------------------------------------------------------------------------------

delimiter $$
create procedure CreatePost(
    p_post_description text,
    p_post_image varchar(150),
    p_id_user int
)
begin
    insert into posts (
        post_description,
        post_image,
        id_user,
        createdAt,
        updatedAt
    ) values (
        p_post_description,
        p_post_image,
        p_id_user,
        current_timestamp(),
        current_timestamp()
    );
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure UpdatePost(
    p_post_description text,
    p_post_image varchar(150),
    p_id int
)
begin
    update posts set
        post_description = p_post_description,
        post_image = p_post_image,
        updatedAt = current_timestamp()
        where id = p_id;
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure DeletePost(p_id int)
begin
    delete from posts where id = p_id;
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure GetImageOfPostById(p_id int)
begin
    select post_image from posts where id = p_id;
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure ReportPosts(p_id_user int)
begin
	SELECT 
		posts.post_description as post_description,
		posts.post_image as post_image,
		concat(users.firstname, ' ', users.lastname) as posted_by,
		posts.createdAt as createdAt,
		posts.updatedAt as updatedAt
	FROM posts
		INNER JOIN users ON posts.id_user = users.id
		INNER JOIN friendships ON friendships.id_friend = users.id
	WHERE friendships.id_user = p_id_user AND posts.id_user = friendships.id_friend;
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure LikingPost(p_id_user int, p_id_post int)
begin
    insert into post_likes (
        id_user,
        id_post,
        createdAt,
        updatedAt
    ) values (
        p_id_user,
        p_id_post,
        current_timestamp(),
        current_timestamp()
    );
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure UnlikingPost(p_id_user int)
begin
    delete from post_likes where id_user = p_id_user;
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure GetAllLikesOfUser(p_id_user int)
begin
    select * from post_likes where id_user = p_id_user;
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------
-- Friends Procedures -----------------------------------------------------------------------------------

delimiter $$
create procedure ReportFriendsOfUser(p_id_user int)
begin
    SELECT
        users.id as id,
        concat(users.firstname, ' ', users.lastname) as name
    FROM users
    INNER JOIN friendships ON friendships.id_user = p_id_user AND friendships.id_friend = users.id;
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure AddingFriend(p_id_user int, p_id_friend int)
begin
    INSERT INTO friendships (
        id_user,
        id_friend,
        createdAt,
        updatedAt
    ) VALUES (
        p_id_user,
        p_id_friend,
        current_timestamp(),
        current_timestamp()
    );
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure RemovingFriend(p_id int)
begin
    delete from friendships where id = p_id;
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------
-- Comments Procedures ----------------------------------------------------------------------------------

delimiter $$
create procedure CreatingComment(
    p_comment_description text,
    p_comment_image varchar(150),
    p_id_user int,
    p_id_post int
)
begin
    insert into comments (
        comment_description,
        comment_image,
        id_user,
        id_post,
        createdAt,
        updatedAt
    ) values (
        p_comment_description,
        p_comment_image,
        p_id_user,
        p_id_post,
        current_timestamp(),
        current_timestamp()
    );
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure GettingLikesOfCommentByUser(p_id_user int)
begin
    select * from comment_likes where id_user = p_id_user;
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure RemovingLikeOfComment(p_id_user int)
begin
    delete from comment_likes where id_user = p_id_user;
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure LikingComment(p_id_user int, p_id_comment int)
begin
    INSERT INTO comment_likes (
        id_user,
        id_comment
    ) VALUES (
        p_id_user,
        p_id_comment,
        current_timestamp(),
        current_timestamp()
    );
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure ReportCommentsOfPost(p_id_post int)
begin
    select * from comments where id_post = p_id_post;
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure UpdateComment(
    p_comment_description text,
    p_comment_image varchar(150),
    p_id int
)
begin
    update comments set
        comment_description = p_comment_description,
        comment_image = p_comment_image,
        updatedAt = current_timestamp()
        where id = p_id;
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure GetCommentImage(p_id int)
begin
    select comment_image from comments where id = p_id;
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------

delimiter $$
create procedure DeleteComment(p_id int)
begin
    delete from comments where id = p_id;
end$$
delimiter ;

-- ------------------------------------------------------------------------------------------------------