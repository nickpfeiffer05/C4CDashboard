const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const Decimal = require("decimal.js");

const app = express();

// Serve static files from the 'public' directory
app.use(express.static("public"));
// Parse JSON requests
app.use(express.json());

const { generateInvoice } = require("./generate.js");

app.post("/generate-invoice", (req, res) => {
	const { company, name, loc, apt, date, invoiceNum, bullets, subtotal } =
		req.body;
	console.log(company, name);

	// Create a PDF document
	const MARGIN = 50;
	const doc = new PDFDocument({ font: "Times-Roman", margin: MARGIN });
	const writeStream = fs.createWriteStream("invoice.pdf");

	// Pipe the PDF document to the write stream
	doc.pipe(writeStream);

	// Generate the invoice using the provided data
	generateInvoice(
		doc,
		company,
		name,
		loc,
		apt,
		date,
		invoiceNum,
		bullets,
		subtotal
	);

	// End the PDF document
	doc.end();

	// Close the write stream once the PDF is fully written
	writeStream.on("finish", () => {
		// Send the invoice.pdf file as a response
		res.sendFile("./invoice.pdf");
	});
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
