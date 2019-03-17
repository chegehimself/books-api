import chai from "chai";
import expect from "expect";

import { app, makeUser, removeAllUsers } from "../helpers/commons/base";
import books from "../../__mocks__/books";

chai.should();

const baseUrl = "/api/books/";
const userBaseUrl = "/api/users";

const apiGetAllBooks = () => app.get(`${baseUrl}/search`);
const apiListBooks = () => app.get(`${baseUrl}`);
const loginUser = async () => {
  const user = await makeUser();
  await app.post(userBaseUrl).send({
    user
  });
  app.login(user);
};
const searchBook = query => app.get(`${baseUrl}/search?=${query}`);
const fetPages = goodreadsId =>
  app.get(`${baseUrl}/fetchPages?goodreadsId=${goodreadsId}`);

describe("should be able to see a list of the books", () => {
  before(() => {
    app.close();
  });
  beforeEach(async () => {
    app.logout();
    await removeAllUsers();
  });
  it("should return a list of books", async () => {
    await app.loginRandom();
    const res = await apiGetAllBooks();
    res.status.should.equal(200);
    expect(res.body).toMatchObject({});
  });
  it("should fail to list books if the user not authenticated", async () => {
    const res = await apiGetAllBooks();
    res.status.should.equal(401);
    expect(res.body).toMatchObject({ errors: { global: "No token" } });
  });
  it("should fail to list books with expired token", async () => {
    await app.loginExpired();
    const res = await apiGetAllBooks();
    res.status.should.equal(401);
  });
  it("should get a list of all available books", async () => {
    await loginUser();
    const res = await apiListBooks();
    res.status.should.equal(200);
    expect(res.body).toMatchObject({});
  });
  it("should create a book", async () => {
    const book = books[0];
    await loginUser();
    const res = await app.post(baseUrl).send({ book });
    res.status.should.equal(201);
  });
  it("should fail to create a book with wrong data", async () => {
    await loginUser();
    const res = await app.post(baseUrl).send({});
    res.status.should.equal(400);
  });
  it("should search for a book properly", async () => {
    await loginUser();
    const res = await searchBook("t");
    res.status.should.equal(200);
    expect(res.body).toMatchObject({});
  });
  it("should fetch pages for a certain book", async () => {
    await loginUser();
    const book = await searchBook("t");
    const goodreadsId = book.body.books[0].goodreadsId;
    const res = await fetPages(goodreadsId);
    res.status.should.equal(200);
    expect(res.body).toMatchObject({ pages: {} });
  });
});
