# Create Pull Request Content from Commit

This command generates a Korean markdown file containing commit changes for pull request descriptions.

## Usage

Replace $ARGUMENTS with the specific commit hash you want to analyze.

## Steps

1. **Read commit details**
   ```bash
   git show $ARGUMENTS --name-only
   git show $ARGUMENTS --stat
   git show $ARGUMENTS
   ```

2. **Analyze changes**
   - Review modified files and their purposes
   - Identify the main functionality or feature changed
   - Note any breaking changes or important updates

3. **Generate Korean markdown content**
   Create a file named `pr-content-$ARGUMENTS.md` with the following structure:
   
   ```markdown
   # Pull Request 내용
   
   ## 변경 사항 요약
   [Brief summary of what was changed]
   
   ## 주요 변경 파일
   [List of main files changed and their purpose]
   
   ## 기능 설명
   [Detailed explanation of the feature or fix]
   
   ## 테스트 계획
   [How to test the changes]
   
   ## 주의사항
   [Any important notes or breaking changes]
   ```

4. **Save the file**
   Save as `pr-content-$ARGUMENTS.md` in the current directory for easy reference.

## Example

For commit `c63c5d174295e293f48baacb0abb85648168e171`, the command would generate `pr-content-c63c5d174295e293f48baacb0abb85648168e171.md`.