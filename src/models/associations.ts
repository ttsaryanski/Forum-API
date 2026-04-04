// This file defines all model associations to avoid circular import issues

import User from "./User.js";
import Theme from "./Theme.js";
import Comment from "./Comment.js";
import Like from "./Like.js";
import Category from "./Category.js";
import Message from "./messages.js";

// User - Theme relations
Theme.belongsTo(User, {
    as: "author",
    foreignKey: "author_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});

User.hasMany(Theme, {
    as: "themes",
    foreignKey: "author_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});

// User - Comment relations
Comment.belongsTo(User, {
    as: "author",
    foreignKey: "author_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});
User.hasMany(Comment, { foreignKey: "author_id" });

// User - Like relations
Like.belongsTo(User, {
    foreignKey: "user_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});
User.hasMany(Like, { foreignKey: "user_id" });

// Theme - Comment relations
Comment.belongsTo(Theme, {
    as: "theme",
    foreignKey: "theme_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});
Theme.hasMany(Comment, { as: "Comments", foreignKey: "theme_id" });

// Theme - Like relations
Like.belongsTo(Theme, {
    foreignKey: "theme_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});
Theme.hasMany(Like, { foreignKey: "theme_id" });

// Theme - Category relations
Theme.belongsTo(Category, {
    as: "category",
    foreignKey: "category_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});

Category.hasMany(Theme, {
    as: "themes",
    foreignKey: "category_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});

// Message - User relations
Message.belongsTo(User, {
    as: "author",
    foreignKey: "author_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});
User.hasMany(Message, { foreignKey: "author_id" });

// Message - Category relations
Message.belongsTo(Category, {
    as: "category",
    foreignKey: "category_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});
Category.hasMany(Message, { as: "messages", foreignKey: "category_id" });

// Comment - Comment relations (self-referencing for replies)
Comment.belongsTo(Comment, {
    as: "parent",
    foreignKey: "parent_comment_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});
Comment.hasMany(Comment, { as: "replies", foreignKey: "parent_comment_id" });

// Comment - Like relations
Comment.hasMany(Like, {
    as: "likes",
    foreignKey: "comment_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});
Like.belongsTo(Comment, {
    foreignKey: "comment_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});

Like.belongsTo(Comment, {
    foreignKey: "comment_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});
Comment.hasMany(Like, { foreignKey: "comment_id" });

export { User, Theme, Comment, Like, Category };
