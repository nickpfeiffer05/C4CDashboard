document.addEventListener("DOMContentLoaded", () => {
	const addPartnerButton = document.querySelector(".add-partner-button");
	const searchPartnersButton = document.querySelector(
		".search-partners-button"
	);
	const addPartnerForm = document.querySelector(".add-partner-form");
	const searchPartnersForm = document.querySelector(".search-partners-form");
	const submitButton = document.querySelector(".submit-button");
	const searchButton = document.querySelector(".search-button");

	let partners = [];
	let activeState = true;

	const fetchPartners = async () => {
		const response = await fetch("/api/partners");
		partners = await response.json();
	};

	const savePartners = async () => {
		await fetch("/api/partners", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(partners),
		});
	};

	const activeButton = document.querySelector(".activity-container .active");
	const inactiveButton = document.querySelector(
		".activity-container .inactive"
	);

	function setActive() {
		activeButton.style.backgroundColor = "#cd6767";
		inactiveButton.style.backgroundColor = "white";
		activeState = true;
	}

	function setInactive() {
		inactiveButton.style.backgroundColor = "#cd6767";
		activeButton.style.backgroundColor = "white";
		activeState = false;
	}

	activeButton.addEventListener("click", setActive);
	inactiveButton.addEventListener("click", setInactive);

	addPartnerButton.addEventListener("click", () => {
		addPartnerForm.style.display = "flex";
		searchPartnersForm.style.display = "none";

		addPartnerButton.style.backgroundColor = "#749ebf";
		searchPartnersButton.style.backgroundColor = "#97bad5";
	});

	searchPartnersButton.addEventListener("click", () => {
		addPartnerForm.style.display = "none";
		searchPartnersForm.style.display = "flex";

		searchPartnersButton.style.backgroundColor = "#749ebf";
		addPartnerButton.style.backgroundColor = "#98bad5";
	});

	submitButton.addEventListener("click", async () => {
		const partnerNameInput = document.querySelector(".partner-input");
		const imageInput = document.querySelector(".files");
		const descriptionInput = document.querySelector(".desc-input");

		const partnerName = partnerNameInput.value;
		const image = imageInput.files[0];
		const description = descriptionInput.value;

		const reader = new FileReader();
		reader.onloadend = async () => {
			const logo = reader.result;
			partners.push(
				new Partner(partnerName, logo, activeState, description)
			);
			await savePartners();
			partnerNameInput.value = "";
			imageInput.value = "";
			descriptionInput.value = "";
		};
		if (image) {
			reader.readAsDataURL(image);
		} else {
			const logo = null;
			partners.push(
				new Partner(partnerName, logo, activeState, description)
			);
			await savePartners();
			partnerNameInput.value = "";
			imageInput.value = "";
			descriptionInput.value = "";
		}
	});

	searchButton.addEventListener("click", () => {
		const partnerName = document.querySelector(
			".partner-search-input"
		).value;
		window.location.href = `search_results.html?partnerName=${encodeURIComponent(
			partnerName
		)}`;
	});

	fetchPartners();
});

class Partner {
	constructor(name, logo, active, description) {
		this.name = name;
		this.logo = logo;
		this.active = active;
		this.description = description;
	}
}
