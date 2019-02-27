import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { SettingsService } from '../settings.service';
import { CommonService } from '../../shared/services/common/common.service';

@Component({
    selector: 'app-vim-create',
    templateUrl: './vim-create.component.html',
    styleUrls: [ './vim-create.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class VimCreateComponent implements OnInit {
    loading: boolean;
    vimForm: FormGroup;
    openstackForm: FormGroup;
    kubernetesForm: FormGroup;
    vimTypes = [ 'Openstack', 'Kubernetes' ];
    vimType: string;
    disabledButton = true;
    externalRouters: Array<string>;
    externalNetworks: Array<string>;

    constructor(
        private settingsService: SettingsService,
        private commonService: CommonService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.vimForm = new FormGroup({
            name: new FormControl('', Validators.required),
            city: new FormControl(),
            country: new FormControl(),
            endpoint: new FormControl('', [
                Validators.required,
                Validators.pattern('(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)')
            ])
        });
        this.openstackForm = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
            tenant: new FormControl('', Validators.required),
            domain: new FormControl(),
            networkEndpoint: new FormControl('',
                Validators.pattern('(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)')),
            privateNetwork: new FormControl('', [
                Validators.required,
                Validators.pattern('(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)')
            ]),
            privateNetworkMask: new FormControl('', [ Validators.required, Validators.pattern('([1-9]|1[0-9]|2[0-9]|3[0])') ]),
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

    checkJSONValidity() {
        try {
            JSON.parse(this.kubernetesForm.get('config').value);
        } catch (error) {
            return false;
        }
        return true;
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
                this.commonService.openSnackBar(message, '');
                this.close();
            })
            .catch(() => {
                this.loading = false;
                this.commonService.openSnackBar('There was an error in the VIM creation', '');
            });
    }

    close() {
        this.router.navigate([ '../' ], { relativeTo: this.route });
    }
}
