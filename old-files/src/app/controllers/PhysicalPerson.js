import Person from '../models/Person.js';
import PhysicalPerson from '../models/PhysicalPerson.js';
import content from './content.js';
import utils from './utils.js';

class PhysicalPersonController {

	async index(req, res) {
		let include = [
            utils.include(Person, {
                active: true
            }),       
        ];

		const people = await PhysicalPerson.findAll({
			order: ['id'],
			where: { active: true },
			include
		});
		return res.json(
			content(people)
		);
	}
}

export default new PhysicalPersonController();
