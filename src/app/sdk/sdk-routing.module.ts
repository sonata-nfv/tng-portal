import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';
import { DescriptorGeneratorComponent } from './descriptor-generator/descriptor-generator.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: MainPageComponent,
			}, {
				path: 'descriptor-generator',
				component: DescriptorGeneratorComponent,
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SdkRoutingModule { }
