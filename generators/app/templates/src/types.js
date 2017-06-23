/* @flow */

/*
 * DOCUMENTATION
 *
 * This is the centralized area for defining flow type's types. The goal of this
 * is to empower methods and variables with strong-typed annotations, and as a result will
 * greatly reduce bugs and enhance IDE intellisense.

 * Current grouping:
 *    Forms (if differ from its model counter-part)
 *    Models
 *    Reducers
 *    Store States
 *    Actions
 */

// import * as ActionTypes from 'actions/types'; // TODO:: Should use this for Action type instead

/*
 *  START:: FORMS
 */

// FormState
export type Errors = {
  _error?: Array<String>,
  [errorName: String]: String,
};

// FORMS
export type ContactForm = {
  name: string,
  email: string,
  subject: string,
  body: string
};

export type SignUpForm = {
  _id: string,
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  confirmpassword: string
};

export type LoginForm = {
  username: string,
  password: string
};

/*
 *  END:: FORMS
 */

/*
 *  START:: MODELS
 */

export type User = {

};

export type Todo = {
  _id?: string,
  name: string,
  timestamp: number,
  isComplete: bool,
};

/*
 *  END:: MODELS
 */

/*
 *  START:: REDUCERS
 */

export type IntlState = {
  currentLocale: ?string,
  defaultLocale: ?string,
  initialNow: ?number,
  locales: ?Array<string>,
  messages: ?Object,
};

export type AccountState = {
  user: User,
}

export type TodoState = {
  items: Array<Todo>,
}

/*
 *  END:: REDUCERS
 */

/*
 *  BEGIN:: STORE STATE
 */

export type State = {
  account: AccountState,
  intl: IntlState,
  todo: TodoState,
};

/*
 *  END:: STORE STATE
 */


/*
 *  START:: ACTIONS
 */
export type Action =
    {type: "INTL_LOCALE_SET", payload: {locale: string}}
  | {type: "INTL_SET", payload: IntlState}
  | {type: "ACCOUNT_LOGOUT"}
  | {type: "TODOS_FETCH_COMPLETE", payload: Array<Todo>}
  | {name: string, callAPI: Function, shouldCallAPI?: Function, payload?: Object}
  | Function
  ;

  /*
   *  END:: ACTIONS
   */
