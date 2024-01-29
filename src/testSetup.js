import {TestUtils} from "./testUtils.js";

beforeAll(async () => {
    await TestUtils.startDB();
});

// afterAll(async () => {
//     await TestUtils.destroySqlDb();
// });
