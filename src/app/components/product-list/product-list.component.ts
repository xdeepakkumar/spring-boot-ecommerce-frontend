import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId:number = 1;
  searchMode: boolean = false;
  currentCategoryName: string;

  //new properties for the pagination
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;

  previousKeyword: string;


  constructor(private _productService: ProductService, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(()=> {
      this.listProducts();
    });
  }

  listProducts(){
    this.searchMode = this._route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleHandleSearchProduct();
    }else{
      this.handleListProducts();
    }
  }
  handleHandleSearchProduct() {
    const theKeyword: string = this._route.snapshot.paramMap.get('keyword');

    // if we have different keyword than previous the set the pagenumber as 1
    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    // search for the products using keyword
    //
    this._productService.searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, theKeyword).subscribe(
      this.processResult()
    );

  }

  handleListProducts(){
     //check if ID parameter is available
     const hasCategoryId: boolean = this._route.snapshot.paramMap.has('id');
     if (hasCategoryId) {
       // get the "id" param string. convert string to a number using the "+" symbol
       this.currentCategoryId = +this._route.snapshot.paramMap.get('id');

       // get the "name" param string
       this.currentCategoryName = this._route.snapshot.paramMap.get('name');
     }else{
       this.currentCategoryId = 1;
       this.currentCategoryName = 'Books';
     }

     //
     // if we have a different category id than previous
     // then set the pageNumber back to 1
     //
     if(this.previousCategoryId != this.currentCategoryId){
       this.thePageNumber = 1;
     }

     this.previousCategoryId = this.currentCategoryId;

     this._productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(
       this.processResult()
     );
  }
  processResult() {
   return data => {
     this.products = data._embedded.products;
     this.thePageNumber = data.page.number + 1;
     this.thePageSize = data.page.size;
     this.theTotalElements = data.page.totalElements;
   }
  }

  updatePageSize(pageSize: number){
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }
}
