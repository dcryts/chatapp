# ChatApp

A simple chat application made for practice using node, express, mongodb, and socket.io.

### Prerequisites

- Node.js

- npm

- Mongodb: create a 'chatapp' db with collections 'users' and 'chatlog'. Consider making 'chatlog' a capped collection explicitly by

```
db.createCollection( "chatlog", { capped: true, size: <space allocated to collection in bytes>, max: <# of documents> })
```

### Installing

Install packages by

```
npm install
```


## Running

```
npm start
```

or

```
node app.js
```

## License

This project is licensed under the MIT License
