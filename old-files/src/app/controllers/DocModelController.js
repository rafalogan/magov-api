import DocModel from "../models/DocModel.js";
import content from "./content.js";

class DocModelController {
    async index(req, res) {
        const docModel = await DocModel.findAll({
            order: ["id"],
            where: { active: true }
        });
        return res.json(content(docModel));
    }

    async getById(req, res) {
        const docModel = await DocModel.DocModel({
            where: { id: req.params.id, active: true }
        });

        return res.status(200).json(content(docModel));
    }

    async getByIdProposition(req, res) {

        const docModel = await DocModel.findOne({
            where: { proposition: req.params.id, active: true }
        });

        if (!docModel) {
            return res.status(404).json({ error: "Model document not found!" });
        }

        return res.status(200).json(content(docModel));
    }

    async store(req, res) {
        let data = req.body;

        data.active = true;
        data.created_at = new Date();
        data.updated_at = new Date();

        return res.json(await DocModel.create(data));
    }

    async update(req, res) {
        const body = req.body

        const docModel = await DocModel.findOne({ where: { proposition: req.params.id } });

        if (!docModel) {
            return res.status(404).json({ error: "Model document not found!" });
        }

        const objToUpdate = {
            id: docModel.id,
            title: body.title,
            html: body.html
        }

        console.log('OBJ: ', objToUpdate)

        return res.json(await docModel.update(objToUpdate));
    }
    s
    async delete(req, res) {
        const docModel = await DocModel.findOne({
            where: { id: req.params.id }
        });

        if (!docModel)
            return res
                .status(400)
                .json({ error: "Model document does not exists!" });

        await docModel.update({ active: false });
        // await person.destroy();
        return res.status(200).json({ message: "Model document deleted!" });
    }
}

export default new DocModelController();
