package com.zapkart.ecommerce_backend.model;

import java.time.LocalDateTime;
import java.util.List;

public class InvoiceResponse {
private String razorpayOrderId;
private Long customerId;
private String customerName;
private LocalDateTime orderDate;
private List<InvoiceItem> items;
private Double totalAmount;
public InvoiceResponse() {}

public InvoiceResponse(String razorpayOrderId, Long customerId, String customerName, LocalDateTime orderDate, List<InvoiceItem> items, Double totalAmount) {
    this.razorpayOrderId = razorpayOrderId;
    this.customerId = customerId;
    this.customerName = customerName;
    this.orderDate = orderDate;
    this.items = items;
    this.totalAmount = totalAmount;
}

public String getRazorpayOrderId() {
	return razorpayOrderId;
}

public void setRazorpayOrderId(String razorpayOrderId) {
	this.razorpayOrderId = razorpayOrderId;
}

public Long getCustomerId() {
	return customerId;
}

public void setCustomerId(Long customerId) {
	this.customerId = customerId;
}

public String getCustomerName() {
	return customerName;
}

public void setCustomerName(String customerName) {
	this.customerName = customerName;
}

public LocalDateTime getOrderDate() {
	return orderDate;
}

public void setOrderDate(LocalDateTime orderDate) {
	this.orderDate = orderDate;
}

public List<InvoiceItem> getItems() {
	return items;
}

public void setItems(List<InvoiceItem> items) {
	this.items = items;
}

public Double getTotalAmount() {
	return totalAmount;
}

public void setTotalAmount(Double totalAmount) {
	this.totalAmount = totalAmount;
}

// Getters and Setters




}