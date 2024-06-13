const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "partners.json");

app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.static("public"));

app.get("/api/partners", (req, res) => {
	fs.readFile(DATA_FILE, "utf8", (err, data) => {
		if (err) {
			return res.status(500).send("Error reading data file");
		}
		const partners = JSON.parse(data || "[]");
		res.json(partners);
	});
});

app.post("/api/partners", (req, res) => {
	const partners = req.body;
	fs.writeFile(
		DATA_FILE,
		JSON.stringify(partners, null, 2),
		"utf8",
		(err) => {
			if (err) {
				return res.status(500).send("Error saving data file");
			}
			res.status(200).send("Data saved successfully");
		}
	);
});

app.put("/api/partners/:name", (req, res) => {
	const partnerName = req.params.name;
	const updatedPartner = req.body;

	fs.readFile(DATA_FILE, "utf-8", (err, data) => {
		if (err) {
			res.status(500).json({ error: "Failed to read partners data" });
			return;
		}

		const partners = JSON.parse(data);
		const partnerIndex = partners.findIndex(
			(partner) => partner.name === partnerName
		);

		if (partnerIndex === -1) {
			res.status(404).json({ error: "Partner not found" });
			return;
		}

		partners[partnerIndex] = updatedPartner;

		fs.writeFile(DATA_FILE, JSON.stringify(partners, null, 2), (err) => {
			if (err) {
				res.status(500).json({
					error: "Failed to update partners data",
				});
				return;
			}
			res.json(updatedPartner);
		});
	});
});

app.delete("/api/partners/:name", (req, res) => {
	const partnerName = req.params.name;

	fs.readFile(DATA_FILE, "utf-8", (err, data) => {
		if (err) {
			res.status(500).json({ error: "Failed to read partners data" });
			return;
		}

		const partners = JSON.parse(data);
		const newPartners = partners.filter(
			(partner) => partner.name !== partnerName
		);

		if (newPartners.length === partners.length) {
			res.status(404).json({ error: "Partner not found" });
			return;
		}

		fs.writeFile(DATA_FILE, JSON.stringify(newPartners, null, 2), (err) => {
			if (err) {
				res.status(500).json({ error: "Failed to delete partner" });
				return;
			}
			res.status(200).send("Partner deleted successfully");
		});
	});
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
