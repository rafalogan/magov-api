import PropositionDocument from '../models/PropositionDocument.js';
import content from './content.js';

class PropositionDocumentController {

    async index(req, res) {
        const propositionDocument = await PropositionDocument.findAll({
            order: ['id'],
            where: { active: true }
        });
        return res.json(
            content(propositionDocument)
        );
    }


}

export default new PropositionDocumentController();
