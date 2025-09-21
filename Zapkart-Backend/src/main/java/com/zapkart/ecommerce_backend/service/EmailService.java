package com.zapkart.ecommerce_backend.service;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import com.zapkart.ecommerce_backend.model.EmailDetails;
import com.zapkart.ecommerce_backend.model.InvoiceDto;
import com.zapkart.ecommerce_backend.model.InvoiceItemDto;
import com.zapkart.ecommerce_backend.model.Order;
import com.zapkart.ecommerce_backend.model.User;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

	@Autowired
	JavaMailSender javaMailSender;
	
	  @Autowired
	  private TemplateEngine templateEngine; // 🧠 Add this
	
	public void sendEmail(String to,String subject,String body) {
		
		try {
			MimeMessage message=javaMailSender.createMimeMessage();
			MimeMessageHelper	helper = new MimeMessageHelper(message,true);
			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText(body);
			javaMailSender.send(message);
			
		} catch (MessagingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	final String sender = "chaitanyavinjamuri@gmail.com";

	  public String sendHtmlMail(EmailDetails details) {
	    try {
	      MimeMessage message = javaMailSender.createMimeMessage();
	      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

	      helper.setFrom("chaitanyavinjamuri@gmail.com", "Zapkart Support"); // ✅ From name customized
	      helper.setTo(details.getRecipient());
	      helper.setSubject(details.getSubject());
	      helper.setText(details.getMsgBody(), true); // ✅ true = HTML mode

	      javaMailSender.send(message);
	      return "Mail Sent Successfully...";
	    } catch (MessagingException | UnsupportedEncodingException e) {
	      e.printStackTrace();
	      return "Error while Sending Mail";
	    }
	  }
	  
	  public void sendHtmlInvoice(User user, Order order) {
		    InvoiceDto invoiceDto = buildInvoiceDto(user, order);

		    Context context = new Context();
		    context.setVariable("invoice", invoiceDto);

		    String htmlContent = templateEngine.process("invoice", context);

		    MimeMessage mimeMessage = javaMailSender.createMimeMessage();
		    MimeMessageHelper helper = null;

		    try {
		        helper = new MimeMessageHelper(mimeMessage, true);
		    } catch (MessagingException e) {
		        e.printStackTrace();
		        throw new IllegalStateException("Failed to create MimeMessageHelper.");
		    }

		    if (user.getEmail() == null || user.getEmail().isEmpty()) {
		        throw new IllegalArgumentException("User email must not be null or empty.");
		    }

		    try {
		        helper.setTo(user.getEmail());
		        helper.setSubject("Zapkart Invoice - Order ID: " + order.getRazorpayOrderId());
		        helper.setText(htmlContent, true);
		        javaMailSender.send(mimeMessage);
		    } catch (MessagingException e) {
		        e.printStackTrace(); // Replace with logger in production
		    }
		}

	  
	  private InvoiceDto buildInvoiceDto(User customer, Order order) {
		    InvoiceDto dto = new InvoiceDto();
		    dto.setCustomerName(customer.getName());
		    dto.setCustomerId(customer.getId());
		    dto.setOrderDate(order.getOrderDate());
		    dto.setRazorpayOrderId(order.getRazorpayOrderId());
		    dto.setTotalAmount(order.getPrice() * order.getQuantity());

		    List<InvoiceItemDto> items = new ArrayList<>();

		    InvoiceItemDto itemDto = new InvoiceItemDto();
		    itemDto.setProductName(order.getProduct().getName());
		    itemDto.setPrice(order.getPrice());
		    itemDto.setQuantity(order.getQuantity());
		    itemDto.setTotal(order.getPrice() * order.getQuantity());

		    items.add(itemDto);
		    dto.setItems(items);

		    return dto;
		}
	  
	  public void sendGroupedInvoice(User user, List<Order> orders, String razorpayOrderId) {
		    InvoiceDto invoiceDto = new InvoiceDto();
		    invoiceDto.setCustomerName(user.getName());
		    invoiceDto.setCustomerId(user.getId());
		    invoiceDto.setOrderDate(orders.get(0).getOrderDate());
		    invoiceDto.setRazorpayOrderId(razorpayOrderId);

		    List<InvoiceItemDto> items = new ArrayList<>();
		    double totalAmount = 0;

		    for (Order order : orders) {
		        InvoiceItemDto item = new InvoiceItemDto();
		        item.setBrand(order.getProduct().getBrand());
		        item.setModel(order.getProduct().getModel());
		        item.setPrice(order.getPrice());
		        item.setQuantity(order.getQuantity());
		        item.setTotal(order.getPrice() * order.getQuantity());
		        items.add(item);
		        totalAmount += item.getTotal();
		    }

		    invoiceDto.setItems(items);
		    invoiceDto.setTotalAmount(totalAmount);

		    // Build and send email same as before
		    Context context = new Context();
		    context.setVariable("invoice", invoiceDto);
		    String htmlContent = templateEngine.process("invoice", context);

		    try {
		        MimeMessage message = javaMailSender.createMimeMessage();
		        MimeMessageHelper helper = new MimeMessageHelper(message, true);
		        helper.setTo(user.getEmail());
		        helper.setSubject("Zapkart Invoice - Order ID: " + razorpayOrderId);
		        helper.setText(htmlContent, true);
		        javaMailSender.send(message);
		    } catch (MessagingException e) {
		        e.printStackTrace();
		    }
		}


}
