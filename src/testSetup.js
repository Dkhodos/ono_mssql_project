import {TestUtils} from "./testUtils.js";

beforeAll(async () => {
    await TestUtils.startDB();
});

beforeEach(async () => {
   await TestUtils.initSqlDB();
});

afterAll(async () => {
    await TestUtils.destroySqlDb();
});

afterEach(async () => {
   await TestUtils.clearSqlDb();
});
