import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function hello(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    tree.create(_options.name || 'hello', 'hello world');
    tree.create('first.md', '#first title');
    return tree;
  };
}
