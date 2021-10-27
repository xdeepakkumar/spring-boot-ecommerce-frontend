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

  products: Product[];
  currentCategoryId: number;
  currentCategoryName: string;
  searchMode: boolean;

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
    // search for the products using keyword
    this._productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
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

     this._productService.getProductList(this.currentCategoryId).subscribe(
       data => {
         this.products = data;
       }
     )
  }
}
