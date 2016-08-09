// wait for DOM to load before running js
$(function() {
  //base API route
  var baseUrl = '/api/todos';

  // array to hold data from API
  var allTodos = [];

  // element to display list of todos
  var $todosList = $('#todos-list');

  // form to create new todo
  var $createTodo = $('#create-todo');

  // compile handlebars template
  var source = $('#todos-list');
  var template = Handlebars.compile(source);

  // helper function to render all todos 
  var render = function() {
    // empty existing todos from view
    $todosList.empty();

    // pass 'alltodos' into the template function
    var todosHtml = template({ todos: allTodos});

    //append html to view
    $todosList.append(todosHtml);
  };

  $.get(baseUrl, function (data) {
  console.log(data);

    // set 'allTodos' to todo data from API
    allTodos = data.todos;

    // render all todos to view
    render();
    });

  // listen for submit even on form
  $createTodo.on('submit', function(event) {
    event.preventDefault();

    // serialize form data
    var newTodo = $(this).serialize();

    // POST request to create new todo
    $.post(baseUrl, newTodo, function (data) {
    console.log(data);

    // add new todo to 'allTodos'
    allTodos.push(data);

    // render all todos to view
    render();
    });

  // reset the form
    $createTodo[0].reset();
    $createTodo.find('input').first().focus();
  }); 

  // add event-handlers to todos for updating/deleting
  $todosList

    // for update, submit event on 'update-todo' form
    .on('submit', 'update-todo', function (event) {
    event.preventDefault();

    // find the todo's id (data-id)
    var todoId = $(this).closest('.todo').attr('data-id');

    // find the todo to update by it's id
    var todoToUpdate = allTodos.filter(function (todo) {
      return todo._id == todoId;
    })[0];

    // serialize form data
    var updatedTodo = $(this).serialize();

    // PUT request to update todo
    $.ajax({
      type: 'PUT',
      url: baseUrl + '/' + todoId,
      data: updatedTodo,
      success: function(data) {
        // replace todo to update with newly updated version
        allTodos.splice(allTodos.indexOf(todoToUpdate), 1, data);

        // render all todos to view
        render();
      }
    });
  })

  // for delete. click event on 'delete-todo' button
  .on('click', 'delete-todo', function (event) {
    event.preventDefault();

    // find the todo's id (data-id)
    var todoId = $(this).closest('.todo').attr('data-id');

    // find the todo to delete by it's id
    var todoToDelete = allTodos.filter(function (todo) {
    return todo._id == todoId;
    })[0];

    // DELETE request to delete todo
    $.ajax({
      type: 'DELETE',
      url: baseUrl + '/' + todoId,
      success: function (data) {
        // remove deleted todo from all todos
        allTodos.splice(allTodos.indexOf(todoToDelete), 1);

        // render ():
      }
    });
  });
});
