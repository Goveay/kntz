require([
    'jquery'
], function ($) {
    $(document).ready(function() {
        $.validator.validators['validate-phone-number'] = [
            function (value) {
                return value === '' || (parseFloat(value) > 0 && value.length === 13) && !value.match(/[a-zA-Z]/);
            },
            $.__('Please enter a valid phone number.')
        ];
    });
});
