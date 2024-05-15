import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {BtnFloatingComponent} from "../btn-floating/btn-floating.component";
import {InfoBtnComponent} from "../../components/info-btn/info-btn.component";

@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    BtnFloatingComponent,
    InfoBtnComponent,
  ],
  templateUrl: './site-layout.component.html',
  styleUrl: './site-layout.component.scss'
})
export class SiteLayoutComponent {

}
