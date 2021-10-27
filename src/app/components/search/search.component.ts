import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  doSearch(value:string){
    console.log(`${value}`);
    this._router.navigateByUrl(`/search/${value}`);
  }

}
