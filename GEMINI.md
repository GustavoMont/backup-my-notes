# Backup My Notes

This project is basically an OCR script that will read an image of handwritten text and generate a `.md` or `.txt` file according to the user's preference.

## Documentation

All features are documented in `docs/features/`, describing what the features do, expected outputs based on inputs, and how they are implemented.

## Stack

This project uses the Object-Oriented Programming (OOP) paradigm.

### Main

- TypeScript

### Tests

- Jest

### Code Standards

- **Linting**: ESLint (TypeScript, Jest, and Prettier integration)
- **Formatting**: Prettier
- **Hooks**: Husky with lint-staged and commitlint (validates conventional commits)
- **Conventions**: Follow community standards and conventional commits.
- **CI**: Automated workflows for tests, linting, and formatting on Pull Requests.

> Every change in the structural stack, as well as increments, must be reflected here.

## Commands

- **Development**: `npm run dev`
- **Start**: `npm start`
- **Tests**: `npm run test`
- **Watch Tests**: `npm run test:watch`

## Tests

- **TDD**: All features must be tested. Before implementing code, write tests.
- **BDD**: Test names describe the scenario, not the expected result.
- **Coverage**: The target is 100% test coverage. The only thing tests won't cover is third-party services.
- **Test Types**: All features must have integration and unit tests.

## Architecture

The project is built using a 3-layer architecture: controller, service, and repository.

> The project has no database, so the repository layer handles memory: saving, reading files, etc.

### Folders

- One for each layer.
- `tests/` folder in the root of the project:
  - One folder for `unit` tests.
  - One folder for `integration` tests.
- `utils/` for all kinds of utilities used between layers, services, etc.

### Files

Os arquivos devem seguir o seguinte padrão `kenabe-case.layer.ts` Ex: `image-download.service.ts`

## Commits

- All commit should be a release: nothing should be broken in a commit
- Follow conventional commits
