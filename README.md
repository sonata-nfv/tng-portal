# 5GTANGO Portal

This repo contains an Angular app for the [5GTANGO](http://5gtango.eu) (web) Portal.

## Installing

Make sure that you have npm installed. Then, run the following command to install all the required packages and dependences.

```
npm install
```

### Authentication service

The authentication and registration of the users is made through [son-gkeeper](https://github.com/sonata-nfv/son-gkeeper). The repository is organized by micro-services provided in their own containers created with docker. A docker-compose.yml provides the linking of all the micro-services.

Currently, docker repositories of this project are private. In order to access them it is necessary to be connected to the Athens VPN.

#### Dependencies

* Athens VPN credentials
* docker
* docker-compose

#### Building the Gatekeeper

```
docker-compose up -d
```

## Running a dev server

If you just want to test the app, or start developing something you can quickly serve it with the following. This includes hot reloading for any (html/css/js) change.

```
ng serve --open
```

### Configuration parameters

The different endpoints needed for this project are defined in the config.json file placed inside /src.

## License

The tng-gui is published under Apache 2.0 license. Please see the LICENSE file for more details.

#### Lead Developers

The following lead developers are responsible for this repository and have admin rights. They can, for example, merge pull requests.

* Antón Román Portabales
* Ana Pol González

#### Feedback-Chanel

* You may use the mailing list [tango-5g-wp2@lists.atosresearch.eu](mailto:tango-5g-wp2@lists.atosresearch.eu)
* [GitHub issues](https://github.com/sonata-nfv/tng-gui/issues)
