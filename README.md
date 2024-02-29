
# Store and Restrict Decorator Assignment


This project is a TypeScript library providing access control features for stores with restrictions on reading and writing specific keys.


## Installation
Make sure you have [Node.js](https://nodejs.org/) and [yarn](https://classic.yarnpkg.com/lang/en/docs/install) installed on your machine.



1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ProjectName.git

2. Install the dependencies:
   ```bash
   yarn
 
## Running Tests

To run tests, run the following command

```bash
  yarn run test
```


## Project Structure

```
project
│   README.md
│   jest.config.ts
│   package.json    
│   tsconfig.json    
│   yarn.lock    
│
└───src
│   └───stores
│   │    └───adminStore.ts
│   │    └───store.ts
│   │    └───userStore.ts
│   │    
│   └───types
│   │    └───class-types.ts
│   │    └───json-types.ts   
│   │
│   └───utils
│        └───lazy.ts
│        └───restrict.ts   
│ 
└───test
    │   store.test.ts
```
## Tech Stack

**Client:** JS, TS, Jest


## Author

- [@AntoineMezon](https://github.com/MezonAntoine)

