const { getUniqueId } = require("./api");

test("get unique id without param", () => {
  getUniqueId().then((val) => expect(val.length).toBe(36));
});
test("get unique id back when param is present", () => {
  getUniqueId("eg").then((val) => expect(val).toBe("eg"));
});
