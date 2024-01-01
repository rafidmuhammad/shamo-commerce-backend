class Transaction {
    constructor(user, address, paymentMethod, totalPrice, totalShipping, status) {
        this.user = user;
        this.address = address;
        this.paymentMethod = paymentMethod;
        this.totalPrice = totalPrice;
        this.totalShipping = totalShipping;
        this.status = status;
    }
}