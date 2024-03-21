const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const Decimal = require("decimal.js");

const PORT = process.env.PORT || 3000; // Use the port provided by Heroku or default to 3000

const app = express();

// Serve static files from the 'public' directory
app.use(express.static("public"));
// Parse JSON requests
app.use(express.json());

const { generateInvoice } = require("./generate.js");

app.post("/generate-invoice", (req, res) => {
	const {
		company,
		name,
		loc,
		apt,
		po,
		date,
		invoiceNum,
		bullets,
		subtotal,
		taxRate,
	} = req.body;
	generateInvoice(
		company,
		name,
		loc,
		apt,
		po,
		date,
		invoiceNum,
		bullets,
		subtotal,
		taxRate,
		() => {
			res.sendFile(__dirname + "/public/Invoice #" + invoiceNum + ".pdf");
		}
	);
	// res.sendFile(__dirname + "/public/invoice.pdf");
	// res.send("Invoice generated successfully");
});

app.listen(PORT, () => {
	console.log("Server is running on port 3000");
});
