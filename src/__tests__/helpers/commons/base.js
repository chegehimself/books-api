import supertest from "supertest";
import express from "express";
import faker from "faker";
import User from "../../../models/User";
import router from "../../../";

faker.seed(5711);

/**
 * Create randomly generated user details.
 * Use the overrides object to override any of the randomly
 * generated fields.
 *
 * @param overrides
 * @returns {Promise<{user details}>}
 */
export const makeUser = async (overrides = {}) => {
  const data = {
    email: faker.internet.email(), // unique
    password: faker.internet.password()
  };

  return { ...data, ...overrides };
};

/**
 * Use faker to generate random test data. All test helpers requiring fake data
 * should make use of this utility. Using "import faker from ';" on each
 * and every file where it is required has the potential to cause generation
 * of duplicate data. This can break tests in an unpredictable fashion
 * which is hard to debug.
 */
export { faker };

export const createUser = async (overrides = {}) =>
  User.create(await makeUser(overrides));

export class app {
  static token = null;

  /**
   * Login a user by passing an existing user object. Also, specify the user
   * permissions. Behind the scenes it creates a group with the permissions
   * and attaches the user to it.
   *
   * @param user
   * @returns {Promise<void>}
   */
  static async login(userData, permissions = []) {
    const group = await createGroup(permissions);
    const user = userData;
    user.groups = [group._id];
    user.save();
    this.token = generateToken(user.toObject());
  }

  /**
   * Login a randomly generated user that has the permissions provided. Behind
   * the scenes it creates a group with the permissions and attaches the
   * user to it.
   *
   * @param permissions
   * @returns {Promise<void>}
   */
  static async loginRandom(permissions = []) {
    this.token = generateToken((await createUser(permissions)).toObject());
  }

  /**
   * Call this method to logout the currently logged in user.
   */
  static logout() {
    this.token = null;
  }

  static app = supertest(router);

  /**
   * Make a get request with the authorization header (token) set if a user is
   * logged in.
   *
   * @param url
   * @returns {*}
   */
  static get(url) {
    const request = this.app.get(url);

    if (this.token) {
      return request.set("authorization", `Bearer ${this.token}`);
    }
    return request;
  }

  /**
   * Make a post request with the authorization header (token) set if a user is
   * logged in.
   *
   * @param url
   * @returns {*}
   */
  static post(url) {
    const request = this.app.post(url);

    if (this.token) {
      return request.set("authorization", `Bearer ${this.token}`);
    }
    return request;
  }

  /**
   * Make a put request with the authorization header (token) set if a user is
   * logged in.
   *
   * @param url
   * @returns {*}
   */
  static put(url) {
    const request = this.app.put(url);

    if (this.token) {
      return request.set("authorization", `Bearer ${this.token}`);
    }

    return request;
  }

  /**
   * Make a delete request with the authorization header (token) set if a user is
   * logged in.
   *
   * @param url
   * @returns {*}
   */
  static delete(url) {
    const request = this.app.delete(url);

    if (this.token) {
      return request.set("authorization", `Bearer ${this.token}`);
    }

    return request;
  }
}
