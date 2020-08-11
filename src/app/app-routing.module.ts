import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { MapsComponent } from './maps/maps.component';


const routes: Routes = [  {path: '', component: MapsComponent},
{path: 'landingpage', component: LandingpageComponent},  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
