class Receipt {

	constructor(jsonBody){
		this.id = jsonBody["id"];
		this.created_at = new Date( jsonBody["created_at"]);
		this.updated_at = this.created_at;
		this.currencyCode = jsonBody["currencyCode"];
		this.customerId = jsonBody["customerId"];
		this.is_delete = jsonBody["is_delete"];
		if( jsonBody.hasOwnProperty("amountCash")) {
			this.amountCash = jsonBody["amountCash"];
		}else{
			this.amountCash = 0;
		}
		if( jsonBody.hasOwnProperty("amountMobile")) {
			this.amountMobile = jsonBody["amountMobile"];
		}else{
			this.amountMobile = 0;
		}
		if( jsonBody.hasOwnProperty("amountLoan")) {
			this.amountLoan = jsonBody["amountLoan"];
		}else{
			this.amountLoan = 0;
		}
		if( jsonBody.hasOwnProperty("amountCard")) {
			this.amountCard = jsonBody["amountCard"];
		}else{
			this.amountCard = 0;
		}
		this.siteId = jsonBody["siteId"];
		this.paymentType = jsonBody["paymentType"];	//
		this.salesChannelId = jsonBody["salesChannelId"];
		this.customerTypeId = jsonBody["customerTypeId"];
		this.total = jsonBody["total"];
		this.cogs = jsonBody["cogs"];
		this.receiptId = jsonBody["receiptId"];
		this.products = jsonBody["products"].map( product =>{
			return {
				created_at: this.created_at,
				updated_at: this.updated_at,
				currencyCode: this.currencyCode,
				priceTotal:product.priceTotal,
				quantity:product.quantity,
				receiptId:this.id,
				productId: product.productId,
				cogsTotal: product.cogsTotal,
				active: product.active === 0 ? 0 : 1
			}
		});
	}


	classToPlain() {
		return this;
	}

	// classToPlain() {
	// 	return {
	// 		id:this._id,
	// 		created_at:this._created_at,
	// 		currencyCode: this._currencyCode,
	// 		customerId: this._customerId,
	// 		amountCash: this._amountCash,
	// 		amountMobile: this._amountMobile,
	// 		amountLoan: this._amountLoan,
	// 		receiptId: this._receiptId,
	// 		siteId: this._siteId,
	// 		created_at: this._created_at,
	// 		total: this._totalSales,
	// 		receiptId: this._cogs,
	// 		products: this._products,
	// 		salesChannelId: this._salesChannelId
	// 	}
	// }

}

module.exports = Receipt;
