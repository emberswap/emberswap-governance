const packageJson = require("../package.json");
const schema = require("../proposal.schema.json");
const { expect } = require("chai");
const { getAddress } = require("@ethersproject/address");
const Ajv = require("ajv");
const buildList = require("../internal/buildList");

const ajv = new Ajv({ allErrors: true, format: "full" });
const validator = ajv.compile(schema);

describe("buildList", () => {
  const proposalList = buildList();

  it("validates", () => {
    const data = proposalList;
    const valid = ajv.validate(schema, data);
    if (! valid) {
        console.log(ajv.errors);
    }

    expect(validator(proposalList)).to.equal(true);
  });

  it("contains no duplicate titles", () => {
    const map = {};
    for (const [k, v] of Object.entries(proposalList.proposals)) {
      const key = `${v.title.toLowerCase()}`;
      expect(typeof map[key]).to.equal("undefined");
      map[key] = true;
    }
  });

  it("version matches package.json", () => {
    expect(packageJson.version).to.match(/^\d+\.\d+\.\d+$/);
    expect(packageJson.version).to.equal(
      `${proposalList.version.major}.${proposalList.version.minor}.${proposalList.version.patch}`
    );
  });
});
