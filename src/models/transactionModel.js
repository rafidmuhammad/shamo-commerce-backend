class Transaction {
    constructor(user_id, address, paymentMethod, totalPrice, totalShipping, status) {
        this.user_id = user_id;
        this.address = address;
        this.paymentMethod = paymentMethod;
        this.totalPrice = totalPrice;
        this.totalShipping = totalShipping;
        this.status = status;
    }
}