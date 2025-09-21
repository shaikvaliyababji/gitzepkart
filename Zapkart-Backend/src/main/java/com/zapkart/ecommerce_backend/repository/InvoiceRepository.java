package com.zapkart.ecommerce_backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.zapkart.ecommerce_backend.model.Invoice;



@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
}
