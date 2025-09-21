package com.zapkart.ecommerce_backend.service;

import com.zapkart.ecommerce_backend.model.Invoice;
import com.zapkart.ecommerce_backend.model.InvoiceResponse;

public interface InvoiceService {
    Invoice createInvoice(Long productId, Integer quantity);
    Invoice getInvoiceById(Long id);
    InvoiceResponse generateInvoiceByRazorpayOrderId(String razorpayOrderId);
	byte[] generateInvoicePdf(String orderId);
	
}

