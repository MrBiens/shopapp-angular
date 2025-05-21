import { Injectable } from "@angular/core";
import { ProductService } from "./product.service";
// import { LocalStorageService} from 'ngx-webstorage';
@Injectable({
    providedIn:'root'
})

export class CartService {
    private cart: Map<number,number> = new Map(); //id - quantity

    constructor(
    ){
        //lay du lieu gio hang tu localstorage khi khoi tao service
        const storedCart = localStorage.getItem('cart');
        if(storedCart){
            this.cart=new Map(JSON.parse(storedCart));
        }
    }

    addToCart(productId:number,quantity:number=1):void{
        debugger;
        if(this.cart.has(productId)){
            //neu sp da co thi tang sl 
            this.cart.set(productId,this.cart.get(productId)!+quantity)
        }else{
            this.cart.set(productId,quantity)
        }
        this.saveCartToLocalStorage();
    }



    getCart(): Map<number,number> {
        return this.cart;
    }

    saveCartToLocalStorage(){
        localStorage.setItem('cart',JSON.stringify(Array.from(this.cart.entries())))
    }

    clearCart():void{
        this.cart.clear(); // lam moi cart
        this.saveCartToLocalStorage(); //luu lai thay doi
    }

    removeCart(productId:number):void{
        if(this.cart.has(productId)){
            this.cart.delete(productId);
            this.saveCartToLocalStorage();
        }
    }
    







}