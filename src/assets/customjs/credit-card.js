document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.input-cart-number').forEach(function (element) {
    element.addEventListener('keyup', function (event) {
      var target = event.target;

      if (target.value.length > 3) {
        target.nextElementSibling.focus();
      }

      var cardNumber = '';
      document.querySelectorAll('.input-cart-number').forEach(function (inputElement) {
        cardNumber += inputElement.value + ' ';
        if (inputElement.value.length === 4) {
          inputElement.nextElementSibling.focus();
        }
      });

      document.querySelector('.credit-card-box .number').innerHTML = cardNumber;
    });
  });

  document.getElementById('card-holder').addEventListener('keyup', function (event) {
    var target = event.target;
    document.querySelector('.credit-card-box .card-holder div').innerHTML = target.value;
  });

  document.querySelectorAll('#card-expiration-month, #card-expiration-year').forEach(function (element) {
    element.addEventListener('change', function () {
      var monthIndex = document.querySelector('#card-expiration-month').selectedIndex;
      var month = (monthIndex < 10) ? '0' + monthIndex : monthIndex;
      var year = document.querySelector('#card-expiration-year').value.substr(2, 2);
      document.querySelector('.card-expiration-date div').innerHTML = month + '/' + year;
    });
  });

  document.getElementById('card-ccv').addEventListener('focus', function () {
    document.querySelector('.credit-card-box').classList.add('hover');
  });

  document.getElementById('card-ccv').addEventListener('blur', function () {
    document.querySelector('.credit-card-box').classList.remove('hover');
  });

  document.getElementById('card-ccv').addEventListener('keyup', function (event) {
    var ccvValue = event.target.value;
    document.querySelector('.ccv div').innerHTML = ccvValue;
  });
});

// Código para obtener el tipo de tarjeta de crédito (comentado por ahora)
/*function getCreditCardType(accountNumber) {
  if (/^5[1-5]/.test(accountNumber)) {
    result = 'mastercard';
  } else if (/^4/.test(accountNumber)) {
    result = 'visa';
  } else if (/^(5018|5020|5038|6304|6759|676[1-3])/.test(accountNumber)) {
    result = 'maestro';
  } else {
    result = 'unknown';
  }
  return result;
}

document.getElementById('card-number').addEventListener('change', function(event) {
  console.log(getCreditCardType(event.target.value));
});*/
