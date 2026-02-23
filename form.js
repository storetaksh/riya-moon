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
    const whatsappWebURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    const whatsappAppURL = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;

    // Show Custom Modal
    const modal = document.getElementById("rsvp-modal");
    const whatsappBtn = document.getElementById("modal-whatsapp-btn");
    const timerElement = document.getElementById("redirect-timer");

    if (modal && whatsappBtn && timerElement) {
        whatsappBtn.href = whatsappWebURL;
        modal.classList.add("show");

        let countdown = 5;
        let isRedirected = false;

        const triggerRedirect = (isManual = false) => {
            if (isRedirected) return;
            isRedirected = true;
            clearInterval(interval);
            modal.classList.remove("show");

            if (isManual) {
                window.open(whatsappWebURL, "_blank");
            } else {
                // Try to open WhatsApp app directly via deep link
                window.location.href = whatsappAppURL;

                // Fallback to web link if deep link fails (e.g. app not installed)
                setTimeout(() => {
                    if (document.hasFocus()) {
                        window.location.href = whatsappWebURL;
                    }
                }, 500);
            }
        };

        const interval = setInterval(() => {
            countdown--;
            timerElement.textContent = countdown;
            if (countdown <= 0) triggerRedirect(false);
        }, 1000);

        whatsappBtn.onclick = (e) => {
            // Only handle manual (trusted) clicks here to avoid recursion
            // and open in a new tab for manual clicks.
            if (e.isTrusted) {
                e.preventDefault();
                triggerRedirect(true);
            }
            // For programmatic .click(), the default browser action (following href)
            // will occur because e.isTrusted will be false.
        };
    } else {
        // Fallback to direct redirect
        window.location.href = whatsappWebURL;
    }
});
