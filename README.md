# commit-with

🤗 A command line util to share the fame when pair programming by adding a co-authored message to a commit

# Install

globally install this package using npm:

```
npm i -g commit-with
```

or yarn

```
yarn global add commit-with
```

# Usage

```
❯ commit-with --help

  Usage: commit-with [options] <github-username> [git-args...]

  Searches Github for the user and auto generates a co-authored tag for your commit message

  Options:

    -V, --version  output the version number
    -h, --help     output usage information
```

# Example

Commit currently staged files

```
❯ commit-with ericadamski
```

<!-- put an image of that command working here -->

Commit, and add using `-a` git commit flag

```
❯ commit-with ericadamski -- -a
```

<!-- put an image of that command working here -->
