/* global jest */
jest.autoMockOff();
const defineTest = require("jscodeshift/dist/testUtils").defineTest;

const fixtures = [
  "import_namespace_specifier",
  'import_specifier',
  'import_namespace_specifier_identifier',
  'import_specifier_identifier'
];

for (const fixture of fixtures) {
  defineTest(__dirname, "useHistory_to_useNavigate", {}, `useHistory_to_useNavigate/${fixture}`, {
    parser: "tsx",
  });
}
