const PDFDocument = require("pdfkit");
const fs = require("fs");
const Decimal = require("decimal.js");

function generateInvoice(
	doc,
	company,
	name,
	loc,
	apt,
	date,
	invoiceNum,
	bullets,
	subtotal
) {
	console.log("HERE");
	let tax = calculateTax(subtotal, 8.625);
	let total = subtotal + tax;

	let fullClient = "Client:  " + company;
	let fullLoc = "Loc:     " + loc;
	let fullApt = "Apt.     " + apt;
	let fullDate = "Date:    " + date;
	let fullInvoice = "Invoice #" + invoiceNum;

	const titleString = "NP Interior & Painting, Inc.";

	const MARGIN = 50;

	const RIGHT_SIDE = 400;

	// const doc = new PDFDocument({ font: "Times-Roman", margin: MARGIN });
	doc.pipe(fs.createWriteStream("invoice.pdf"));

	doc.fontSize(20);
	doc.text(titleString, {
		underline: true,
	});
	doc.x += doc.widthOfString(titleString) + 5;
	// doc.y = doc.y - doc.heightOfString(titleString);
	doc.y = doc.y - 36;
	doc.image("./paintbrush.png", { fit: [30, 30] });
	doc.x = MARGIN;

	doc.fontSize(12);
	doc.moveDown(1.5);

	doc.lineGap(calcLineGap(0.25, 12));

	doc.text("4716 Iris Lane");

	doc.text("Great Neck, NY 11020", { continued: true });
	doc.x = RIGHT_SIDE - doc.widthOfString("Great Neck, NY 11020");
	doc.text(fullClient, doc.x, doc.y);
	doc.x = MARGIN;

	doc.text("347-956-6493", { continued: true });
	doc.x = RIGHT_SIDE - doc.widthOfString("347-956-6493");
	doc.text(fullLoc);
	doc.x = MARGIN;

	doc.fillColor("#1255CC");

	doc.text("NPInterior1@gmail.com", {
		underline: true,
		color: "blue",
		link: "mailto:NPInterior1@gmail.com",
	});

	doc.fillColor("black");

	doc.x = RIGHT_SIDE;
	doc.text(fullApt);
	doc.text(fullDate);
	doc.text(fullInvoice);
	doc.x = MARGIN;

	const pageWidth = doc.page.width;
	const pageHeight = doc.page.height;

	const rectangleWidth = 450;
	const rectangleHeight = 250;

	const startX = (pageWidth - rectangleWidth) / 2;
	const startY = (pageHeight - rectangleHeight) / 2 - 25;

	// Draw the rectangle
	doc.rect(startX, startY, rectangleWidth, rectangleHeight).stroke();

	doc.moveDown(4.1);
	doc.fontSize(14);
	doc.text("Invoice", { align: "center" });
	doc.fontSize(12);

	doc.moveTo(startX, doc.y + 5)
		.lineTo(startX + rectangleWidth, doc.y + 5)
		.stroke();

	const bulletPoint = "\u2022";

	doc.moveDown(2);
	doc.x = startX + 25;
	doc.fontSize(14);
	bullets.forEach((bullet) => {
		doc.text(bulletPoint + " " + bullet);
		doc.moveDown(0.5);
	});
	doc.fontSize(12);

	doc.moveDown(10);

	const subtotalTemplate = "Subtotal:         $";
	const taxTemplate = "Tax 8.625%:   $";
	const totalTemplate = "Total:              $";
	let allPrices =
		subtotalTemplate +
		subtotal +
		"\n" +
		taxTemplate +
		tax +
		"\n" +
		totalTemplate +
		total;

	doc.x = RIGHT_SIDE;
	doc.text(allPrices);
	doc.x = MARGIN;

	doc.moveDown(2);
	doc.text("Please make all checks payable to NP Interior & Painting, Inc.", {
		align: "center",
	});
	doc.moveDown(0.5);
	doc.text("Thank you for your business.", { align: "center" });

	doc.end();
}

function calcLineGap(fontSize, mult) {
	return fontSize * mult;
}

function calculateTax(amount, taxRate) {
	const decimalAmount = new Decimal(amount);
	const decimalTaxRate = new Decimal(taxRate);
	const tax = decimalAmount.times(decimalTaxRate).dividedBy(100);
	return tax.toNumber(); // Convert back to JavaScript number
}

module.exports = { generateInvoice, calcLineGap, calculateTax };
