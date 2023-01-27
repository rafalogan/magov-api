import Menu from '../models/Menu.js';
import UserMenu from '../models/UserMenu.js';
import content from './content.js';
import utils from './utils.js';

class MenuController {

	async index(req, res) {
		try {

			let include = [
				utils.include(Menu, null, true, null, null, 'children')
			];

			const menus = await Menu.findAll({
				order: ['name'],
				include: include
			});

			if (req.query && req.query.usuario) {
				let user_menus = await UserMenu.findAll({
					where: { user: req.query.usuario }
				});

				menus.map(i => {
					i.children.map(iChildren => {
						let permission_read = false;
						let permission_write = false;
						let permission_delete = false;
						let id = null;
						user_menus.map(jChildren => {
							if (iChildren.id === jChildren.menu) {
								permission_read = jChildren.permission_read;
								permission_write = jChildren.permission_write;
								permission_delete = jChildren.permission_delete;
								id = jChildren.id;
							}
						});
						return iChildren.dataValues = {
							id: id,
							icon: iChildren.icon,
							menu: iChildren.id,
							name: iChildren.name,
							url: iChildren.url,
							permission_read,
							permission_write,
							permission_delete
						};
					});
				});

			}

			return res.status(200).json(
				content(menus)
			);
		} catch (e) {
			console.log(e)
		}

	}
}

export default new MenuController();
