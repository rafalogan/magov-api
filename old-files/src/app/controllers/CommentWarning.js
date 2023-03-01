import CommentWarning from "../models/CommentWarning.js";
import database from "../../database/index.js";
import { Op, Sequelize } from "sequelize";
const sequelize = database.connection;

class CommentWarningController {
    async index(req, res) {
        const commentWarning = await CommentWarning.findAll({
            order: ["id"],
            where: { active: true }
        });
        return res.json();
    }

    async getById(req, res) {
        const commentWarning = await CommentWarning.findOne({
            where: { id: req.params.id, active: true }
        });

        return res.status(200).json({
            commentWarning
        });
    }

    async store(req, res) {
        const data = req.body;

        const commentWarning_obj = {
            task: data.task,
            comment: data.comment,
            active: true,
            created_at: new Date(),
            updated_at: new Date()
        };

        return res.json(await CommentWarning.create(commentWarning_obj));
    }

    async update(req, res) {
        const commentWarning = await CommentWarning.findByPk(req.params.id);

        if (!commentWarning) {
            return res.status(404).json({ error: "Comment not found!" });
        }

        return res.json(await commentWarning.update(req.body));
    }

    async delete(req, res) {
        const commentWarning = await commentWarning.findOne({
            where: { id: req.params.id }
        });

        if (!commentWarning)
            return res
                .status(400)
                .json({ error: "This comment does not exists!" });

        await commentWarning.update({ active: false });

        return res
            .status(200)
            .json({ message: "Comment successfully deleted!" });
    }
}

export default new CommentWarningController();
