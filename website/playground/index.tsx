import dedent from "dedent";
import React from "react";
import ReactDOM from "react-dom";

import { Playground } from "./Playground";

const content = dedent`
  // All GraphQL Nexus objects are available globally here,
  // and will automatically be added to the schema

  objectType('Account', t => {
    t.implements('Node', 'Timestamps');
    t.string('email', { nullable: true });
    t.field('posts', 'Post', { 
      list: true, 
      default: () => [{id: 1}] 
    });
  });

  objectType('Post', t => {
    t.implements('Node');
    t.string('title', { default: '' });
    t.field('owner', 'Account', {
      resolve() {
        return { id: 2 }
      }
    });
  })

  objectType('Query', t => {
    t.field('account', 'Account', {
      resolve() {
        return { id: 1, email: 'test@example.com' }
      }
    });
  });

  interfaceType('Node', t => {
    t.description("A Node is a resource with a globally unique identifier");
    t.id('id', { 
      description: "PK of the resource",
      resolve(root, args, ctx, info) {
        return ${"`${info.parentType.name}:${root.id}`"}
      }
    });
  })

  interfaceType('Timestamps', t => {
    t.field('createdAt', 'Date', { default: () => new Date() });
    t.field('updatedAt', 'Date', { default: () => new Date() });
  });

  scalarType('Date', {
    serialize: value => value.getTime(),
    parseValue: value => new Date(value),
    parseLiteral: ast => ast.kind === "IntValue" ? new Date(ast.value) : null
  });
`;

const initialQuery = dedent`
  {
    account {
      id
      email
      createdAt
      posts {
        id
        owner {
          id
        }
      }
    }
  }
`;

ReactDOM.render(
  <Playground initialSchema={content} initialQuery={initialQuery} />,
  document.getElementById("root")
);
