# Build Commit Message

## Guidelines

Look through the staged files and produce concise commit message and process commit, use follow formula

If no files are staged, prompt the user to stage some files first. Do not use git add

```
<TAG>: <DESCRIPTION>
```

TAG must be one of the following:

- **feat**: Add a new feature
- **fix**: Fix a bug
- **docs**: Documentation changes
- **style**: Code formatting, missing semicolons, and other style-only changes without altering logic
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Add or update tests
- **build**: Changes to the build system or external dependencies
- **ci**: Changes to CI configuration
- **chore**: Other minor changes (not related to build tasks)

DESCRIPTION should be a brief, high-level summary in Korean describing the main change. Do not list individual files or include diff details—focus on what was changed and
why.

## Examples

```
feat: 관측 1차조사 수정 기능 추가
fix: 농가기술지도 토양검정 오류 수정
refactor: 역할별로 엔드포인트 분리
```
