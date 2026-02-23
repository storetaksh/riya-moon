document.querySelector(".rsvp-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = this.querySelector('input[type="text"]');
    const attendanceSelect = this.querySelector("select");

    const name = nameInput.value.trim();
    const attendance = attendanceSelect.value;

    if (!name) {
        alert("Please enter your name.");
        return;
    }

    // Get wedding data
    const weddingData = window.weddingData;
    if (!weddingData) {
        alert("Unable to load wedding information. Please try again.");
        return;
    }

    const groomName = weddingData.couple.groom.name;
    const brideName = weddingData.couple.bride.name;

    let message = "";

    if (attendance === "yes") {
        message = `Hi ${groomName} & ${brideName}! I'm delighted to confirm my presence for your wedding celebrations.\nWarm regards,\n${name}`;
    } else {
        message = `Hi ${groomName} & ${brideName}! Thank you so much for the invitation. Unfortunately, I won't be able to attend the wedding.\nWith best wishes,\n${name}`;
    }

    const phoneNumber = weddingData.contact.whatsapp;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Show Custom Modal
    const modal = document.getElementById("rsvp-modal");
    const whatsappBtn = document.getElementById("modal-whatsapp-btn");
    const timerElement = document.getElementById("redirect-timer");

    if (modal && whatsappBtn && timerElement) {
        whatsappBtn.href = whatsappURL;
        modal.classList.add("show");

        let countdown = 5;
        let isRedirected = false;

        const triggerRedirect = () => {
            if (isRedirected) return;
            isRedirected = true;
            clearInterval(interval);
            modal.classList.remove("show");
            window.open(whatsappURL, "_blank");
        };

        const interval = setInterval(() => {
            countdown--;
            timerElement.textContent = countdown;
            if (countdown <= 0) triggerRedirect();
        }, 1000);

        whatsappBtn.onclick = (e) => {
            e.preventDefault();
            triggerRedirect();
        };
    } else {
        // Fallback to direct redirect if modal elements missing
        window.open(whatsappURL, "_blank");
    }
});
