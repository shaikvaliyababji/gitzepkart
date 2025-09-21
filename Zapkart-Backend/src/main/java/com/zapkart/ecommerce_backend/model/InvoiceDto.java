package com.zapkart.ecommerce_backend.model;

import java.time.LocalDateTime;
import java.util.List;

public class InvoiceDto {
    private String customerName;
    private long customerId;
    private String razorpayOrderId;
    private LocalDateTime orderDate;
    private double totalAmount;
    private List<InvoiceItemDto> items;
	public String getCustomerName() {
		return customerName;
	}
	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}
	public long getCustomerId() {
		return customerId;
	}
	public void setCustomerId(long customerId) {
		this.customerId = customerId;
	}
	public String getRazorpayOrderId() {
		return razorpayOrderId;
	}
	public void setRazorpayOrderId(String razorpayOrderId) {
		this.razorpayOrderId = razorpayOrderId;
	}
	public LocalDateTime getOrderDate() {
		return orderDate;
	}
	public void setOrderDate(LocalDateTime orderDate) {
		this.orderDate = orderDate;
	}
	public double getTotalAmount() {
		return totalAmount;
	}
	public void setTotalAmount(double totalAmount) {
		this.totalAmount = totalAmount;
	}
	public List<InvoiceItemDto> getItems() {
		return items;
	}
	public void setItems(List<InvoiceItemDto> items) {
		this.items = items;
	}
	
    

    // Getters and Setters
}
