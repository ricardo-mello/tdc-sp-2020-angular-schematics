import {
  apply,
  branchAndMerge,
  chain,
  mergeWith,
  move,
  renameTemplateFiles,
  Rule,
  SchematicContext,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import {
  basename,
  dirname,
  experimental,
  normalize,
  Path,
  strings,
} from '@angular-devkit/core';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function module(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspaceConfig = tree.read('/angular.json');
    if (!workspaceConfig) {
      throw new Error('Could not find Angular workspace configuration');
    }

    // convert workspace settings to string
    const workspaceContent = workspaceConfig.toString();

    // parse workspace string into JSON object
    const workspace: experimental.workspace.WorkspaceSchema = JSON.parse(
      workspaceContent
    );

    // get project name
    if (!_options.project) {
      _options.project = workspace.defaultProject;
    }

    const projectName = _options.project as string;
    const project = workspace.projects[projectName];
    const projectType = project.projectType === 'application' ? 'app' : 'lib';

    // Get the path to create files
    if (_options.path === undefined) {
      _options.path = `${project.sourceRoot}/${projectType}`;
    }

    const parsedPath = parseName(_options.path, _options.name);
    _options.name = parsedPath.name;
    _options.path = parsedPath.path;

    // Parse template files
    const templateSource = apply(url('./files'), [
      renameTemplateFiles(),
      template({
        ...strings,
        ..._options,
        classify: strings.classify,
        dasherize: strings.dasherize,
      }),
      move(normalize((_options.path + '/' + _options.name) as string)),
    ]);

    // Return Rule chain
    return chain([branchAndMerge(chain([mergeWith(templateSource)]))])(
      tree,
      _context
    );
  };
}

export function parseName(
  path: string,
  name: string
): { name: string; path: Path } {
  const nameWithoutPath = basename(name as Path);
  const namePath = dirname((path + '/' + name) as Path);

  return {
    name: nameWithoutPath,
    path: normalize('/' + namePath),
  };
}