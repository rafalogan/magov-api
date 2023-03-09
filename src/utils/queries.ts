// import { ReadOptionsModel } from 'src/repositories/models';

export const categoryWithChildren = `WITH RECURSIVE subcategories (id) as (
    SELECT id FROM categories WHERE id = ?
    UNION ALL
    SELECT c.id FROM subcategories, categories c
    WHERE parent_id = subcategories.id
)
SELECT id FROM subcategories`;

const parserFieldsCategory = (fields: string[]) => fields.map(f => f.replace('parent_id as ', '').replace('user_id as ', '')).join(', ');

export const categoryWithChildrens = (fields: string[], where = 'id') => `WITH RECURSIVE subcategories (${parserFieldsCategory(
	fields
)}) as (
	SELECT * FROM categories WHERE ${where} = ?
	UNION ALL
SELECT c. * FROM subcategories, categories c
WHERE parent_id = subcategories.id
)
SELECT ${parserFieldsCategory(fields)} FROM subcategories`;

// export const eventsQuery = (fields: string[], options?: ReadOptionsModel) => `SELECT ${fields.join(', ')}
// FROM events as e
// LEFt OUTER JOIN ( SELECT * FROM files)
//     AS f ON f.event_id = e.id AND f.location = 'poster'
// ${options?.type ? `WHERE e.type = '${options.type}'` : ''}
//     ORDER BY ${options?.order?.by || 'e.id'} ${options?.order?.type || 'ASC'}
//     LIMIT ${options?.limit}
//     OFFSET ${Number(options?.page || 1) * Number(options?.limit || 10) - Number(options?.limit || 10)}`;

export const eventQuery = (fields: string[], id: number) => `SELECT ${fields.join(', ')}
FROM events as e
LEFT OUTER JOIN ( SELECT * FROM files)
AS f ON f.event_id = ${id}
WHERE e.id = ${id}`;
