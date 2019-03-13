import supertest from "supertest";
import faker from "faker";
import User from "../../../models/User";
import router from "../../../index";
import { generateInvalidToken, generateToken } from "./jwt";

faker.seed(5711);

/**
 * Create randomly generated user details.
 * Use the overrides object to override any of the randomly
 * generated fields.
 *
 * @param overrides
 * @returns {Promise<{user details}>}
 */
export const makeUser = async (overrides = {}, times = 1) => {
  const userData = [];
  /* eslint-disable no-plusplus */
  for (let i = 0; i < times; i++) {
    userData.push({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      username: `${faker.random.uuid()}-${faker.internet.userName()}`, // unique
      phone: faker.phone.phoneNumber("07########"),
      email: `${faker.internet.userName()}@test.com`, // unique
      password: faker.internet.password(),
      ...overrides
    });
  }

  return times === 1 ? userData[0] : userData;
};

/**
 * Use faker to generate random test data. All test helpers requiring fake data
 * should make use of this utility. Using "import faker from ';" on each
 * and every file where it is required has the potential to cause generation
 * of duplicate data. This can break tests in an unpredictable fashion
 * which is hard to debug.
 */
export { faker };

export const createUser = async (overrides = {}) => {
  const newUser = await makeUser(overrides);
  const { email, password } = newUser;
  const user = new User({ email });
  user.setPassword(password);
  user.setConfirmationToken();
  user.save();
  return user;
  // User.create(await makeUser(overrides));
};

/**
 * Removes all collections of specified model created by tests. This is to ensure
 * a test can be run without worrying about duplication or other likely
 * database inconsistencies.
 *
 * @param model
 * @returns {Promise<void>}
 */
export const removeAllCollections = async model => {
  await model.remove({});
};

/**
 * Removes all users created by tests. This helps to ensure a test
 * can be run from a clean start without risking unwanted duplicates and
 * other inconsistencies. This is very useful for tests that make use
 * of app.login(), app.loginRandom() and createUser()
 *
 *
 * @returns {Promise<void>}
 */
export const removeAllUsers = async () => {
  await removeAllCollections(User);
};

export class app {
  static token = null;

  static setAuthtokenHeader(request) {
    if (this.token) {
      request.set("authorization", `Bearer ${this.token}`);
    }
  }

  /**
   * Login a user
   *
   * @param userDetails
   * @returns {Object}
   */
  static async login(userDetails) {
    const { email } = userDetails;
    this.token = generateToken({ email });
  }

  /**
   * Login a randomly generated user that has and attaches
   * user to it.
   *
   * @returns {Promise<void>}
   */
  static async loginRandom() {
    const genUser = (await createUser()).toObject();
    this.token = generateToken(genUser.email);
  }

  /**
   * Login a user with an expired token
   *
   * @return {Promise<void>}
   */
  static async loginExpired() {
    const genUser = (await createUser()).toObject();
    this.token = generateInvalidToken({
      _id: genUser._id,
      email: genUser.email
    });
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
    this.setAuthtokenHeader(request);
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
    this.setAuthtokenHeader(request);
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
    this.setAuthtokenHeader(request);
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
    this.setAuthtokenHeader(request);
    return request;
  }
}
