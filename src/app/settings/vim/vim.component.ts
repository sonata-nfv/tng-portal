import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { InputErrorStateMatcher } from '../../shared/classes/input-error-state-matcher';

import { SettingsService } from '../settings.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
    selector: 'app-vim',
    templateUrl: './vim.component.html',
    styleUrls: [ './vim.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class VimComponent implements OnInit {
    loading: boolean;
    edition: boolean;
    editingConfig: boolean;
    detail: Object;
    vimForm: FormGroup;
    openstackForm: FormGroup;
    kubernetesForm: FormGroup;
    matcher: InputErrorStateMatcher;
    vimTypes = [ 'Openstack', 'Kubernetes' ];
    vimType: string;
    disabledButton = true;
    externalRouters: Array<string>;
    externalNetworks: Array<string>;

    constructor(
        private settingsService: SettingsService,
        private utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.initForms();
        this.route.params.subscribe(params => {
            const uuid = params[ 'id' ];
            this.edition = uuid ? true : false;
            this.editingConfig = false;
            if (this.edition) {
                this.requestVim(uuid);
            }
        });

    }

    /**
    * Generates the HTTP request of a VIM by UUID.
    *
    * @param uuid ID of the selected VIM to be displayed.
    *             Comming from the route.
    */
    private requestVim(uuid) {
        this.loading = true;
        this.settingsService
            .getOneVim(uuid)
            .then(response => {
                this.loading = false;
                if (response) {
                    this.detail = Object.assign({}, response);
                    this.detail[ 'type' ] = this.detail[ 'type' ] === 'k8s' ? 'Kubernetes' : 'Openstack';
                    this.vimType = this.detail[ 'type' ];
                } else {
                    this.close();
                }
            })
            .catch(() => {
                this.loading = false;
                this.close();
            });
    }

    private initForms() {
        this.matcher = new InputErrorStateMatcher();

        this.vimForm = new FormGroup({
            name: new FormControl('', Validators.required),
            city: new FormControl(),
            country: new FormControl(),
            endpoint: new FormControl('', [
                Validators.required,
                Validators.pattern(this.utilsService.getIpPattern())
            ])
        });
        this.openstackForm = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
            tenant: new FormControl('', Validators.required),
            domain: new FormControl(),
            networkEndpoint: new FormControl('', Validators.pattern(this.utilsService.getIpPattern())),
            privateNetwork: new FormControl('', [
                Validators.required,
                Validators.pattern(this.utilsService.getIpPattern())
            ]),
            privateNetworkMask: new FormControl('', [ Validators.required, Validators.pattern(this.utilsService.getMaskPattern()) ]),
            externalNetworkID: new FormControl('', Validators.required),
            externalRouterID: new FormControl('', Validators.required)
        });
        this.kubernetesForm = new FormGroup({
            config: new FormControl('', Validators.required)
        });

        this.vimForm.valueChanges.subscribe(value =>
            this.onFormChanges(value)
        );
        this.kubernetesForm.valueChanges.subscribe(value =>
            this.onFormChanges(value)
        );
        this.openstackForm.valueChanges.subscribe(value =>
            this.onFormChanges(value)
        );
    }

    private onFormChanges(values?) {
        switch (this.vimType) {
            case 'Openstack':
                this.disabledButton =
                    this.vimForm.valid && this.openstackForm.valid ? false : true;
                break;
            case 'Kubernetes':
                this.disabledButton = (this.kubernetesForm.valid && this.vimForm.valid) && this.checkJSONValidity() ? false : true;
                break;
            default:
                this.disabledButton = false;
                break;
        }
    }

    private getVimData() {
        const vim = {
            name: this.vimForm.get('name').value,
            city: this.vimForm.get('city').value,
            country: this.vimForm.get('country').value,
            endpoint: this.vimForm.get('endpoint').value
        };

        if (this.vimType === 'Openstack') {
            vim[ 'username' ] = this.openstackForm.get('username').value;
            vim[ 'password' ] = this.openstackForm.get('password').value;
            vim[ 'tenant' ] = this.openstackForm.get('tenant').value;
            vim[ 'domain' ] = this.openstackForm.get('domain').value;
            vim[ 'network_endpoint' ] = this.openstackForm.get('networkEndpoint').value;
            vim[ 'private_network_prefix' ] = this.openstackForm.get('privateNetwork').value;
            vim[ 'private_network_length' ] = this.openstackForm.get('privateNetworkMask').value;
            vim[ 'external_network_id' ] = this.openstackForm.get('externalNetworkID').value;
            vim[ 'external_router_id' ] = this.openstackForm.get('externalRouterID').value;
        } else {
            vim[ 'config' ] = JSON.parse(this.kubernetesForm.get('config').value);
        }

        return vim;
    }

    receiveType(type) {
        this.vimType = type;
        this.onFormChanges();
    }

    createVim() {
        this.loading = true;
        const vim = this.getVimData();

        this.settingsService
            .postVim(this.vimType, vim)
            .then(message => {
                if (!message) {
                    throw new Error();
                }
                this.loading = false;
                this.utilsService.openSnackBar(message, '');
                this.close();
            })
            .catch(() => {
                this.loading = false;
                this.utilsService.openSnackBar('There was an error in the VIM creation', '');
            });
    }

    checkJSONValidity() {
        try {
            JSON.parse(this.kubernetesForm.get('config').value);
        } catch (error) {
            return false;
        }
        return true;
    }

    copyToClipboard(value) {
        this.utilsService.copyToClipboard(value);
    }

    copyJSONToClipboard(value) {
        this.utilsService.copyToClipboard(JSON.stringify(value));
    }

    canShowForm() {
        if (this.edition && this.detail) {
            return true;
        } else if (!this.edition) {
            return true;
        } else {
            return false;
        }
    }

    getJSONStringify(value) {
        return JSON.stringify(value);
    }

    deleteVim() {
        this.loading = true;
        this.settingsService.deleteVim(this.detail[ 'uuid' ]).then(message => {
            this.loading = false;
            if (!message) {
                throw new Error();
            }
            this.utilsService.openSnackBar(message, '');
            this.close();
        }).catch(() => {
            this.loading = false;
            this.utilsService.openSnackBar('There was an error deleting the VIM', '');
        });
    }

    close() {
        this.router.navigate([ '../' ], { relativeTo: this.route });
    }
}
