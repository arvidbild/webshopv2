"use strict";

// This is a Javascript Constructor function

module.exports = function Cart (oldCart) {

	//Assign the old cart values to the Cart
	this.items = oldCart.items || {}; 
	this.totalQty = oldCart.totalQty || 0; 
	this.totalPrice = oldCart.totalPrice ||0; 

	//Function that add new Item to Cart
	this.add = function (item, id){
	

		//Checks if the Item already exist in the Cart or not. 
		var storedItem = this.items[id];
		if(!storedItem) {
			storedItem = this.items[id] = {item: item, qty: 0, price: 0};
		}
		storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
	}

	this.reduce = function (id) {

		this.items[id].qty--;
		this.items[id].price -= this.items[id].item.price;
		this.totalQty--;
		this.totalPrice-= this.items[id].item.price;

		if (this.items[id].qty <= 0) {
			delete this.items[id];
		};
	};

	this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };

}