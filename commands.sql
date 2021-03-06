drop table UserTeachers;
create table UserTeachers (
    user_id int auto_increment,
    username varchar(100) not null unique,
    first_name varchar(255) not null,
    last_name varchar(255) not null,
    church_name varchar(255) not null,
    church_address varchar(255) not null,
    email varchar(255) not null unique,
    hashed_password varchar(255) not null,
    path_to_profile_pic varchar(255),
    primary key (user_id)
);