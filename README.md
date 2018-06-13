# 5GTANGO Portal

This repository contains an Angular 6 application for the [5GTANGO](http://5gtango.eu) (web) Portal.

![](https://github.com/sonata-nfv/tng-portal/blob/master/src/assets/images/5GTANGO.gif)

## Installing

Make sure that you have npm installed. Then, run the following command to install all the required packages and dependences.

```
npm install
```

### Installation dependencies

- Node.js >= v8.9

## Running a dev server

If you just want to test the app, or start developing something you can quickly serve it with the following. This includes hot reloading for any (html/css/js) change.

```
ng serve --open
```

### Running dependencies

Requests made from the Portal in the development mode need the VPN in order to receive a response.

- Athens VPN credentials

## Configuration parameters

The routes to the services for this project are defined in the config.service.ts file placed in `/src/app/shared/services/config/config.service.ts`.

By default, if the Portal is launched locally, the used services will be those in `http://pre-int-sp-ath.5gtango.eu:32002`.

### Menu sections displayed

Depending on the deployed modules in the infraestructure, the menu will display only those available. For that, there is a configuration variable called `features_available` in `/src/environments/environment.ts` and in `/src/environments/environment.prod.ts`.

These are the sections that can be activated:

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

- Antón Román Portabales
- Ana Pol González

#### Feedback-Chanel

- You may use the mailing list [tango-5g-wp2@lists.atosresearch.eu](mailto:tango-5g-wp2@lists.atosresearch.eu)
- [GitHub issues](https://github.com/sonata-nfv/tng-gui/issues)
