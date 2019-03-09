import chai from "chai";
import expect from "expect";

import { app } from "../helpers/commons/base";

chai.should();

const baseUrl = "/api/books/";
const apiGetAllBooks = () => app.get(`${baseUrl}/search`);

describe("should be able to see a list of the books", () => {
  beforeEach(() => {
    app.logout();
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
});
