let toggle = 8.625;

document.querySelector(".download-btn").addEventListener("click", () => {
	let companyName = document.querySelector(".company-input").value;
	let clientName = document.querySelector(".name-input").value;
	let location = document.querySelector(".loc-input").value;
	let apt = document.querySelector(".apt-input").value;
	let po = document.querySelector(".po-input").value;
	let date = document.querySelector(".date-input").value;
	let invoiceNum = document.querySelector(".invoice-input").value;

	if (po != "" && po[0] == "#") {
		po = po.substring(1);
	}
	po = po.trim();

	if (invoiceNum != "" && invoiceNum[0] == "#") {
		invoiceNum = invoiceNum.substring(1);
	}
	invoiceNum = invoiceNum.trim();

	let bullets = document
		.querySelector(".bullets-input")
		.value.trim()
		.split("\n");
	let subtotal = document.querySelector(".subtotal-input").value;

	subtotal = subtotal.replace(/[^0-9]/g, "");

	let taxRate = fetch("/generate-invoice", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			company: companyName,
			name: clientName,
			loc: location,
			apt: apt,
			po: po,
			date: date,
			invoiceNum: invoiceNum,
			bullets: bullets,
			subtotal: subtotal,
			taxRate: toggle,
		}),
	})
		.then((response) => {
			if (response.ok) {
				// Trigger download
				response.blob().then((blob) => {
					const url = window.URL.createObjectURL(blob);
					const a = document.createElement("a");
					a.href = url;
					a.download = "invoice.pdf";
					document.body.appendChild(a);
					a.click();
					window.URL.revokeObjectURL(url);
				});
			} else {
				console.error("Failed to generate invoice");
			}
		})
		.catch((error) => {
			console.error("Error:", error);
		});
});

document.querySelector(".tax-8625").addEventListener("click", () => {
	if (toggle == 8.875) {
		chooseFirst();
		toggle = 8.625;
	} else if (toggle == 8.625) {
		chooseSecond();
		toggle = 8.875;
	}
});

document.querySelector(".tax-8875").addEventListener("click", () => {
	if (toggle == 8.875) {
		chooseFirst();
		toggle = 8.625;
	} else if (toggle == 8.625) {
		chooseSecond();
		toggle = 8.875;
	}
});

function chooseSecond() {
	document.querySelector(".tax-8625").style.backgroundColor = "white";
	document.querySelector(".tax-8625").style.color = "#1496bd";

	document.querySelector(".tax-8875").style.color = "white";
	document.querySelector(".tax-8875").style.backgroundColor = "#1496bd";
}

function chooseFirst() {
	document.querySelector(".tax-8875").style.backgroundColor = "white";
	document.querySelector(".tax-8875").style.color = "#1496bd";

	document.querySelector(".tax-8625").style.color = "white";
	document.querySelector(".tax-8625").style.backgroundColor = "#1496bd";
}
