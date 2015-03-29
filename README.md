# gitterMe
Gitter calculator bot - specially for UAWebChallenge VII 

### Install

To install and setup please run:
```sh
git clone https://github.com/philipshurpik/gitterMe.git
cd gitterMe/
npm install
```

### Run

Run with default token (gitterMe account) and default room (philipshurpik/calcbot)
```sh
node index
```

Run with other token and room:
```sh
node index —token <token> —room <room>
```

### About
Solution was created using next libraries:
 * node-gitter - Gitter API
 * mathjs - library for math calculations
 * commander - command line parser