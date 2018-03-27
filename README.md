# 5GTANGO Portal

This repository contains an Angular 5 application for the [5GTANGO](http://5gtango.eu) (web) Portal.

![](https://github.com/sonata-nfv/tng-portal/tree/master/src/assets/images/5GTANGO.gif)

## Installing

Make sure that you have npm installed. Then, run the following command to install all the required packages and dependences.

```
npm install
```

## Running a dev server

If you just want to test the app, or start developing something you can quickly serve it with the following. This includes hot reloading for any (html/css/js) change.

```
ng serve --open
```

### Authentication service

The authentication and registration of the users is made through [son-gkeeper](https://github.com/sonata-nfv/son-gkeeper) at the moment. The repository is organized by micro-services provided in their own containers created with docker. A docker-compose.yml provides the linking of all the micro-services.

Currently, docker repositories of this project are private. In order to access them it is necessary to be connected to the Athens VPN.

#### Dependencies

* Athens VPN credentials
* docker
* docker-compose

#### Building the Gatekeeper

```
docker-compose up -d
```

## Configuration parameters

The routes to the services for this project are defined in the config.json file placed in `/src/config.json`

### Configuration of the menu items displayed

Depending on the deployed modules in the infraestructure, the menu will display only those available. For that, there is a configuration variable called `features_available` in `/src/environments/environment.ts`.

By default, all the modules are activated:

```
  features_available:  [
    "DASHBOARD",
    "USERS",
    "V&V",
    "SERVICE PLATFORM",
    "SERVICE MANAGEMENT"
  ]
```

To remove any of them from the menu just erase the desired item from the configuration variable and compile the project again.

## License

The tng-gui is published under Apache 2.0 license. Please see the LICENSE file for more details.

#### Lead Developers

The following lead developers are responsible for this repository and have admin rights. They can, for example, merge pull requests.

* Antón Román Portabales
* Ana Pol González

#### Feedback-Chanel

* You may use the mailing list [tango-5g-wp2@lists.atosresearch.eu](mailto:tango-5g-wp2@lists.atosresearch.eu)
* [GitHub issues](https://github.com/sonata-nfv/tng-gui/issues)
