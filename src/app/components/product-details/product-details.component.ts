import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: Product = new Product();

  constructor(private _productService: ProductService, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(()=> {
      this.handleProductDetails();
    })
  }
  handleProductDetails() {
    //get the id param string. convert string to a number using the + operator
    const theProductId: number = +this._route.snapshot.paramMap.get('id');
    this._productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      }
    )
  }

}
