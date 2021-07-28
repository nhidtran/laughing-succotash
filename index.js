const babel = require("@babel/core");

const reactCode = `
<SomeSCComponent>
  <img src="foo.png" />
  <Image src="sc-img.png" />
  <div>don't delete me</div>
  <div>
    <div>
      <div>
        <img src="nested-image.png" />
      </div>
    </div>
  </div>
  <video>
    <source src="movie.mp4" type="video/mp4" />
  </video>
</SomeSCComponent>
`;
const output = babel.transform(reactCode, {
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: [
    function customPlugin({ types: t }) {
      return {
        name: "removeJSXElement",
        visitor: {
          JSXElement(path, state) {
            const elementNames = state.opts.elementNames || [
              "img",
              "video",
              "Image",
            ];

            const nodeName = path
              .get("openingElement")
              .get("name")
              .get("name").node;

            function removeElement(path) {
              path.replaceWith(t.expressionStatement(t.nullLiteral()));
            }

            if (nodeName && elementNames.includes(nodeName)) {
              console.log(path.get("openingElement").get("name"));
              removeElement(path);
            }
          },
        },
      };
    },
  ],
});

console.log(output);
