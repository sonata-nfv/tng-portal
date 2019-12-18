[![Build Status](https://jenkins.sonata-nfv.eu/buildStatus/icon?job=tng-portal/master)](https://jenkins.sonata-nfv.eu/job/tng-portal/master)
[![Join the chat at https://gitter.im/sonata-nfv/Lobby](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/sonata-nfv/Lobby)

<p align="center"><img src="https://github.com/sonata-nfv/tng-portal/wiki/images/sonata-5gtango-logo-500px.png" /></p>
# 5GTANGO Portal

This repository contains an Angular 7 application for the [5GTANGO](http://5gtango.eu) Portal.

The main function of this web application is to provide a method to unify monitoring, user management and interactions with the Validation and Verification Platform, the Service Platform and with the Service Management. It also supports using the 5GTANGO Service Development Kit, which is further described [below](#sdk-portal).

<p align="center"><img src="https://github.com/sonata-nfv/tng-portal/blob/master/src/assets/images/5GTANGO.gif" /></p>
## Installation

Make sure that you have all the dependencies installed. Then, run the following command to install all the required modules.

```
npm install
```

### Dependencies

- Node.js >= v8.9

```
[sudo] sudo apt-get install -y nodejs

[sudo] npm install -g npm
```

- Angular >= v6 and < v8

```
[sudo] npm install -g @angular/cli@7.2.15
```

- Athens VPN credentials: requests made from the Portal in the development mode need the VPN in order to receive a response.

- Make sure you have installed [Docker](https://docs.docker.com/install/) >= 18.06.0-ce if you are going to deploy the Portal like this.

## Developing

If you just want to test the app, or start developing something you can quickly serve it with the following. This includes hot reloading for any (HTML/CSS/JS) change.

```
ng serve --host development --open
```
*Note: You need to register the development domain in your `/etc/hosts` next to the localhost declaration*

### Running a docker container

If you want to launch a container locally, place yourself in the Dockerfile folder and try the following:

```
[sudo] docker build -t tng-portal .
[sudo] docker run -p 80:4200 tng-portal
```

The container should be up and running in http://0.0.0.0:80.

*Note: The port where the app will run when using the Docker container can be set in `./Dockerfile`. By default, 4200 is set.*

## Configuration
Portal allows two different configurations: the base URL of the deployment and the displayed sections of the menu.

### Routes to the services
The routes to the services for this project are defined in the `config.service.ts` file placed in `/src/app/shared/services/config/config.service.ts`.

When launched in development mode, by default the used services come from:

- For SP: `http://pre-int-sp-ath.5gtango.eu:32002`
- For V&V: `http://pre-int-vnv-bcn.5gtango.eu:32002`
- For SDK: `http://localhost`

*Note: When deployed in production the Portal takes the URL of the domain where it was deployed so there is no need to configure it.*

### Menu sections displayed

There is a configuration variable called `features_available` that defines the sections that can be shown in the deployed app. 

When deploying locally, the file containing this variable is `/src/config.json`. Through removing or adding the names of the menu sections, the Portal will include them.

These are the sections that can be activated:

```
  features_available:  [
	"DASHBOARD",
	"PLATFORMS",
	"SETTINGS",
	"VALIDATION",
	"SERVICE PLATFORM",
	"SERVICE MANAGEMENT",
	"SDK"
  ]
```

When deploying in production, there are three predefined configuration files: `/src/config-sp.json`, `/src/config-vnv.json` and `/src/config-sdk.json` for each of the environments. They configure the Portal automatically to display the sections of interest. The user just needs to declare an environmental variable called `$PLATFORM` with the value `sp`, `vnv` or `sdk`.

## SDK Portal

The SDK Portal is an optional part of the 5GTANGO portal. It provides a simple graphical user interface for creating new NFV projects, generating and editing corresponding network service and VNF descriptors. These NFV projects can then be then be validated, packaged, and downloaded for further usage. 

### Running the SDK Backend

The SDK Portal connects to the 5GTANGO SDK tools, which are installed in a dedicated Docker image. To build or pull the image and run at the project root do:

```bash
# pull from Docker Hub
[sudo] docker pull sonatanfv/tng-sdk-portal-backend
# or build locally
[sudo] docker build --no-cache -f Dockerfile-sdk-portal-backend -t sonatanfv/tng-sdk-portal-backend .

# run
[sudo] docker run -it -p 5098:5098 -p 8888:8888 --rm sonatanfv/tng-sdk-portal-backend
```

### Configuring the SDK Portal to Connect to the Backend

The IP address of the SDK backend container needs to be configured in `config.service.ts` before starting the SDK Portal. For a locally deployed SDK backend container, use `http://localhost`.

### Running the SDK Portal

The SDK Portal is installed and started similar to the regular 5GTANGO Portal, as described above.

#### Running a Dev Server

```bash
npm install
ng serve
```

When running a dev server locally, the browser needs to permit CORS to allow the connection to the service platform when on-boarding packages.
For example, Google Chrome can be started allowing CORS with the following command:

```bash
# linux
google-chrome --disable-web-security --user-data-dir=/tmp/chrome
# windows
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="C:\Users\<username>\tmpChromeSession"
```

#### Running in a Docker Container

Important: Set environmental variable `-e PLATFORM=sdk` when running the container.

```bash
[sudo] docker build -t tng-portal .
[sudo] docker run -p 80:4200 -e PLATFORM=sdk tng-portal
```

## Documentation

The documentation relative to this project can be found in the [Wiki page](https://github.com/sonata-nfv/tng-portal/wiki) of this repository.

## License

The tng-gui is published under Apache 2.0 license. Please see the LICENSE file for more details.

### Lead Developers

The following lead developers are responsible for this repository and have admin rights. They can, for example, merge pull requests.

- Antón Román Portabales (anton.roman@quobis.com)
- Ana Pol González (ana.pol@quobis.com)
- Daniel Fernandez Calvo (daniel.fernandez@quobis.es)
- Stefan Schneider (stefan.schneider@upb.de)

### Feedback-Chanel

- You may use the mailing list [sonata-dev-list](mailto:sonata-dev@lists.atosresearch.eu)
- Gitter room [![Gitter](https://badges.gitter.im/sonata-nfv/Lobby.svg)](https://gitter.im/sonata-nfv/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
