
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PfComponent } from './pf.component';

const routes: Routes = [
    {
        path: '',
        component: PfComponent,
        pathMatch: 'prefix',
        children: [
            { path: 'fund', loadChildren: () => import('./fund/fund.module').then(m => m.FundModule), pathMatch: 'prefix' },
            { path: 'pfReport', loadChildren: () => import('./pf-report/pf-report.module').then(m => m.PfReportModule), pathMatch: 'prefix' },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class pfRoutingModule { }