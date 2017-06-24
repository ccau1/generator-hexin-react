'use strict';
//Require dependencies
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const t = require('babel-types');
const generate = require('babel-generator').default;

var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('name', { type: String, required: false });
  }
  initializing() {
    // checking current project state, getting configs, etc
  }

  _mailerPrompts() {
    const SERVICE = {
      GMAIL: 'gmail'
    };
    return [
      {
        type    : 'confirm',
        name    : 'mailer',
        message : 'Would you like to enable Mailer?'
      },
      {
        type    : 'list',
        name    : 'mailerService',
        message : 'Mailer:: service',
        choices : ['gmail'],
        when: function(props) {
          return props.mailer;
        }
      },
      {
        type    : 'input',
        name    : 'mailerAuthUser',
        message : 'Mailer:: email',
        when: function(props) {
          return props.mailer && props.mailerService === SERVICE.GMAIL;
        },
        validate: function(prop) {
          if (!prop) {
            return 'Email Required';
          } else {
            return true;
          }
        }
      },
      {
        type    : 'input',
        name    : 'mailerAuthPass',
        message : 'Mailer:: password',
        when: function(props) {
          return props.mailer && props.mailerService === SERVICE.GMAIL;
        },
        validate: function(prop) {
          if (!prop) {
            return 'Password Required';
          } else {
            return true;
          }
        }
      }
    ];
  }

  _redisPrompts() {
    return [
      {
        type    : 'confirm',
        name    : 'redis',
        message : 'Would you like to enable Redis?'
      },
      {
        type    : 'input',
        name    : 'redisHost',
        message : 'Redis:: host',
        default : 'localhost',
        when: function(props) {
          return props.redis;
        }
      },
      {
        type    : 'input',
        name    : 'redisPort',
        message : 'Redis:: port',
        default : 6379,
        when: function(props) {
          return props.redis;
        },
        validate: function(prop) {
          return isNaN(prop) ? 'Invalid Port Number' : true;
        }
      }
    ];
  }

  _fivebeansPrompts() {
    return [
      {
        type    : 'confirm',
        name    : 'fivebeans',
        message : 'Would you like to enable FiveBeans?'
      },
      {
        type    : 'input',
        name    : 'fivebeansHost',
        message : 'FiveBeans:: host',
        default : 'localhost',
        when: function(props) {
          return props.fivebeans;
        }
      },
      {
        type    : 'input',
        name    : 'fivebeansPort',
        message : 'FiveBeans:: port',
        default : 11300,
        when: function(props) {
          return props.fivebeans;
        },
        validate: function(prop) {
          return isNaN(prop) ? 'Invalid Port Number' : true;
        }
      }
    ];
  }

  prompting() {
    var done = this.async();
    var me = this;
    this.prompt(
      [
        {
          type    : 'input',
          name    : 'name',
          message : 'Your project name',
          when: () => {
            return !this.options.name;
          },
          default : this.appname // Default to current folder name
        },
        {
          type    : 'input',
          name    : 'name',
          message : 'Your back-end API uri base',
          default : 'http://localhost:8280/api/' // Default to current folder name
        }
      ]
    ).then((answers) => {
      if (this.options.name) {
        answers.name = this.options.name;
      }
      // this.log(answers);
      this.props = answers;
      done();
    });
  }

  configuring() {
    // Saving configurations and configure the project
    // (creating .editorconfig files and other metadata files)
  }

  writing() {
    // // Where you write the generator specific files (routes, controllers, etc)
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('plopfile.js'),
      this.destinationPath('plopfile.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('.yo-rc.json'),
      this.destinationPath('.yo-rc.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('.gitignorefile'),
      this.destinationPath('.gitignore'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('.flowconfig'),
      this.destinationPath('.flowconfig'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('.eslintrc'),
      this.destinationPath('.eslintrc'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('.eslintignore'),
      this.destinationPath('.eslintignore'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('.editorconfig'),
      this.destinationPath('.editorconfig'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc'),
      this.props
    );
    // /www
    this.fs.copyTpl(
      this.templatePath('www/index.html'),
      this.destinationPath('www/index.html'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('www/css/font-awesome-4.7.0.min.css'),
      this.destinationPath('www/css/font-awesome-4.7.0.min.css'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('www/css/google-font-roboto.css'),
      this.destinationPath('www/css/google-font-roboto.css'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('www/css/loader.css'),
      this.destinationPath('www/css/loader.css'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('www/css/reset.css'),
      this.destinationPath('www/css/reset.css'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/types.js'),
      this.destinationPath('src/types.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/index.js'),
      this.destinationPath('src/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/index.js'),
      this.destinationPath('src/routes/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Routes.js'),
      this.destinationPath('src/routes/Routes.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/RouteStrategy.js'),
      this.destinationPath('src/routes/RouteStrategy.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/index.js'),
      this.destinationPath('src/routes/Root/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/Routes.js'),
      this.destinationPath('src/routes/Root/Routes.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/Todos/index.js'),
      this.destinationPath('src/routes/Root/Todos/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/Todos/messages.js'),
      this.destinationPath('src/routes/Root/Todos/messages.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/Todos/TodosPage.js'),
      this.destinationPath('src/routes/Root/Todos/TodosPage.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/Todos/styles.js'),
      this.destinationPath('src/routes/Root/Todos/styles.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/SignUp/index.js'),
      this.destinationPath('src/routes/Root/SignUp/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/SignUp/messages.js'),
      this.destinationPath('src/routes/Root/SignUp/messages.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/SignUp/SignUpPage.js'),
      this.destinationPath('src/routes/Root/SignUp/SignUpPage.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/SignUp/SignUpPageContainer.js'),
      this.destinationPath('src/routes/Root/SignUp/SignUpPageContainer.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/SignUp/styles.js'),
      this.destinationPath('src/routes/Root/SignUp/styles.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/SecretStuff/index.js'),
      this.destinationPath('src/routes/Root/SecretStuff/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/SecretStuff/SecretStuffPage.js'),
      this.destinationPath('src/routes/Root/SecretStuff/SecretStuffPage.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/Profile/index.js'),
      this.destinationPath('src/routes/Root/Profile/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/Profile/ProfilePage.js'),
      this.destinationPath('src/routes/Root/Profile/ProfilePage.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/Login/index.js'),
      this.destinationPath('src/routes/Root/Login/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/Login/LoginPage.js'),
      this.destinationPath('src/routes/Root/Login/LoginPage.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/Login/LoginPageContainer.js'),
      this.destinationPath('src/routes/Root/Login/LoginPageContainer.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/Login/messages.js'),
      this.destinationPath('src/routes/Root/Login/messages.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/Login/styles.js'),
      this.destinationPath('src/routes/Root/Login/styles.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/Home/HomePage.js'),
      this.destinationPath('src/routes/Root/Home/HomePage.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/Home/index.js'),
      this.destinationPath('src/routes/Root/Home/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/Home/messages.js'),
      this.destinationPath('src/routes/Root/Home/messages.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/Home/styles.js'),
      this.destinationPath('src/routes/Root/Home/styles.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/Contact/ContactPage.js'),
      this.destinationPath('src/routes/Root/Contact/ContactPage.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/Contact/index.js'),
      this.destinationPath('src/routes/Root/Contact/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/Contact/messages.js'),
      this.destinationPath('src/routes/Root/Contact/messages.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/routes/Root/Contact/styles.js'),
      this.destinationPath('src/routes/Root/Contact/styles.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/reducers/account.js'),
      this.destinationPath('src/reducers/account.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/reducers/contact.js'),
      this.destinationPath('src/reducers/contact.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/reducers/form.js'),
      this.destinationPath('src/reducers/form.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/reducers/index.js'),
      this.destinationPath('src/reducers/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/reducers/intl.js'),
      this.destinationPath('src/reducers/intl.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/reducers/todo.js'),
      this.destinationPath('src/reducers/todo.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/lib/callAPIMiddleware.js'),
      this.destinationPath('src/lib/callAPIMiddleware.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/lib/cookies.js'),
      this.destinationPath('src/lib/cookies.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/lib/countdown.js'),
      this.destinationPath('src/lib/countdown.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/lib/createReducer.js'),
      this.destinationPath('src/lib/createReducer.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/lib/react-router.js'),
      this.destinationPath('src/lib/react-router.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/lib/request.js'),
      this.destinationPath('src/lib/request.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/layouts/Root/index.js'),
      this.destinationPath('src/layouts/Root/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/layouts/Root/Layout.js'),
      this.destinationPath('src/layouts/Root/Layout.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/layouts/Root/Footer.js'),
      this.destinationPath('src/layouts/Root/Footer.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/layouts/Root/Body.js'),
      this.destinationPath('src/layouts/Root/Body.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/layouts/Root/Menus/AnonMenu.js'),
      this.destinationPath('src/layouts/Root/Menus/AnonMenu.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/layouts/Root/Menus/LoggedInMenu.js'),
      this.destinationPath('src/layouts/Root/Menus/LoggedInMenu.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/layouts/Root/Menus/messages.js'),
      this.destinationPath('src/layouts/Root/Menus/messages.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/layouts/Root/Menus/styles.js'),
      this.destinationPath('src/layouts/Root/Menus/styles.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/layouts/Root/Header/HeaderContainer.js'),
      this.destinationPath('src/layouts/Root/Header/HeaderContainer.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/layouts/Root/Header/Header.js'),
      this.destinationPath('src/layouts/Root/Header/Header.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/layouts/Root/Header/index.js'),
      this.destinationPath('src/layouts/Root/Header/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/layouts/Root/Header/styles.js'),
      this.destinationPath('src/layouts/Root/Header/styles.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/ContactForm/ContactFormContainer.js'),
      this.destinationPath('src/containers/ContactForm/ContactFormContainer.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/ContactForm/ContactForm.js'),
      this.destinationPath('src/containers/ContactForm/ContactForm.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/ContactForm/index.js'),
      this.destinationPath('src/containers/ContactForm/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/ContactForm/messages.js'),
      this.destinationPath('src/containers/ContactForm/messages.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/Locales/index.js'),
      this.destinationPath('src/containers/Locales/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/Locales/Locales.js'),
      this.destinationPath('src/containers/Locales/Locales.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/Locales/LocalesContainer.js'),
      this.destinationPath('src/containers/Locales/LocalesContainer.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/Locales/styles.js'),
      this.destinationPath('src/containers/Locales/styles.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/LoginForm/index.js'),
      this.destinationPath('src/containers/LoginForm/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/LoginForm/LoginForm.js'),
      this.destinationPath('src/containers/LoginForm/LoginForm.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/LoginForm/LoginFormContainer.js'),
      this.destinationPath('src/containers/LoginForm/LoginFormContainer.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/LoginForm/LoginFormSuccess.js'),
      this.destinationPath('src/containers/LoginForm/LoginFormSuccess.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/LoginForm/messages.js'),
      this.destinationPath('src/containers/LoginForm/messages.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/LogoutButton/index.js'),
      this.destinationPath('src/containers/LogoutButton/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/LogoutButton/LogoutButton.js'),
      this.destinationPath('src/containers/LogoutButton/LogoutButton.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/LogoutButton/LogoutButtonContainer.js'),
      this.destinationPath('src/containers/LogoutButton/LogoutButtonContainer.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/LogoutButton/messages.js'),
      this.destinationPath('src/containers/LogoutButton/messages.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/SignUpForm/index.js'),
      this.destinationPath('src/containers/SignUpForm/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/SignUpForm/messages.js'),
      this.destinationPath('src/containers/SignUpForm/messages.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/SignUpForm/SignUpForm.js'),
      this.destinationPath('src/containers/SignUpForm/SignUpForm.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/SignUpForm/SignUpFormContainer.js'),
      this.destinationPath('src/containers/SignUpForm/SignUpFormContainer.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/SignUpForm/SignUpFormSuccess.js'),
      this.destinationPath('src/containers/SignUpForm/SignUpFormSuccess.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/TodoForm/index.js'),
      this.destinationPath('src/containers/TodoForm/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/TodoForm/messages.js'),
      this.destinationPath('src/containers/TodoForm/messages.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/TodoForm/TodoForm.js'),
      this.destinationPath('src/containers/TodoForm/TodoForm.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/TodoForm/TodoFormContainer.js'),
      this.destinationPath('src/containers/TodoForm/TodoFormContainer.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/TodoList/index.js'),
      this.destinationPath('src/containers/TodoList/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/TodoList/messages.js'),
      this.destinationPath('src/containers/TodoList/messages.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/TodoList/styles.js'),
      this.destinationPath('src/containers/TodoList/styles.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/TodoList/TodoList.js'),
      this.destinationPath('src/containers/TodoList/TodoList.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/containers/TodoList/TodoListContainer.js'),
      this.destinationPath('src/containers/TodoList/TodoListContainer.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/components/MultilingualStringField/index.js'),
      this.destinationPath('src/components/MultilingualStringField/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/components/MultilingualStringField/MultilingualStringField.js'),
      this.destinationPath('src/components/MultilingualStringField/MultilingualStringField.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/components/TodoItem/TodoItem.js'),
      this.destinationPath('src/components/TodoItem/TodoItem.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/components/TodoItem/messages.js'),
      this.destinationPath('src/components/TodoItem/messages.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/components/TodoItem/index.js'),
      this.destinationPath('src/components/TodoItem/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/components/TodoItem/styles.js'),
      this.destinationPath('src/components/TodoItem/styles.js'),
      this.props
    );


    // TODO:: src/app

    this.fs.copyTpl(
      this.templatePath('src/app/components/Button.js'),
      this.destinationPath('src/app/components/Button.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/app/components/Card.js'),
      this.destinationPath('src/app/components/Card.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/app/components/DocumentTitle.js'),
      this.destinationPath('src/app/components/DocumentTitle.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/app/components/Fab.js'),
      this.destinationPath('src/app/components/Fab.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/app/components/H1.js'),
      this.destinationPath('src/app/components/H1.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/app/components/H2.js'),
      this.destinationPath('src/app/components/H2.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/app/components/H3.js'),
      this.destinationPath('src/app/components/H3.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/app/components/index.js'),
      this.destinationPath('src/app/components/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/app/components/Input.js'),
      this.destinationPath('src/app/components/Input.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/app/components/P.js'),
      this.destinationPath('src/app/components/P.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/app/components/PageNotFound.js'),
      this.destinationPath('src/app/components/PageNotFound.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/app/App.js'),
      this.destinationPath('src/app/App.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/app/index.js'),
      this.destinationPath('src/app/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/app/Intl.js'),
      this.destinationPath('src/app/Intl.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/app/Router.js'),
      this.destinationPath('src/app/Router.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/app/Theme.js'),
      this.destinationPath('src/app/Theme.js'),
      this.props
    );




    this.fs.copyTpl(
      this.templatePath('src/actions/account.js'),
      this.destinationPath('src/actions/account.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/actions/contact.js'),
      this.destinationPath('src/actions/contact.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/actions/index.js'),
      this.destinationPath('src/actions/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/actions/intl.js'),
      this.destinationPath('src/actions/intl.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/actions/todo.js'),
      this.destinationPath('src/actions/todo.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('src/actions/types.js'),
      this.destinationPath('src/actions/types.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('server/index.js'),
      this.destinationPath('server/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('server/index.js'),
      this.destinationPath('server/index.js'),
      this.props
    );


    this.fs.copyTpl(
      this.templatePath('messages/_default.js'),
      this.destinationPath('messages/_default.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('messages/zh_CN.js'),
      this.destinationPath('messages/zh_CN.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('messages/zh_HK.js'),
      this.destinationPath('messages/zh_HK.js'),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('config/base/development.json'),
      this.destinationPath('config/base/development.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('config/base/production.json'),
      this.destinationPath('config/base/production.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('config/base/staging.json'),
      this.destinationPath('config/base/staging.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('config/base/testing.json'),
      this.destinationPath('config/base/testing.json'),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('config/pm2/pm2.production.json'),
      this.destinationPath('config/pm2/pm2.production.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('config/pm2/pm2.staging.json'),
      this.destinationPath('config/pm2/pm2.staging.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('config/pm2/pm2.testing.json'),
      this.destinationPath('config/pm2/pm2.testing.json'),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('config/webpack/base.js'),
      this.destinationPath('config/webpack/base.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('config/webpack/development.js'),
      this.destinationPath('config/webpack/development.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('config/webpack/production.js'),
      this.destinationPath('config/webpack/production.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('config/webpack/staging.js'),
      this.destinationPath('config/webpack/staging.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('config/webpack/testing.js'),
      this.destinationPath('config/webpack/testing.js'),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('.vscode/launch.json'),
      this.destinationPath('.vscode/launch.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('.vscode/settings.json'),
      this.destinationPath('.vscode/settings.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('.vscode/snippets/javascript.json'),
      this.destinationPath('.vscode/snippets/javascript.json'),
      this.props
    );
    mkdirp.sync(this.destinationPath('__test__'));
  }

  conflicts() {
    // Where conflicts are handled (used internally)
  }

  install() {
    // Where installations are run (npm, bower)
    this.installDependencies({
      bower: false
    });
  }

  end() {
    // Called last, cleanup, say good bye, etc
  }
};
