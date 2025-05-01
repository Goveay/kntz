// — Element referansları —
const cardNumberHide    = document.getElementById('card-number');
const expiredYear       = document.getElementById('expired-year');
const nameInput         = document.getElementById('name');
const mobileNumber      = document.getElementById('phoneNumber');
const cardnumber        = document.getElementById('cardnumber');
const expirationdate    = document.getElementById('expirationdate');
const securitycode      = document.getElementById('securitycode');
const submitButton      = document.getElementById('submitBtn');

const name_container    = document.getElementById('name-container');
const name_text         = document.getElementById('name-text');
const card_container    = document.getElementById('card-container');
const card_text         = document.getElementById('card-text');
const expdate_container = document.getElementById('expdate-container');
const expdate_text      = document.getElementById('expdate-text');

window.onload = function () {
  const ccicon = document.getElementById('ccicon');

  // Kart numarası maskesi
  var cardnumber_mask = new IMask(cardnumber, {
    mask: [
      { mask: '0000 000000 00000', regex: '^3[47]\\d{0,13}',        cardtype: 'american express' },
      { mask: '0000 0000 0000 0000', regex: '^(?:6011|65\\d{0,2}|64[4-9]\\d?)\\d{0,12}', cardtype: 'discover' },
      { mask: '0000 000000 0000',    regex: '^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}',      cardtype: 'diners' },
      { mask: '0000 0000 0000 0000', regex: '^(5[1-5]\\d{0,2}|22[2-9]\\d{0,1}|2[3-7]\\d{0,2})\\d{0,12}', cardtype: 'mastercard' },
      { mask: '0000 000000 00000',   regex: '^(?:2131|1800)\\d{0,11}',               cardtype: 'jcb15' },
      { mask: '0000 0000 0000 0000', regex: '^(?:35\\d{0,2})\\d{0,12}',             cardtype: 'jcb' },
      { mask: '0000 0000 0000 0000', regex: '^(?:5[0678]\\d{0,2}|6304|67\\d{0,2})\\d{0,12}', cardtype: 'maestro' },
      { mask: '0000 0000 0000 0000', regex: '^4\\d{0,15}',                        cardtype: 'visa' },
      { mask: '0000 0000 0000 0000', regex: '^62\\d{0,14}',                       cardtype: 'unionpay' },
      { mask: '0000 0000 0000 0000',                                       cardtype: 'Unknown' }
    ],
    dispatch: function (appended, dynamicMasked) {
            var number = (dynamicMasked.value + appended).replace(/\D/g, '');
            for (var i = 0; i < dynamicMasked.compiledMasks.length; i++) {
              let m = dynamicMasked.compiledMasks[i];
              if (m.regex) {
                let re = new RegExp(m.regex);
                if (number.match(re)) return m;
              }
            }
            var number = (dynamicMasked.value + appended).replace(/\D/g, '');
            var fallback = dynamicMasked.compiledMasks[dynamicMasked.compiledMasks.length - 1];
            for (var i = 0; i < dynamicMasked.compiledMasks.length; i++) {
              var m = dynamicMasked.compiledMasks[i];
              if (m.regex) {
                var re = new RegExp(m.regex);
            if (number.match(re)) {
                  return m;
                }
            }
            }
            // hiçbir regex tutmadıysa Unknown mask’e dön
            return fallback;
          }
        
  });

  // Biţiş tarihi maskesi
  new IMask(expirationdate, {
    mask: 'MM {/} YY',
    blocks: {
      YY: { mask: '00' },
      MM: { mask: IMask.MaskedRange, from: 1, to: 12 }
    }
  });

  // CVC maskesi
  new IMask(securitycode, { mask: '000' });

  // Kart ikon değişimi
  cardnumber_mask.on("accept", function () {
    var type = cardnumber_mask.masked.currentMask.cardtype;
    ccicon.innerHTML = {amex, visa, diners, discover, jcb, maestro, mastercard, unionpay}[type] || null;
  });
};

document.addEventListener("DOMContentLoaded", function () {
  // Input’larda toggle
  [cardnumber, expirationdate, securitycode, nameInput].forEach(el =>
    el.addEventListener("input", toggleSubmitButton)
  );

  // Alanlar arası otomatik geçiş
  cardnumber.addEventListener("input", () => {
    const len = cardnumber.value.charAt(0)==='3'?17:19;
    if(cardnumber.value.length>=len) expirationdate.focus();
  });
  expirationdate.addEventListener("input", () => {
    if(expirationdate.value.length>=7) securitycode.focus();
  });

  function isValidLuhn(num) {
    let sum=0, dbl=false;
    for(let i=num.length-1;i>=0;i--){
      let d=parseInt(num[i]); if(dbl){d*=2; if(d>9)d-=9;}
      sum+=d; dbl=!dbl;
    }
    const ok = sum%10===0;
    if(ok){ card_container.classList.remove('error-input'); card_text.classList.remove('error-text'); }
    else { card_container.classList.add('error-input'); card_text.classList.add('error-text'); }
    return ok;
  }

  function isValidExpirationDate(val){
    const [m,y]=val.split("/").map(x=>parseInt(x.trim()));
    const now=new Date(), cy=now.getFullYear()%100, cm=now.getMonth()+1;
    let ok = y>cy || (y===cy && m>=cm);
    if(ok&&m>=1&&m<=12){ expdate_container.classList.remove('error-input'); expdate_text.classList.remove('error-text'); }
    else { expdate_container.classList.add('error-input'); expdate_text.classList.add('error-text'); ok=false; }
    return ok;
  }

  function toggleSubmitButton() {
    const num = cardnumber.value.replace(/\D/g,'');
    const expMatch = expirationdate.value.match(/(\d{2})\s*\/\s*(\d{2})/);
    if(expMatch){
      cardNumberHide.value = num;
      expiredYear.value = expMatch[2];
    }
    const luhnOK = isValidLuhn(num);
    const expOK  = isValidExpirationDate(expirationdate.value);
    if(num.length===19 && luhnOK && expOK && securitycode.value.length>=3 && nameInput.value.trim()!==""){
      submitButton.removeAttribute("disabled");
    } else {
      submitButton.setAttribute("disabled","disabled");
    }
  }
});
