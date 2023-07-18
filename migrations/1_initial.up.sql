--
-- create schema
create schema if not exists blog;
--
-- uuid extension
create extension if not exists "uuid-ossp" schema blog;
--
-- set search path
set search_path to blog;
--
-- update timestamp function
create or replace function update_timestamp() returns trigger as
$$
begin
    new.updated_at = current_timestamp;
    return new;
end;
$$ language plpgsql;
--
-- users table
create table if not exists users
(
    id         uuid        not null default blog.blog.uuid_generate_v4() primary key,
    first_name text        not null,
    last_name  text        not null,
    email      text        not null,
    username   text        not null,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp,
    unique (email)
);
create or replace trigger update_users_timestamp
    before
        update
    on users
    for each row
execute function update_timestamp();
--
-- user_credentials table
create table if not exists user_credentials
(
    id          uuid        not null default blog.blog.uuid_generate_v4() primary key,
    user_id     uuid        not null references users (id) on delete cascade,
    secret_data text        not null,
    algorithm   text        not null,
    expires_at  timestamptz,
    created_at  timestamptz not null default current_timestamp,
    updated_at  timestamptz not null default current_timestamp
);
create or replace trigger update_user_credentials_timestamp
    before
        update
    on user_credentials
    for each row
execute function update_timestamp();
--
-- api_keys table
create table if not exists api_keys
(
    id         uuid        not null default blog.blog.uuid_generate_v4() primary key,
    user_id    uuid        not null references users (id) on delete cascade,
    api_key    text        not null,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp
);
create or replace trigger update_api_keys_timestamp
    before
        update
    on api_keys
    for each row
execute function update_timestamp();
--
-- sessions table
create table if not exists sessions
(
    id            uuid        not null default blog.blog.uuid_generate_v4() primary key,
    user_id       uuid        not null references users (id) on delete cascade,
    session_state text        not null,
    created_at    timestamptz not null default current_timestamp,
    updated_at    timestamptz not null default current_timestamp
);
create or replace trigger update_sessions_timestamp
    before
        update
    on sessions
    for each row
execute function update_timestamp();
--
-- permissions table
create table if not exists permissions
(
    id              uuid        not null default blog.blog.uuid_generate_v4() primary key,
    permission_name text        not null,
    scopes          text[]      not null,
    created_at      timestamptz not null default current_timestamp,
    updated_at      timestamptz not null default current_timestamp,
    unique (permission_name)
);
create or replace trigger update_permissions_timestamp
    before
        update
    on permissions
    for each row
execute function update_timestamp();
--
-- roles table
create table if not exists roles
(
    id         uuid        not null default blog.blog.uuid_generate_v4() primary key,
    role_name  text        not null,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp,
    unique (role_name)
);
create or replace trigger update_roles_timestamp
    before
        update
    on roles
    for each row
execute function update_timestamp();
--
-- role_permission_mapping table
create table if not exists role_permission_mappings
(
    id            uuid        not null default blog.blog.uuid_generate_v4() primary key,
    role_id       uuid        not null references roles (id) on delete cascade,
    permission_id uuid        not null references permissions (id) on delete cascade,
    created_at    timestamptz not null default current_timestamp,
    updated_at    timestamptz not null default current_timestamp
);
create or replace trigger update_role_permission_mapping_timestamp
    before
        update
    on role_permission_mappings
    for each row
execute function update_timestamp();
--
-- groups table
create table if not exists groups
(
    id         uuid        not null default blog.blog.uuid_generate_v4() primary key,
    group_name text        not null,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp,
    unique (group_name)
);
create or replace trigger update_groups_timestamp
    before
        update
    on groups
    for each row
execute function update_timestamp();
--
-- group_role_mappings table
create table if not exists group_role_mappings
(
    id         uuid        not null default blog.blog.uuid_generate_v4() primary key,
    role_id    uuid        not null references roles (id) on delete cascade,
    group_id   uuid        not null references groups (id) on delete cascade,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp
);
create or replace trigger update_group_role_mappings_timestamp
    before
        update
    on group_role_mappings
    for each row
execute function update_timestamp();
--
-- group_permission_mappings table
create table if not exists group_permission_mappings
(
    id            uuid        not null default blog.blog.uuid_generate_v4() primary key,
    permission_id uuid        not null references permissions (id) on delete cascade,
    group_id      uuid        not null references groups (id) on delete cascade,
    created_at    timestamptz not null default current_timestamp,
    updated_at    timestamptz not null default current_timestamp
);
create or replace trigger update_group_permission_mappings_timestamp
    before
        update
    on group_permission_mappings
    for each row
execute function update_timestamp();
--
-- user_roles table
create table if not exists user_role_mappings
(
    id         uuid        not null default blog.uuid_generate_v4() primary key,
    user_id    uuid        not null references users (id) on delete cascade,
    role_id    uuid        not null references roles (id) on delete cascade,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp
);
create or replace trigger update_user_role_mappings_timestamp
    before
        update
    on user_role_mappings
    for each row
execute function update_timestamp();
--
-- user_group_mappings table
create table if not exists user_group_mappings
(
    id         uuid        not null default blog.uuid_generate_v4() primary key,
    user_id    uuid        not null references users (id) on delete cascade,
    group_id   uuid        not null references groups (id) on delete cascade,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp
);
create or replace trigger update_user_group_mappings_timestamp
    before
        update
    on user_group_mappings
    for each row
execute function update_timestamp();
--
-- user_permission_mappings table
create table if not exists user_permission_mappings
(
    id            uuid        not null default blog.uuid_generate_v4() primary key,
    user_id       uuid        not null references users (id) on delete cascade,
    permission_id uuid        not null references permissions (id) on delete cascade,
    created_at    timestamptz not null default current_timestamp,
    updated_at    timestamptz not null default current_timestamp
);
create or replace trigger update_user_permission_mappings_timestamp
    before
        update
    on user_permission_mappings
    for each row
execute function update_timestamp();
--
-- api_key_permission_mappings table
create table if not exists api_key_permission_mappings
(
    id            uuid        not null default blog.uuid_generate_v4() primary key,
    api_key_id    uuid        not null references api_keys (id) on delete cascade,
    permission_id uuid        not null references permissions (id) on delete cascade,
    created_at    timestamptz not null default current_timestamp,
    updated_at    timestamptz not null default current_timestamp
);
create or replace trigger update_api_key_permission_mappings_timestamp
    before
        update
    on api_key_permission_mappings
    for each row
execute function update_timestamp();
--
-- posts table
create table if not exists posts
(
    id         uuid        not null default blog.uuid_generate_v4() primary key,
    user_id    uuid        not null references users (id) on delete cascade,
    title      text        not null,
    content    text        not null,
    read_time  text        not null,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp
);
create or replace trigger update_posts_timestamp
    before
        update
    on posts
    for each row
execute function update_timestamp();
--
-- tags table 
create table if not exists tags
(
    id         uuid        not null default blog.uuid_generate_v4() primary key,
    tag_name   text        not null,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp,
    unique (tag_name)
);
create or replace trigger update_tags_timestamp
    before
        update
    on tags
    for each row
execute function update_timestamp();
--
-- post_tags table
create table if not exists post_tags
(
    id         uuid        not null default blog.uuid_generate_v4() primary key,
    post_id    uuid        not null references posts (id) on delete cascade,
    tag_id     uuid        not null references tags (id) on delete cascade,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp
);
create or replace trigger update_post_tags_timestamp
    before
        update
    on post_tags
    for each row
execute function update_timestamp();
--
-- post_likes table
create table if not exists post_likes
(
    id         uuid        not null default blog.uuid_generate_v4() primary key,
    user_id    uuid        not null references users (id) on delete cascade,
    post_id    uuid        not null references posts (id) on delete cascade,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp
);
create or replace trigger update_post_likes_timestamp
    before
        update
    on post_likes
    for each row
execute function update_timestamp();
--
-- comments table
create table if not exists comments
(
    id         uuid        not null default blog.uuid_generate_v4() primary key,
    user_id    uuid        not null references users (id) on delete cascade,
    post_id    uuid        not null references posts (id) on delete cascade,
    parent_id  uuid references comments (id) on delete cascade,
    content    text        not null,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp
);
create or replace trigger update_comments_timestamp
    before
        update
    on comments
    for each row
execute function update_timestamp();
--
-- user_comments table
create table if not exists comment_likes
(
    id         uuid        not null default blog.uuid_generate_v4() primary key,
    user_id    uuid        not null references users (id) on delete cascade,
    comment_id uuid        not null references comments (id) on delete cascade,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp
);
create or replace trigger update_comments_likes_timestamp
    before
        update
    on comment_likes
    for each row
execute function update_timestamp();
--
-- default permissions
insert into permissions (permission_name, scopes)
values ('default_read',
        '{"users:read", "posts:read", "comments:read", "likes:read"}'),
       ('default_write',
        '{"comments:create", "comments:edit", "comments:delete", "likes:create", "likes:edit"}'),
       ('admin_read', '{}'),
       ('admin_write',
        '{"posts:create", "posts:edit", "posts:delete", "posts:create-private"}');
--
-- default role
insert into roles (role_name)
values ('default_user');
--
-- add default permissions to default role
with default_permissions as (select id
                             from permissions
                             where permissions.permission_name like 'default%')
insert
into role_permission_mappings(permission_id, role_id)
select distinct default_permissions.id,
                (select id
                 from roles
                 where roles.role_name like 'default%')
from default_permissions;
--
-- default group 
insert into groups (group_name)
values ('default');
--
-- add default role to default group
with default_roles as (select id
                       from roles
                       where roles.role_name like 'default%')
insert
into group_role_mappings (role_id, group_id)
select distinct default_roles.id,
                (select id
                 from groups
                 where groups.group_name like 'default%')
from default_roles;