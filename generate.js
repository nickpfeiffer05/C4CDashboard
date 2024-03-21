const PDFDocument = require("pdfkit");
const fs = require("fs");
const Decimal = require("decimal.js");

function generateInvoice(
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
	callback
) {
	let tax = calculateTax(subtotal, taxRate);
	let total = new Decimal(subtotal)
		.plus(new Decimal(tax))
		.toDecimalPlaces(2)
		.toNumber()
		.toLocaleString();

	let fullClient = "Client:  " + company;
	let fullName = "             " + name;
	let fullLoc = "Loc:     " + loc;
	let fullApt = "Apt.     " + apt;
	let fullPo = "P.O.#   " + po;
	let fullDate = "Date: " + date;
	let fullInvoice = "Invoice #" + invoiceNum;

	let address1 = "4716 Iris Lane";
	let address2 = "Great Neck, NY 11020";
	let phoneNumber = "347-956-6493";
	let email = "NPInterior1@gmail.com";

	const titleString = "NP Interior & Painting, Inc.";

	const MARGIN = 50;

	const RIGHT_SIDE = 400;

	const doc = new PDFDocument({ font: "Times-Roman", margin: MARGIN });
	const writeStream = fs.createWriteStream(
		"./public/Invoice #" + invoiceNum + ".pdf"
	); // Write stream to the file

	doc.pipe(writeStream);

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

	const OFFY = 2;

	doc.text(address1);

	doc.text(address2, { continued: true });
	doc.x = RIGHT_SIDE - doc.widthOfString(address2);
	doc.y += OFFY;
	doc.text(fullClient, doc.x, doc.y);
	doc.x = MARGIN;

	doc.text(phoneNumber, { continued: true });
	doc.x = RIGHT_SIDE - doc.widthOfString(phoneNumber);
	doc.text(fullName);
	doc.x = MARGIN;

	doc.fillColor("#1255CC");

	doc.text(email, {
		underline: true,
		color: "blue",
		link: "mailto:NPInterior1@gmail.com",
		continued: true,
	});

	doc.fillColor("black");

	doc.x = RIGHT_SIDE - doc.widthOfString(email);
	doc.text(fullLoc, {
		underline: false,
		color: "black",
		link: null,
		continued: false,
	});
	doc.x = MARGIN;

	doc.x = RIGHT_SIDE;
	doc.text(fullApt);

	doc.x = MARGIN;

	if (po == "") {
		doc.text(fullDate);
	} else {
		doc.text(fullDate, { continued: true });

		doc.x = RIGHT_SIDE - doc.widthOfString(fullDate);
		doc.text(fullPo);
	}

	doc.text(fullInvoice);

	const pageWidth = doc.page.width;
	const pageHeight = doc.page.height;

	let rectangleWidth = 450;
	let rectangleHeight = 250;

	const startX = (pageWidth - rectangleWidth) / 2;
	const startY = (pageHeight - rectangleHeight) / 2 - 25;

	doc.moveDown(4.1);
	doc.fontSize(14);
	doc.text("Invoice", { align: "center" });
	doc.fontSize(12);

	doc.moveTo(startX, doc.y + 5)
		.lineTo(startX + rectangleWidth, doc.y + 5)
		.stroke();

	const bulletPoint = "\u2022";

	doc.moveDown(1.5);
	doc.x = startX + 25;
	doc.fontSize(14);
	bullets.forEach((bullet) => {
		let originalY = doc.y;
		let originalX = doc.x;
		doc.text(bulletPoint + "  ");
		doc.y = originalY;
		doc.x = originalX + 10;
		doc.text(bullet, { width: rectangleWidth - 60 });
		doc.x = originalX;
	});

	doc.rect(startX, startY, rectangleWidth, rectangleHeight).stroke();

	doc.fontSize(12);

	doc.y = startY + rectangleHeight + 40;

	const subtotalTemplate = "Subtotal:         $";
	const taxTemplate = "Tax " + taxRate + "%:   $";
	const totalTemplate = "Total:              $";
	let allPrices =
		subtotalTemplate +
		Number(subtotal).toLocaleString() +
		"\n" +
		taxTemplate +
		Number(tax).toLocaleString() +
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

	writeStream.on("finish", () => {
		callback();
	});
}

function calcLineGap(fontSize, mult) {
	return fontSize * mult;
}

function calculateTax(amount, taxRate) {
	const decimalAmount = new Decimal(amount);
	const decimalTaxRate = new Decimal(taxRate);
	const tax = decimalAmount
		.times(decimalTaxRate)
		.dividedBy(100)
		.toDecimalPlaces(2);
	return tax.toNumber();
}

module.exports = { generateInvoice, calcLineGap, calculateTax };
