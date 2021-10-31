import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2shopValidators } from 'src/app/validators/luv2shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup:  FormGroup;
  totalPrice: number = 0;
  totalQuantity:number =0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] =[];

  shippingAddressState: State[] =[];
  billingAddressState: State[] =[];


  constructor(private formBuilder: FormBuilder, private _luv2ShopFormService:Luv2ShopFormService,
                                                private _cartService: CartService,
                                                private _checkoutService: CheckoutService,
                                                private _router: Router
                                                ) { }

  ngOnInit(): void {

    this.reviewCartDetails();


    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpace]),
        email: new FormControl('',
          [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
        ),
      }),
      shippingAddress : this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpace]),
        state:  new FormControl('', [Validators.required]),
        country:  new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(6), Luv2shopValidators.notOnlyWhiteSpace]),
      }),
      billingAddress : this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpace]),
        state:  new FormControl('', [Validators.required]),
        country:  new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(6), Luv2shopValidators.notOnlyWhiteSpace]),
      }),
      creditCard : this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), Luv2shopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    //populate credit card month
    const startMonth: number = new Date().getMonth()+1;
    console.log("Start Month: "+startMonth);
    this._luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    )
    //polulate credit card years
    this._luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
      }
    );

    //populate countries
    this._luv2ShopFormService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    )
  }


  reviewCartDetails() {
    // subscribe to cartService.totalQuantity
    this._cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    )

    // subscribe to the cartService.totalPrice
    this._cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    )
  }

  // getters methods
  get firstName(){ return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName'); }
  get email(){ return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressStates(){ return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode(){ return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet(){ return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity(){ return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressStates(){ return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode(){ return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry(){ return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType(){ return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard(){ return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode(){ return this.checkoutFormGroup.get('creditCard.securityCode'); }


  handleMonthsAndYear(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectYear: number = Number(creditCardFormGroup.value.expirationYear);
    // if the current year is equal to the selected year, then start with the current month
    let startMonth: number;
    if(currentYear === selectYear){
      startMonth = new Date().getMonth()+1;
    }else{
      startMonth = 1;
    }
    this._luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    )
  }

  onSubmit(){
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    // setup order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // setup cart items
    const cartItems = this._cartService.cartItems;

    //  create orderId from cart Item
    // old way
    // let orderItems: OrderItem[] = [];
    // for(let i = 0; i < cartItems.length; i++){
    //   orderItems[i] = new OrderItem(cartItems[i]);
    // }

    let orderItems: OrderItem[] = cartItems.map(tempCartItems => new OrderItem(tempCartItems));


    // setup purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;


    // populate purchase - shipping address

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;



    // populate purchase - billing address

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;


    // populate purchase - order and orderItem

    purchase.order = order;
    purchase.orderItems = orderItems;


    // clll REST api via the checkOutService
    this._checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your order has been received \n Order Tracking Number: ${response.orderTrackingNumber}`);
          // reset the cart
          this.resetCart();
        },
        error: err => {
          alert(`There was an error: ${err.message}`)
        }
      }
    );
  }

  resetCart() {
    // reset cart data
    this._cartService.cartItems =[];
    this._cartService.totalPrice.next(0);
    this._cartService.totalQuantity.next(0);
    // reset the form
    this.checkoutFormGroup.reset();
    // navigate back to products page
    this._router.navigateByUrl("/products")

  }

  copyShippingAddressToBillingAddress(event){
    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress
          .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
      //bug fix for states
      this.billingAddressState = this.shippingAddressState

    }else{
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressState = [];
    }
  }

  // get the states nased on states
  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;
    this._luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressState = data;
        }else{
          this.billingAddressState =  data;
        }
        //select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    );

  }
}
