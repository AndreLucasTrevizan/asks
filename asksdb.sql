use asksdb;

use asksdb;

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

insert into roles (`role_description`, `createdAt`, `updatedAt`) values ('Administrator', current_timestamp(), current_timestamp());
insert into roles (`role_description`, `createdAt`, `updatedAt`) values ('Common', current_timestamp(), current_timestamp());

select * from users;