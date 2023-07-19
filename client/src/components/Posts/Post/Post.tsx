import React from "react";

export type PostProps = {
    id: string;
    title: string;
    imageURI: string;
    author: string;
    content: string;
    readTime: string;
    createdAt: string;
}

const Post: React.FC<PostProps> = ({ id, title, author, content, readTime, createdAt }) => {
    return <div></div>;
};