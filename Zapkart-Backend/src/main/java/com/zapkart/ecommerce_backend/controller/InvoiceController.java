	package com.zapkart.ecommerce_backend.controller;
	
	import com.zapkart.ecommerce_backend.model.Invoice;
import com.zapkart.ecommerce_backend.model.InvoiceResponse;
import com.zapkart.ecommerce_backend.service.InvoiceService;
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
	import org.springframework.stereotype.Controller;
	import org.springframework.ui.Model;
	import org.springframework.web.bind.annotation.GetMapping;
	import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
	
	@Controller
	public class InvoiceController {
	
	    @Autowired
	    private InvoiceService invoiceService;
	    

	    @PostMapping("/create/{productId}/{quantity}")
	    @ResponseBody
	    public Invoice createInvoice(@PathVariable Long productId, @PathVariable Integer quantity) {
	        return invoiceService.createInvoice(productId, quantity);
	    }
	
	    @GetMapping("/invoice/{id}")
	    public String getInvoice(@PathVariable Long id, Model model) {
	        // Fetch the invoice by ID
	        Invoice invoice = invoiceService.getInvoiceById(id);
	        
	        // Add the invoice object to the model
	        model.addAttribute("invoice", invoice);
	        
	        // Return the HTML template to be rendered
	        return "invoice"; // Thymeleaf will automatically resolve this to /resources/templates/invoice.html
	    }
	
	    @GetMapping("/invoice/download/{id}")
	    public ResponseEntity<ByteArrayResource> downloadInvoice(@PathVariable Long id) throws Exception {
	        // Fetch the invoice by ID
	        Invoice invoice = invoiceService.getInvoiceById(id);
	
	        // Generate HTML content for the invoice (you can also use Thymeleaf to render it)
	        String invoiceHtml = "<html><body>"
	                + "<h1>Invoice for " + invoice.getProductName() + "</h1>"
	                + "<p>Price: " + invoice.getPrice() + "</p>"
	                + "<p>Quantity: " + invoice.getQuantity() + "</p>"
	                + "<p>Total: " + invoice.getTotalAmount() + "</p>"
	                + "</body></html>";
	
	        // Convert HTML content to byte array
	        byte[] byteArray = invoiceHtml.getBytes();
	
	        // Create a ByteArrayResource to serve the file
	        ByteArrayResource resource = new ByteArrayResource(byteArray);
	
	        // Set headers for file download
	        return ResponseEntity.ok()
	                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=invoice_" + id + ".html")
	                .contentLength(byteArray.length)
	                .body(resource);
	    }
	    @GetMapping("/invoice/razorpay/{orderId}")
	    @ResponseBody
	    public InvoiceResponse generateInvoiceByRazorpayOrderId(@PathVariable String orderId) {
	        return invoiceService.generateInvoiceByRazorpayOrderId(orderId);
	    }
	    
	    @GetMapping("/invoice/view/razorpay/{orderId}")
	    public String viewInvoiceByRazorpayOrderId(@PathVariable String orderId, Model model) {
	        InvoiceResponse invoiceResponse = invoiceService.generateInvoiceByRazorpayOrderId(orderId);
	        model.addAttribute("invoice", invoiceResponse);
	        return "invoice"; // This should map to `src/main/resources/templates/invoice.html`
	    }
	    
	    @GetMapping("/invoice/download/razorpay/{orderId}")
	    public ResponseEntity<byte[]> downloadInvoicePDF(@PathVariable String orderId) {
	        byte[] pdfBytes = invoiceService.generateInvoicePdf(orderId); // PDF as byte[]

	        HttpHeaders headers = new HttpHeaders();
	        headers.setContentType(MediaType.APPLICATION_PDF);
	        headers.setContentDisposition(ContentDisposition.builder("attachment")
	                .filename("invoice_" + orderId + ".pdf")
	                .build());

	        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
	    }


	}
