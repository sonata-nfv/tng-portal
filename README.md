[![Build Status](https://jenkins.sonata-nfv.eu/buildStatus/icon?job=tng-portal/master)](https://jenkins.sonata-nfv.eu/job/tng-portal/master)
[![Join the chat at https://gitter.im/sonata-nfv/Lobby](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/sonata-nfv/Lobby)

<p align="center"><img src="https://github.com/sonata-nfv/tng-portal/wiki/images/sonata-5gtango-logo-500px.png" /></p>

# 5GTANGO Portal

This repository contains an Angular 6 application for the [5GTANGO](http://5gtango.eu) Portal.

The main function of this web application is to provide a method to unify monitoring, user management and interactions with the Validation and Verification Platform, the Service Platform and with the Service Management.

<p align="center"><img src="https://github.com/sonata-nfv/tng-portal/blob/master/src/assets/images/5GTANGO.gif" /></p>

## Dependencies

- Node.js >= v8.9

```
[sudo] sudo apt-get install -y nodejs

[sudo] npm install -g npm
```

- Angular >= v6

```
[sudo] npm install -g @angular/cli
```

## Installation

Make sure that you have all the dependencies installed. Then, run the following command to install all the required modules.

```
npm install
```

## Running a dev server

If you just want to test the app, or start developing something you can quickly serve it with the following. This includes hot reloading for any (html/css/js) change.

```
ng serve --aot --open
```

### Running dependencies

Requests made from the Portal in the development mode need the VPN in order to receive a response.

- Athens VPN credentials

## Running a docker container

If you want to launch a container locally, place yourself in the Dockerfile folder and try the following:

```
[sudo] docker build -t tng-portal .
[sudo] docker run -p 80:4200 tng-portal
```

The container should be up and running in http://0.0.0.0:80.

### Exposed port in docker container

The port where the app will run when using the Docker container can be set in `./Dockerfile`. By default, 4200 is set.

### Docker dependencies

Make sure you have installed Docker >= 18.06.0-ce

- [https://docs.docker.com/install/](https://docs.docker.com/install/)

## Configuration parameters

The routes to the services for this project are defined in the config.service.ts file placed in `/src/app/shared/services/config/config.service.ts`.

By default, if the Portal is launched locally, the used services come from:

- For SP: `http://pre-int-sp-ath.5gtango.eu:32002`
- For V&V: `http://pre-int-vnv-bcn.5gtango.eu:32002`
- For SDK: `http://localhost`

### Menu sections displayed

Depending on the deployed modules in the infraestructure, the menu will display only those available. For that, there is a configuration variable called `features_available` in `/src/config.json`.

These are the sections that can be activated:

```
  features_available:  [
	"DASHBOARD",
	"PLATFORMS",
	"SETTINGS",
	"SDK",
	"USERS",
	"CONFIGURATION",
	"VALIDATION",
	"SERVICE PLATFORM",
	"SERVICE MANAGEMENT"
  ]
```

To remove any of them from the menu just erase the desired item from the configuration variable and compile the project again.

For SP, V&V, and SDK environments there is already a config predefined that will only display the sections of interest.

*Note: The SDK functionality is currently separated and only available in the [`sdk` branch](https://github.com/sonata-nfv/tng-portal/tree/sdk) of the repository.*

## Documentation

The documentation relative to this project can be found in the [Wiki page](https://github.com/sonata-nfv/tng-portal/wiki) of this repository.

## License

The tng-gui is published under Apache 2.0 license. Please see the LICENSE file for more details.

#### Lead Developers

The following lead developers are responsible for this repository and have admin rights. They can, for example, merge pull requests.

- Antón Román Portabales (anton.roman@quobis.com)
- Ana Pol González (ana.pol@quobis.com)
- Daniel Fernandez Calvo (daniel.fernandez@quobis.es)

#### Feedback-Chanel

- You may use the mailing list [tango-5g-wp2@lists.atosresearch.eu](mailto:tango-5g-wp2@lists.atosresearch.eu)
- [GitHub issues](https://github.com/sonata-nfv/tng-gui/issues)
