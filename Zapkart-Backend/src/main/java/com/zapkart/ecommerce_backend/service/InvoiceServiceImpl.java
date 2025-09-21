package com.zapkart.ecommerce_backend.service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zapkart.ecommerce_backend.model.Invoice;
import com.zapkart.ecommerce_backend.model.InvoiceItem;
import com.zapkart.ecommerce_backend.model.InvoiceResponse;
import com.zapkart.ecommerce_backend.model.Order;
import com.zapkart.ecommerce_backend.model.Product;
import com.zapkart.ecommerce_backend.model.User;
import com.zapkart.ecommerce_backend.repository.InvoiceRepository;
import com.zapkart.ecommerce_backend.repository.OrderRepository;
import com.zapkart.ecommerce_backend.repository.ProductRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private OrderRepository orderRepository;

    // Deprecated dummy invoice creator — can be removed if unused
    public Invoice createInvoice(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            throw new RuntimeException("Product not found with ID: " + productId);
        }

        Invoice invoice = new Invoice();
        invoice.setProductId(product.getProductId());
        invoice.setProductName(product.getName());
        invoice.setPrice(product.getPrice());
        invoice.setQuantity(quantity);
        invoice.setTotalAmount(product.getPrice() * quantity);
        return invoiceRepository.save(invoice);
    }

    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id).orElse(null);
    }

    public InvoiceResponse generateInvoiceByRazorpayOrderId(String razorpayOrderId) {
        List<Order> orders = orderRepository.findAll()
                .stream()
                .filter(o -> razorpayOrderId.equals(o.getRazorpayOrderId()))
                .collect(Collectors.toList());

        if (orders.isEmpty()) return null;

        List<InvoiceItem> items = new ArrayList<>();
        double total = 0;

        for (Order order : orders) {
            Product product = order.getProduct();
            if (product == null) continue;

            double itemTotal = product.getPrice() * order.getQuantity();
            total += itemTotal;

            items.add(new InvoiceItem(
                    product.getProductId(),
                    product.getName(),
                    product.getBrand(),    // <-- new field
                    product.getModel(),    // <-- new field
                    product.getPrice(),
                    order.getQuantity()
            ));

        }

        Order firstOrder = orders.get(0);
        User customer = firstOrder.getCustomer();

        return new InvoiceResponse(
                razorpayOrderId,
                customer.getId(),
                customer.getName(),
                firstOrder.getOrderDate(),
                items,
                total
        );
    }
    
    @Override
    public byte[] generateInvoicePdf(String orderId) {
        InvoiceResponse invoiceResponse = generateInvoiceByRazorpayOrderId(orderId);
        if (invoiceResponse == null) {
            throw new RuntimeException("Invoice not found for order ID: " + orderId);
        }

        String html = generateHtmlFromInvoice(invoiceResponse);

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(html);
            renderer.layout();
            renderer.createPDF(outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error generating invoice PDF");
        }
    }
  
    private String generateHtmlFromInvoice(InvoiceResponse invoice) {
        StringBuilder sb = new StringBuilder();
        sb.append("<!DOCTYPE html>")
          .append("<html>")
          .append("<head>")
          .append("<meta charset='UTF-8'/>")
          .append("<title>Invoice</title>")
          .append("<style>")
          .append("body { font-family: Arial, sans-serif; margin: 20px; background-color: #f9f9f9; }")
          .append(".invoice { background-color: #fff; border: 1px solid #ddd; padding: 20px; width: 80%; margin: 0 auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }")
          .append(".invoice-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; }")
          .append(".logo { width: 120px; height: auto; }")
          .append(".title { flex-grow: 1; text-align: center; font-size: 24px; font-weight: bold; }")
          .append(".invoice-details, .customer-details { margin-bottom: 20px; }")
          .append(".invoice-details p, .customer-details p { margin: 4px 0; }")
          .append(".invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }")
          .append(".invoice-table th, .invoice-table td { border: 1px solid #000; padding: 8px; text-align: center; }")
          .append(".total { text-align: right; font-size: 1.2em; font-weight: bold; }")
          .append(".footer { margin-top: 40px; text-align: center; font-size: 0.9em; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }")
          .append("</style>")
          .append("</head><body>")
          .append("<div class='invoice'>")

          // Header section
          .append("<div class='invoice-header'>")
          .append("<img src='https://drive.google.com/uc?id=14WcJFKD5IHPdsMmqPGmTetZoKVt0APWO' alt='Zapkart Logo' class='logo'/><br/><br/>")
          .append("<div class='title'>Zapkart's Product Invoice</div>")
          .append("</div>")

          // Customer and order details
          .append("<div class='customer-details'>")
          .append("<p><strong>Customer Name:</strong> ").append(invoice.getCustomerName()).append("</p>")
          .append("<p><strong>Customer ID:</strong> ").append(invoice.getCustomerId()).append("</p>")
          .append("</div>")

          .append("<div class='invoice-details'>")
          .append("<p><strong>Order ID:</strong> ").append(invoice.getRazorpayOrderId()).append("</p>")
          .append("<p><strong>Order Date:</strong> ").append(invoice.getOrderDate()).append("</p>")
          .append("</div>")

          // Product table
          .append("<table class='invoice-table'>")
          .append("<thead><tr><th>Product Name</th><th>Price (₹)</th><th>Quantity</th><th>Total (₹)</th></tr></thead>")
          .append("<tbody>");
        for (InvoiceItem item : invoice.getItems()) {
            sb.append("<tr>")
            .append("<td>").append(item.getBrand()).append(" ").append(item.getModel()).append("</td>")
              .append("<td>").append(item.getPrice()).append("</td>")
              .append("<td>").append(item.getQuantity()).append("</td>")
              .append("<td>").append(item.getTotal()).append("</td>")
              .append("</tr>");
        }
        sb.append("</tbody></table>")

          // Total amount
          .append("<div class='total'>")
          .append("Total Amount: ₹").append(invoice.getTotalAmount())
          .append("</div>")

          // Footer
          .append("<div class='footer'>")
          .append("<p>Thank you for shopping with Zapkart!</p>")
          .append("<p>For assistance, contact zapkartteam@gmail.com</p>")
          .append("</div>")

          .append("</div></body></html>");

        return sb.toString();
    }

}