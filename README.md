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

  Usage: commit-with [options] <github-username>

  Searches Github for the user and auto generates a co-authored tag for your commit message

  Options:

    -V, --version  output the version number
    -a, --all      commit all changed files
    -f, --force    ignore cached commit templates, look up user again on githup
    -h, --help     output usage information
```

# Example

Commit currently staged files

```
❯ commit-with ericadamski
```

![commit-with ericadamski](https://user-images.githubusercontent.com/6516758/38911822-c1695784-429f-11e8-9ff1-aff770794f6a.gif)

Commit, and add using `-a` git commit flag

```
❯ commit-with -a ericadamski
```

![commit-with -a ericadamski](https://user-images.githubusercontent.com/6516758/38931433-241b66a6-42e1-11e8-89eb-56ce69d7e6c9.gif)
