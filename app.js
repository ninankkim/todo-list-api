const express = require('express');
const bodyParser = require('body-parser');

//we import the module and assign it to the variable "es6Renderer"
const es6Renderer = require('express-es6-template-engine');
const methodOverride = require ('method-override');

// const hostname = '127.0.0.1';
// const port = 3000;

const app = express();
app.use(methodOverride('_method'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//registers the template engine function and associates it with html files
app.engine('html', es6Renderer)
//we tell express to look in the templates directory for the template ("views") files
app.set('views', 'templates');
//we set the html template engine (our es6Renderer as the default for this application)
app.set('view engine', 'html');

app.use(express.static('./public'));

let todoList = [
  {
    id: 1,
    todo: 'Implement a REST API',
  },
];

//the homepage routes here
app.get('/', (req, res) => {
  const name = req.query.name || 'World';

  res. render('home', {
    locals: {
      name: name,
      title: 'Home'
    },
    partials: {
      head: 'partials/head'
    }
  });
})

//The get request for the todo routes here
app.get('/todos', (req, res) => {
  //The render todos uses the templates/todo.html file
  res.render('todos',{
    locals: {
      //It makes the 'data' variable available to the template that reads 'todos'
      todos: todoList,
      //It passes the 'Todos' as the title
      title: 'Todos',
      message: null
    },
    partials: {
      head: 'partials/head'
    }
  })
})

//The post
app.post('/todos', (req, res) => {
  if (!req.body || !req.body.todo) {
    res.status(400).render('todos', {
      locals: {
        todos: todoList,
        title: 'Todos',
        message: 'Please Enter A Todo Text'
      },
      partials: {
        head: 'partials/head'
      }
    })
    return;
  }
  const prevId = todoList.reduce((prev, curr) => {
    return prev > curr.id ? prev : curr.id;
  }, 0);
  const newTodo = {
    id: prevId + 1,
    todo: req.body.todo,
  };
  todoList.push(newTodo);

  //The templates/todos.html file
  res.status(201).render('todos'), {
  locals: {
    //It makes the 'data' variable available to the template known as 'todos'
    todos: todoList,
    //It passes the 'todos' as the 'title'
    title: 'Todos',
    message: "New Todo Added"
  },
  partials: {
    head: 'partials/head'
    }
  }
})


//The way to delete an item from the quote on quote list we have assembled
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;

  const todoIndex = todoList.findIndex(element => {
    if (element.id == id) {
      return true;
    }
    return false;
  })

  if (todoIndex === -1) {
    //The code down here 404 sends a HTTP status error
    res.status(404).send('The todo was not found');
  } else {
    //If found, delete the item
    todoList.splice(todoIndex, 1);
    //Another error or message will bring, which means the deleted thing is no longer here.
    res.status(204).redirect('/todos');
  }
})

// const todoList = [
//   {
//     id: 1,
//     todo: 'Implement a REST API',
//   },
//   {
//     id: 2,
//     todo: 'Build a frontend',
//   },
//   {
//     id: 3,
//     todo: '???',
//   },
//   {
//     id: 4,
//     todo: 'Profit!',
//   },
// ];

// GET /api/todos
app.get('/api/todos', (req, res) => {
  res.json(todoList);
});

// GET /api/todos/:id
app.get('api/todos/:id', (req, res) => {
  const todo = 
  todoList.find((todo) => {
    return todo.id === Number.parseInt(req.params.id);
  }) || {};
  const status = Object.keys(todo).length ? 200 : 404;
  res.status(status).json(todo);
});

// POST /api/todos
app.post('/api/todos', (req, res) => {
  if(!req.body || !req.body.todo) {
    res.status(400).json ({
      error: 'Please provide todo text',
    });
    return;
  }
  const prevId = todoList.reduce((prev,curr) => {
    return prev > curr.id ? prev : curr.id;
  }, 0);
  const newTodo = {
    id: prevId + 1,
    todo: req.body.todo,
  };
  todoList.push(newTodo);
  res.json(newTodo);
});

// PUT /api/todos/:id
app.put('/api/todos/:id', (req, res) => {
  if (!req.body || !req.body.todo) {
    res.status(400).json({
      error: 'Please provide a todo text',
    });
    return;
  }
  let updatedTodo  = {};
  todoList.forEach((todo) => {
    if (todo.id === Number.parseInt(req.params.id)) {
      todo.todo = req.body.todo;
      updatedTodo = todo;
    }
  });
  const status = Object.keys(updatedTodo).length ? 200 : 404;
  res.status(status).json(updatedTodo);
});

// DELETE /api/todos/:id
app.delete('/api/todos/:id', (req, res) => {
  let found = false;
  todoList = todoList.filter((todo) => {
    if (todo.id === Number.parseInt(req.params.id)) {
      found = true;
      return false;
    }
    return true;
  });
  const status = found ? 200 : 404;
  res.status(status).json(todoList);
});

app.listen(3000, function () {
  console.log('Todo List API is now listening on port 3000...');
});
