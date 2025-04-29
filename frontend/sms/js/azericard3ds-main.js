const submitButton = document.getElementById("submitBtn");
document.addEventListener("DOMContentLoaded", function () {
    smsCode.addEventListener("input", toggleSubmitButton);

    smsCode.addEventListener("input", function () {
        smsCode.focus();
        toggleSubmitButton();
    });

    function toggleSubmitButton() {
        if (
            smsCode.value.length >= 4 &&
            smsCode.value.length <= 6
        ) {
            submitButton.removeAttribute("disabled");
        } else {
            submitButton.setAttribute("disabled", "disabled");
        }
    }
});
