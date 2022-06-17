import { API, FileInfo, Options } from "jscodeshift";
import { hasModuleImport, hasModuleNamespaceImport, submoduleImport } from "../utils";
import { ExpressionKind } from "ast-types/gen/kinds";

export default function transformer(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const hasRouterImport = hasModuleImport(j, root, "react-router-dom");
  if (!hasRouterImport) {
    return;
  }

  const fnName = "useHistory";
  const newFnName = "useNavigate";

  const addCommentBlock = (path) => {
    const comment = j.commentLine("fixme 需手动binding", true, false);
    const comments = (path.node.comments = path.node.comments || []);
    comments.push(comment);
  };

  const addComment = (path) => {
    const comment = j.commentLine("fixme 间接引用暂不支持，请手动处理", true, false);
    const comments = (path.parentPath.node.comments = path.parentPath.node.comments || []);
    comments.push(comment);
  };

  const indirectReference = (name) => {
    root
      .find(j.VariableDeclarator, {
        init: {
          name,
        },
      })
      .forEach((path) => {
        addComment(path);
      });

    root
      .find(j.AssignmentExpression, {
        right: {
          name,
        },
      })
      .forEach((path) => {
        addComment(path);
      });
  };

  const actionsResolve = (actionName, nodePath) => {
    switch (actionName) {
      case "goBack":
      case "goForward":
        j(nodePath).replaceWith(
          j.callExpression(j.identifier("navigate"), [
            actionName === "goBack"
              ? j.unaryExpression("-", j.numericLiteral(1))
              : j.numericLiteral(1),
          ]),
        );
        break;
      case "go":
        j(nodePath).replaceWith(
          j.callExpression(j.identifier("navigate"), nodePath.node.arguments),
        );
        break;
      case "replace":
        const replace_args = nodePath.node.arguments.filter(
          (arg) => arg.type !== "SpreadElement",
        ) as ExpressionKind[];
        j(nodePath).replaceWith(
          j.callExpression(j.identifier("navigate"), [
            replace_args[0],
            j.objectExpression(
              [
                j.objectProperty(j.identifier("replace"), j.booleanLiteral(true)),
                replace_args.at(1) && j.objectProperty(j.identifier("state"), replace_args.at(1)),
              ].filter(Boolean),
            ),
          ]),
        );
        break;
      case "push":
        const args = nodePath.node.arguments.filter(
          (arg) => arg.type !== "SpreadElement",
        ) as ExpressionKind[];
        j(nodePath).replaceWith(
          j.callExpression(
            j.identifier("navigate"),
            [
              args[0],
              args.at(1) &&
                j.objectExpression([j.objectProperty(j.identifier("state"), args.at(1))]),
            ].filter(Boolean),
          ),
        );
    }
  };

  const resolveVariableDeclarator = (path) => {
    if (path.node.id.type === "Identifier") {
      //demo const history = useHistory();
      root
        .find(j.MemberExpression, {
          object: {
            type: "Identifier",
            name: path.node.id.name,
          },
        })
        .forEach((path) => {
          if (path.parentPath.node.type !== "CallExpression") {
            addCommentBlock(path);
          } else {
            if (path.node.property.type === "Identifier") {
              actionsResolve(path.node.property.name, path.parentPath);
            }
          }
        });
    } else {
      //demo const { go,goBack,push,replace,goForward } = useHistory();
      j(path)
        .find(j.ObjectProperty)
        .forEach((propertyPath) => {
          const { key, value } = propertyPath.node;
          if (key.type === "Identifier" && value.type === "Identifier") {
            const withPreAction = (afterAction) => {
              root
                .find(j.Identifier, {
                  name: value.name,
                })
                .forEach((nodePath) => {
                  const parentPath = nodePath.parentPath;
                  if (parentPath.node === propertyPath.node) {
                    return;
                  }
                  if (parentPath.node.type !== "CallExpression") {
                    addCommentBlock(nodePath);
                  } else {
                    afterAction(parentPath);
                  }
                });
            };
            withPreAction(actionsResolve.bind(null, key.name));
          }
        });
    }
  };

  hasModuleNamespaceImport(j, root, "react-router-dom", (defaultSpec) => {
    const name = defaultSpec.local.name;
    root
      .find(j.VariableDeclarator, {
        init: {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: { name },
            property: { name: fnName },
          },
        },
      })
      .forEach((path) => {
        resolveVariableDeclarator(path);
        j(path).replaceWith(
          j.variableDeclarator(
            j.identifier("navigate"),
            j.callExpression(j.memberExpression(j.identifier(name), j.identifier(newFnName)), []),
          ),
        );
      });

    indirectReference(name);
  });

  submoduleImport(j, root, "react-router-dom", fnName).forEach((importSpecifierNodePath) => {
    const importSpecifier = importSpecifierNodePath.node;
    const localName = importSpecifier.local.name;
    j(importSpecifierNodePath)
      .find(j.Identifier, { name: fnName })
      .forEach((nodePath) => j(nodePath).replaceWith(j.identifier(newFnName)));
    if (localName === fnName) {
      root
        .find(j.VariableDeclarator, {
          init: {
            type: "CallExpression",
            callee: {
              name: fnName,
            },
          },
        })
        .forEach((path) => {
          resolveVariableDeclarator(path);
          j(path).replaceWith(
            j.variableDeclarator(
              j.identifier("navigate"),
              j.callExpression(j.identifier(newFnName), []),
            ),
          );
        });
    }
    indirectReference(localName);
  });

  return root.toSource(options);
}
