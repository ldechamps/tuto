var Todo = require('./models/todo');
var Nerd = require('./models/nerd');

// expose
module.exports = function(app, passport) {
        
        var options = {
            root: __dirname + '/../public/'/* ,
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }*/
          };
    
        // =====================================
        // HOME PAGE =====================
        // =====================================
        app.get('/', function(req, res){
            res.render('index.ejs');
        })

        
        // =====================================
        // LOGIN SECTION =====================
        // =====================================
        // show login
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage')});
        })
        
        // process login
        app.post('/login', passport.authenticate('local-login', {
             successRedirect : '/profile', // redirect to the secure profile section
             failureRedirect : '/login', // redirect back to the login page if there is an error
             failureFlash : true // allow flash messages
        }))
        
        
        // =====================================
        // SINGUP SECTION =====================
        // =====================================
        // show signup
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage')});
        })
        
        // process signup
         app.post('/signup', passport.authenticate('local-signup', {
             successRedirect : '/profile', // redirect to the secure profile section
             failureRedirect : '/signup', // redirect back to the signup page if there is an error
             failureFlash : true // allow flash messages
         }));
        
    
        // =====================================
        // PROFILE SECTION =====================
        // =====================================
        // we will want this protected so you have to be logged in to visit
        // we will use route middleware to verify this (the isLoggedIn function)
        app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
            });
        });

        // =====================================
        // LOGOUT ==============================
        // =====================================
        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });
    
        // =====================================
        // API TODO SECTION =====================
        // =====================================
        // get all todos
        app.get('/api/todos', function(req, res){

            // use mongoose to get all todos in the database
            Todo.find(function(err, todos){

                // if there is an error retrieving, send the error.
                if(err)
                    res.send(err);

                res.json(todos); // return Todos in JSON Format
            })
        })

        // create todo and send back all todos after creation
        app.post('/api/todos', function(req, res){

            // create a todo, information come from AJAX
            Todo.create({
                text : req.body.text,
                done : false
            }, function(err, todo) {
                if(err)
                    res.send(err);

                // use mongoose to get all todos in the database
                Todo.find(function(err, todos){
                    if(err)
                        res.send(err);
                    res.json(todos); // return Todos in JSON Format
                });
            });
        });

        // delete a todo
        app.delete('/api/todos/:todo_id', function(req, res){
            Todo.remove({
                _id : req.params.todo_id
            }, function(err, todo) {
                if (err)
                    res.send(err);

                // get and return all the todos
                Todo.find(function(err, todos){
                    if(err)
                        res.send(err);
                    res.json(todos); // return Todos in JSON Format
                });
            });
        });
  
        //application
        app.get('/todo/*', isLoggedIn, function(req, res) {
            res.sendFile('indexTodo.html', options);
        });
    
        // =====================================
        // API NERD SECTION =====================
        // =====================================    
        // sample api route
        app.get('/api/nerds', function(req, res) {
            // use mongoose to get all nerds in the database
            Nerd.find(function(err, next) {
                
                if(err)
                    res.send(err);
                
                res.json(nerds);
                
            })
        })
        
        //application
        app.get('/nerd/*', isLoggedIn, function(req, res) {
            res.sendFile('indexNerd.html', options);
        });
    
        // =====================================
        // SCRAPE SECTION =====================
        // =====================================  
        app.get('/scrape', function(req, res) {
            
          require('./tools/scrape')();
              
          // send out a message to the browser reminding you that this app does not have a UI.
          res.send('Check your console!')     
        });
    
        // =====================================
        // DEFAULT PAGE =====================
        // =====================================
        app.get('*', isLoggedIn, function(req, res) {
            res.sendFile('404.html', options);
        });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log('is logged in '+req.isAuthenticated());
    
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
