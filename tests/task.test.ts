import request from 'supertest';
import { expect } from 'chai';
import { app } from './../index';

// Define your tests using Mocha and Chai
describe('Task API', () => {

    it('should create a new task', async () => {
        const response = await request(app)
            .post('/api/task')
            .send({
                "title": "Task 1",
                "description": "description",
                "creationDate": "12-08-2023",
                "dueDate": "13-08-2023",
                "assignedTo": "Ahmad",
                "category": "home work",
                "status": "Pending"
            });
        expect(response.status).to.equal(201);
        expect(response.body.id).to.be.a('string');
    });

    it('should retrieve a task by its ID', async () => {
        // First, create a task
        const createResponse = await request(app)
            .post('/api/task')
            .send({
                "title": "Task 2",
                "description": "description",
                "creationDate": "12-08-2023",
                "dueDate": "13-08-2023",
                "assignedTo": "Yasir",
                "category": "Office Work",
                "status": "Pending"
            });

        //console.log("Task created: ", createResponse.body);
        // Then, retrieve it by ID
        const taskId = createResponse.body.id;
        const response = await request(app).get(`/api/task/${taskId}`);

        expect(response.status).to.equal(200);
        expect(response.body.id).to.equal(taskId);
    });

    it('should update a specific task', async () => {
        // First, create a task
        const createResponse = await request(app)
            .post('/api/task')
            .send({
                "title": "Task 3",
                "description": "description",
                "creationDate": "12-08-2023",
                "dueDate": "13-08-2023",
                "assignedTo": "Yousaf",
                "category": "Office Work",
                "status": "Pending"
            });

        // Then, update it
        const taskId = createResponse.body.id;
        const updateResponse = await request(app)
            .put(`/api/task/${taskId}`)
            .send({
                "description": "description updated"
            });

        expect(updateResponse.status).to.equal(200);
        expect(updateResponse.body.id).to.equal(taskId);
        expect(updateResponse.body.description).to.equal('description updated');
    });

    it('should delete a specific task', async () => {
        // First, create a task
        const createResponse = await request(app)
            .post('/api/task')
            .send({
                "title": "Task 4",
                "description": "description",
                "creationDate": "12-08-2023",
                "dueDate": "13-08-2023",
                "assignedTo": "Yousaf",
                "category": "Office Work",
                "status": "Pending"
            });

        // Then, delete it
        const taskId = createResponse.body.id;
        const deleteResponse = await request(app).delete(`/api/task/${taskId}`);

        expect(deleteResponse.status).to.equal(200);
        expect(deleteResponse.body.message).to.equal('Task deleted');
    });

    it('should retrieve all tasks', async () => {
        const response = await request(app).get('/api/tasks');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });

    it('should retrieve all tasks assigned to a specific user', async () => {
        const assignedTo = 'Yousaf';
        // Create a task assigned to the user
        await request(app)
            .post('/api/task')
            .send({
                "title": "Task 4",
                "description": "description",
                "creationDate": "12-08-2023",
                "dueDate": "13-08-2023",
                "assignedTo": "Yousaf",
                "category": "Office Work",
                "status": "Pending"
            });

        // Make a request to retrieve tasks assigned to the user
        const response = await request(app).get('/api/tasks').query({ assignedTo });
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });

    it('should retrieve all tasks under a specific category', async () => {
        const category = 'Office Work';
        // Create a task under the category
        await request(app)
            .post('/api/task')
            .send({
                "title": "Task 4",
                "description": "description",
                "creationDate": "12-08-2023",
                "dueDate": "13-08-2023",
                "assignedTo": "Yousaf",
                "category": "Office Work",
                "status": "Pending"
            });

        // Make a request to retrieve tasks in the category
        const response = await request(app).get('/api/tasks').query({ category });

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });
});

