document.querySelector(".auth-button").addEventListener("click", () => {
	const userKey = document.querySelector(".reg-input").value;
	const errorMessage = document.querySelector(".error-message");

	if (userKey === "C4C") {
		window.location.href = "main_page.html";
	} else {
		errorMessage.textContent = "Invalid key. Please try again.";
		errorMessage.style.display = "block";
	}
});

document.querySelector(".reg-input").addEventListener("input", () => {
	const errorMessage = document.querySelector(".error-message");
	errorMessage.textContent = "";
	errorMessage.style.display = "none";
});
