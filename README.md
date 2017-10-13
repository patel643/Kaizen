# Module 2 Group Assignment: Generation Station

CSCI 5117, Fall 2017, [assignment description](https://docs.google.com/document/d/1Z_NWRqz4M6dhsfzU2l9alMWpy0PK0xj38uP8qPEZvdY/edit?usp=sharing)

## App Info:

* Team Name: TODO
* App Name: TODO
* App Link: <https://TODO.herokuapp.com/>

### Students

* First Last, x500@umn.edu
* ...


## Key Features

**Describe the most challenging features you implemented
(one sentence per bullet, maximum 4 bullets):**

* ...


## Screenshots of Site

**[Add a screenshot of each key page (maximum 4)](https://stackoverflow.com/questions/10189356/how-to-add-screenshot-to-readmes-in-github-repository)
along with a very brief caption:**

![](https://media.giphy.com/media/XIqCQx02E1U9W/giphy.gif)


## External Dependencies

**Document integrations with 3rd Party code or services here.
Please do not document required libraries (e.g., Express, Bulma).**

* Library or service name: description of use
* ...

**If there's anything else you would like to disclose about how your project
relied on external code, expertise, or anything else, please disclose that
here:**

//////////////CODE FROM PROJECT TEMPLATE BY MAX////////////////
# Express Project Template

Features:

* based on output of express generator v4.15.0 + handlebars
* add nodemon and `npm run dev`
* add error logging to console
* include bulma, jquery client-side libraries
* include multer for file upload
* include express-mongo-db for db connection management
* include passport and auth0 for authentication

Example code:

* auth
* file upload
* mongodb

## setup and run in development

* create account at [mlab](https://mlab.com/)
* create account at [auth0](https://auth0.com/)
* create file `.env` in root of project, something like this:

```
    DEBUG=app:*
    AUTH0_DOMAIN=TODO.auth0.com
    AUTH0_CLIENT_ID=TODO
    AUTH0_CLIENT_SECRET=TODO
    AUTH0_CALLBACK_URL=http://localhost:3000/callback
    DB_URI=mongodb://5117:5117iscool@ec2-54-175-174-41.compute-1.amazonaws.com:80/5117-f17-individual-hw
    SESSION_SECRET=TODOanythingisfinehere
```

* run:

```
    npm run dev
```

## deploy to heroku

* run these commands (one-time setup, or whenever these values need to change):

```
    # add all of the config variables from .env, except DEBUG
    # warning: some of them will require a different value (e.g., AUTH0_CALLBACK_URL)
    heroku config:set AUTH0_DOMAIN=(foo).auth0.com AUTH0_CALLBACK_URL=http://(heroku-dns)/callback
```

* add the callback to "allowed callback URLs" list in auth0 client settings: `http://(heroku-dns).herokuapp.com/callback`

* check the code in and `git push heroku master`
