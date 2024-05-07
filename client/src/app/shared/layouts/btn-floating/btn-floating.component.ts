import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {MaterialService} from "../../helpers/material.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-btn-floating',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './btn-floating.component.html',
  styleUrl: './btn-floating.component.scss'
})
export class BtnFloatingComponent implements AfterViewInit{
  @ViewChild('floating') floatingRef!: ElementRef;

  ngAfterViewInit(): void {
    MaterialService.FloatingBtn(this.floatingRef);
  }

}
