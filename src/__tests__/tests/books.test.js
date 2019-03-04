import chai from "chai";
import expect from "expect";

import { app } from "../helpers/commons/base";

chai.should();

const baseUrl = "/api/books/";
const apiGetAllBooks = () => app.get(`${baseUrl}/search`);

describe("should be able to see a list of the books", () => {
  it("should return a list of books", async () => {
    const res = await apiGetAllBooks();
    res.status.should.equal(200);
    expect(res.body).toMatchObject({});
  });
});
