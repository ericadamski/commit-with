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

![commit-with ericadamski](https://user-images.githubusercontent.com/6516758/38911822-c1695784-429f-11e8-9ff1-aff770794f6a.gif)

Commit, and add using `-a` git commit flag

```
❯ commit-with ericadamski -- -a
```

![commit-with ericadamski -- -a](https://user-images.githubusercontent.com/6516758/38911862-02fb5c38-42a0-11e8-945f-f43723ac4462.gif)
