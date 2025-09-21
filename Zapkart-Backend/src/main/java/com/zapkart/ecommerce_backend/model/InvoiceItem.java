package com.zapkart.ecommerce_backend.model;

public class InvoiceItem {
private Long productId;
private String productName;
private String brand;
private String model;
private Double price;
private Integer quantity;
private Double total;

public InvoiceItem() {}


public InvoiceItem(Long productId, String productName, String brand, String model,
        Double price, Integer quantity) {
this.productId = productId;
this.productName = productName;
this.brand = brand;
this.model = model;
this.price = price;
this.quantity = quantity;
this.total = price * quantity;
}




public String getBrand() {
	return brand;
}



public void setBrand(String brand) {
	this.brand = brand;
}



public String getModel() {
	return model;
}



public void setModel(String model) {
	this.model = model;
}



public Long getProductId() {
	return productId;
}

public void setProductId(Long productId) {
	this.productId = productId;
}

public String getProductName() {
	return productName;
}

public void setProductName(String productName) {
	this.productName = productName;
}

public Double getPrice() {
	return price;
}

public void setPrice(Double price) {
	this.price = price;
}

public Integer getQuantity() {
	return quantity;
}

public void setQuantity(Integer quantity) {
	this.quantity = quantity;
}

public Double getTotal() {
	return total;
}

public void setTotal(Double total) {
	this.total = total;
}

// Getters and Setters



}