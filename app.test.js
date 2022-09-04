require('dotenv').config()

const request = require("supertest")
const connection = require('./database/mysql')
const app = require("./app")

const dummyLongText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries"

const data = {
  first_name: 'john', 
  last_name: 'doe', 
  birthday: '2000-10-10', 
  email: 'test@email.com'
}

describe("Test the root path", () => {
  let id = ""

  beforeAll(done => {
    done()
  })

  afterAll(done => {
    connection.end()
    done()
  })

  test("It should get all user", async () => {
    const response = await request(app).get("/users")
    expect(response.statusCode).toBe(200)
  })

  test("It should create user", async () => {
    const response = await request(app).post("/users").send(data)
    console.log('response.body', response.body)

    id = response.body.data.id
    expect(response.body.status).toEqual(true)
  })

  test("It should failed create user because name to long", async () => {
    const response = await request(app).post("/users").send({ ...data, first_name: dummyLongText })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toEqual(false)
  })

  test("It should failed create user because wrong data", async () => {
    const response = await request(app).post("/users").send({ ...data, first_name: '', birthday: '2000-10' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toEqual(false)
  })

  test("It should update user", async () => {
    const response = await request(app).put(`/users/${id}`).send(data)

    id = response.body.data.id
    expect(response.body.status).toEqual(true)
  })

  test("It should failed update user because id not found", async () => {
    const response = await request(app).put(`/users/-1`).send(data)
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toEqual(false)
  })

  test("It should failed update user because name to long", async () => {
    const response = await request(app).put(`/users/${id}`).send({ ...data, first_name: dummyLongText })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toEqual(false)
  })

  test("It should failed update user because wrong data", async () => {
    const response = await request(app).put(`/users/${id}`).send({ ...data, first_name: '', birthday: '10-10' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toEqual(false)
  })

  test("It should get detail user", async () => {
    const response = await request(app).get(`/users/${id}`)
    expect(response.body.status).toEqual(true)
  })

  test("It should failed get detail user because id not found", async () => {
    const response = await request(app).get(`/users/-1`)
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toEqual(false)
  })

  test("It should failed get detail user because id not number", async () => {
    const response = await request(app).get(`/users/test`)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toEqual(false)
  })

  test("It should delete user", async () => {
    const response = await request(app).delete(`/users/${id}`)
    expect(response.body.status).toEqual(true)
  })

  test("It should failed delete user because id not found", async () => {
    const response = await request(app).delete(`/users/-1`)
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toEqual(false)
  })

  test("It should failed delete user because id not number", async () => {
    const response = await request(app).delete(`/users/test`)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toEqual(false)
  })

  test("It should not found", async () => {
    const response = await request(app).delete(`/found`)
    expect(response.statusCode).toBe(404)
  })
})
