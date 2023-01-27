import {
    describe,
    test,
    expect
} from '@jest/globals'
import superTest from 'supertest'
import app from '../app.js'

describe('API TESTE - Person Controller', () => {
    test('Get / Must fetch all items in person table', async () => {
        const response = await superTest(app)
            .get('/people')

        const data = JSON.parse(response.text)
        expect(data).toBeInstanceOf(Object)
        console.log('text', response.text)
    })
    test('GetById / Must fetch an item from the person table', async () => {
        const response = await superTest(app)
            .get('/people/2')

        const data = JSON.parse(response.text)
        expect(data).toBeInstanceOf(Object)
        console.log('Getting user by ID', response.text)
    })

    test('Store / Must insert an item into the person table', async () => {
        const response = await superTest(app)
            .post('/people')
            .send({
                name: 'Test.JS Metodo Post',
                birth_date: '2022-04-19',
                address: 1,
            });

        // const expectedResponse = Object
        const data = JSON.parse(response.text)
        expect(data).toBeInstanceOf(Object)
        console.log('registered successfully', response.text)
    })
    test('Update / Must update an item in the person table', async () => {
        const response = await superTest(app)
            .put('/people/52')
            .send({
                name: 'Victor Cassio Viana Luz',
                birth_date: '2020-05-12',
            });

        const data = JSON.parse(response.text)
        expect(data).toBeInstanceOf(Object)
        console.log('successfully updated', response.text)
    });
    test('Delete / Must delete an item in person table', async () => {
        const response = await superTest(app)
            .put('/people/52')
            .send({
                active: 0
            });

        const expectedResponse = {
            active: 0,
        }
        const data = JSON.parse(response.text)
        expect(data).toEqual(expect.objectContaining(expectedResponse))
        console.log('successfully deleted', response.text)
    })
});
