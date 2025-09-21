import React, { useState } from "react";
import {
    FaFacebookF,
    FaYoutube,
    FaLinkedinIn,
    FaGithub,
    FaArrowRight,
    FaRegEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaInstagram,
    FaTwitter
} from "react-icons/fa";
import { motion } from "framer-motion";
import { FiSend } from "react-icons/fi";
import zapkarthorizontallogo from '/assets/zapkarthorizontallogo.png';
import BASE_URL from "../config";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail("");
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    // Vibrant color scheme
    const colors = {
        primary: "#ff3f6c",  // Myntra-like pink
        secondary: "#ff5722", // Orange
        dark: "#212121",
        light: "#f5f5f5",
        accent: "#ffd700"     // Gold
    };

    const socialIcons = [
        { icon: <FaInstagram />, color: "hover:text-pink-600", bg: "bg-pink-100", link: "#", name: "Instagram" },
        { icon: <FaYoutube />, color: "hover:text-red-600", bg: "bg-red-100", link: "#", name: "YouTube" },
        { icon: <FaTwitter />, color: "hover:text-blue-400", bg: "bg-blue-100", link: "#", name: "Twitter" },
        { icon: <FaFacebookF />, color: "hover:text-blue-600", bg: "bg-blue-100", link: "#", name: "Facebook" },
        { icon: <FaLinkedinIn />, color: "hover:text-blue-700", bg: "bg-blue-100", link: "#", name: "LinkedIn" },
    ];

    const footerSections = [
        {
            title: "Shop",
            links: [
                { text: "Accessories", link: "#" },
                { text: "Clothes", link: "#" },
                { text: "Electronics", link: "#" },
                { text: "Home Appliances", link: "#" },
                { text: "New Arrivals", link: "#" },
                { text: "Deals of the Day", link: "#" }
            ]
        },
        {
            title: "Support",
            links: [
                { text: "Contact Us", link: "#" },
                { text: "FAQs", link: "#" },
                { text: "Shipping Info", link: "#" },
                { text: "Returns & Exchanges", link: "#" },
                { text: "Size Guide", link: "#" }
            ]
        },
        {
            title: "Company",
            links: [
                { text: "About Us", link: "#" },
                { text: "Careers", link: "#" },
                { text: "Blog", link: "#" },
                { text: "Sustainability", link: "#" },
                { text: "Press", link: "#" }
            ]
        }
    ];

    const paymentMethods = [
        "visa", "mastercard", "paypal", "applepay",
    ];

    const contactInfo = [
        { icon: <FaRegEnvelope />, text: "chaitanyavinjamuri8@gmail.com", link: "mailto:chaitanyavinjamuri8@gmail.com" },
        { icon: <FaPhoneAlt />, text: "+91 99089 98112", link: "tel:+919908998112" },
        { icon: <FaMapMarkerAlt />, text: "KL Deemed to be University", link: "https://maps.app.goo.gl/EWPqhfLS9eGnGpJJ6" },
    ];

    // Animations
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const hoverEffect = {
        hover: {
            x: 5,
            transition: { type: "spring", stiffness: 400 }
        }
    };

    const socialHover = {
        hover: {
            y: -5,
            scale: 1.1,
            transition: { type: "spring", stiffness: 400 }
        }
    };

    return (
        <motion.footer
            className="relative bg-white text-gray-800 pt-12 pb-6 px-4 sm:px-6 lg:px-8 shadow-lg border-t-4"
            style={{ borderTopColor: colors.primary }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={container}
        >
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                    {/* Brand Column */}
                    <motion.div variants={item} className="space-y-5">
                        <div className="flex items-center">
                            <motion.div 
                                className="w-30 h-20 rounded-lg flex items-center justify-center mr-3"
                               
                                whileHover={{ rotate: 15 }}
                            >
                               <motion.img
                                               src={zapkarthorizontallogo}
                                               alt="ZapKart Logo"
                                               className="w-30 h-12 object-contain"
                                               whileHover={{ rotate: 5 }}
                                               transition={{ type: "spring", stiffness: 300 }}
                                             />
                            </motion.div>
                          
                        </div>
                        
                        <p className="text-gray-600">
                            Your premier destination for cutting-edge electronics, stylish fashion, and everything in between.
                        </p>
                        
                        <div className="flex space-x-3">
                            {socialIcons.map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.link}
                                    className={`${social.bg} w-9 h-9 rounded-full flex items-center justify-center text-gray-700 ${social.color} transition-all`}
                                    variants={socialHover}
                                    whileHover="hover"
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Links Columns */}
                    {footerSections.map((section, i) => (
                        <motion.div key={i} variants={item} className="space-y-4">
                            <h3 className="text-lg font-bold" style={{ color: colors.primary }}>{section.title}</h3>
                            <ul className="space-y-2">
                                {section.links.map((link, j) => (
                                    <motion.li key={j} variants={hoverEffect} whileHover="hover">
                                        <a href={link.link} className="flex items-center text-gray-600 hover:text-gray-900">
                                            <FaArrowRight className="mr-2 text-xs" style={{ color: colors.secondary }} />
                                            {link.text}
                                        </a>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}

                    {/* Newsletter Column */}
                    <motion.div variants={item} className="space-y-5">
                        <div>
                            <h3 className="text-lg font-bold mb-3" style={{ color: colors.primary }}>Stay Updated</h3>
                            <p className="text-gray-600 mb-4">Subscribe for exclusive deals and shopping tips.</p>
                            
                            <motion.form 
                                onSubmit={handleSubmit}
                                className="relative"
                                whileHover={{ scale: 1.01 }}
                            >
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email address"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 pr-12"
                                    style={{ focusRingColor: colors.primary }}
                                    required
                                />
                                <motion.button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg"
                                    style={{ backgroundColor: colors.primary, color: "white" }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiSend />
                                </motion.button>
                            </motion.form>
                            
                            {isSubscribed && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-2 text-sm"
                                    style={{ color: colors.secondary }}
                                >
                                    Thanks for subscribing!
                                </motion.div>
                            )}
                        </div>
                        
                        <div className="pt-4">
                            <h4 className="text-sm font-semibold mb-3">Payment Methods</h4>
                            <div className="flex flex-wrap gap-2">
                                {paymentMethods.map((method, i) => (
                                    <motion.div
                                        key={i}
                                        className="bg-gray-100 p-2 rounded-md"
                                        whileHover={{ y: -3 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <img
                                            src={`https://logo.clearbit.com/${method}.com`}
                                            alt={method}
                                            className="h-6 w-auto"
                                            onError={(e) => e.target.src = `https://via.placeholder.com/40/fff/ccc?text=${method.slice(0,2)}`}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Contact Info */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-t border-gray-200 mb-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {contactInfo.map((info, i) => (
                        <motion.a 
                            key={i}
                            href={info.link}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            whileHover={{ x: 5 }}
                        >
                            <div className="p-2 rounded-full" style={{ backgroundColor: `${colors.primary}20` }}>
                                {info.icon}
                            </div>
                            <span className="text-gray-700">{info.text}</span>
                        </motion.a>
                    ))}
                </motion.div>

                {/* Copyright */}
                <motion.div 
                    className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-200"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <p className="text-gray-500 text-sm mb-3 md:mb-0">
                        © {new Date().getFullYear()} ZapKart. All rights reserved.
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-4">
                        {["Privacy Policy", "Terms of Service", "Sitemap"].map((item, i) => (
                            <motion.a
                                key={i}
                                href="#"
                                className="text-sm text-gray-600 hover:text-gray-900"
                                whileHover={{ y: -2 }}
                                style={{ hoverColor: colors.primary }}
                            >
                                {item}
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.footer>
    );
};

export default Footer;