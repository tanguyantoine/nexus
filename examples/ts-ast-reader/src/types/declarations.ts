import { objectType, arg } from "nexus";
import { nodeType, functionLikeDeclaration, hasTypeParameters } from "./mixins";
import { filteredNodesList } from "./utils";

const nodeSkipSyntax = {
  skip: arg("SyntaxKind", { list: true }),
  only: arg("SyntaxKind", { list: true }),
};

export const ExportAssignment = objectType("ExportAssignment", (t) => {
  nodeType(t);
});

export const SourceFile = objectType("SourceFile", (t) => {
  nodeType(t);
  t.field("statements", "Node", {
    list: true,
    args: nodeSkipSyntax,
    resolve: (root, args) =>
      filteredNodesList(args, Array.from(root.statements)),
  });
});

export const TypeParameterDeclaration = objectType(
  "TypeParameterDeclaration",
  (t) => {
    nodeType(t);
    t.field("constraint", "Node");
    t.field("default", "Node");
    t.field("expression", "Node");
  }
);

export const CallSignatureDeclaration = objectType(
  "CallSignatureDeclaration",
  (t) => {
    nodeType(t);
  }
);

export const ConstructSignatureDeclaration = objectType(
  "ConstructSignatureDeclaration",
  (t) => {
    nodeType(t);
  }
);

export const VariableDeclaration = objectType("VariableDeclaration", (t) => {
  nodeType(t);
});

export const ParameterDeclaration = objectType("ParameterDeclaration", (t) => {
  nodeType(t);
  t.implements("HasJSDoc");
  t.field("type", "Node", { nullable: true });
});

export const PropertySignature = objectType("PropertySignature", (t) => {
  t.implements("Node", "HasJSDoc", "MaybeOptional");
  t.field("type", "Node", { nullable: true });
});

export const PropertyDeclaration = objectType("PropertyDeclaration", (t) => {
  t.implements("Node", "HasJSDoc", "MaybeOptional");
});

export const PropertyLikeDeclaration = objectType(
  "PropertyLikeDeclaration",
  (t) => {
    nodeType(t);
  }
);

export const FunctionDeclaration = objectType("FunctionDeclaration", (t) => {
  nodeType(t);
  t.implements("HasJSDoc");
  functionLikeDeclaration(t);
});

export const MethodDeclaration = objectType("MethodDeclaration", (t) => {
  nodeType(t);
  t.implements("HasJSDoc");
  functionLikeDeclaration(t);
});

export const ConstructorDeclaration = objectType(
  "ConstructorDeclaration",
  (t) => {
    nodeType(t);
    t.implements("HasJSDoc");
    functionLikeDeclaration(t);
  }
);

export const GetAccessorDeclaration = objectType(
  "GetAccessorDeclaration",
  (t) => {
    nodeType(t);
    t.implements("HasJSDoc");
    functionLikeDeclaration(t);
  }
);

export const SetAccessorDeclaration = objectType(
  "SetAccessorDeclaration",
  (t) => {
    nodeType(t);
    t.implements("HasJSDoc");
    functionLikeDeclaration(t);
  }
);

export const IndexSignatureDeclaration = objectType(
  "IndexSignatureDeclaration",
  (t) => {
    nodeType(t);
    t.implements("HasJSDoc");
  }
);

export const MissingDeclaration = objectType("MissingDeclaration", (t) => {
  nodeType(t);
});

export const ClassDeclaration = objectType("ClassDeclaration", (t) => {
  nodeType(t);
  t.implements("HasJSDoc");
  t.field("members", "Node", {
    list: true,
    args: nodeSkipSyntax,
    resolve: (root, args) => filteredNodesList(args, Array.from(root.members)),
  });
});

export const InterfaceDeclaration = objectType("InterfaceDeclaration", (t) => {
  nodeType(t);
  t.implements("HasJSDoc");
});

export const TypeAliasDeclaration = objectType("TypeAliasDeclaration", (t) => {
  nodeType(t);
  hasTypeParameters(t);
  t.implements("HasJSDoc");
  t.field("type", "Node", { nullable: true });
});

export const EnumDeclaration = objectType("EnumDeclaration", (t) => {
  nodeType(t);
  t.implements("HasJSDoc");
  t.field("members", "Node", { list: true });
});

export const ModuleDeclaration = objectType("ModuleDeclaration", (t) => {
  nodeType(t);
  t.implements("HasJSDoc");
});

export const NamespaceDeclaration = objectType("NamespaceDeclaration", (t) => {
  nodeType(t);
  t.implements("HasJSDoc");
});

export const JSDocNamespaceDeclaration = objectType(
  "JSDocNamespaceDeclaration",
  (t) => {
    nodeType(t);
  }
);

export const ImportEqualsDeclaration = objectType(
  "ImportEqualsDeclaration",
  (t) => {
    nodeType(t);
  }
);

export const ImportDeclaration = objectType("ImportDeclaration", (t) => {
  nodeType(t);
});

export const NamespaceExportDeclaration = objectType(
  "NamespaceExportDeclaration",
  (t) => {
    nodeType(t);
  }
);

export const ExportDeclaration = objectType("ExportDeclaration", (t) => {
  nodeType(t);
});
