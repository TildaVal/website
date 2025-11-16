//=====FOR GOOGLE TRANSLATE=====//
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,fr,de,es,it,pt,ar,zh-CN,hi,ja,ru,ko,nl,sw',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
}

const translateScript = document.createElement('script');
translateScript.type = 'text/javascript';
translateScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
document.head.appendChild(translateScript);



//=====FOR TRANSFER PAGE=====//
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("transferForm");
  const popup = document.getElementById("transferPopup");
  const popupDetails = document.getElementById("popupDetails");
  const closePopup = document.getElementById("closePopup");

  document.addEventListener("DOMContentLoaded", () => {
    if (!window.location.pathname.includes("transfer.html")) return;

    const form = document.getElementById("transferForm");
    const popup = document.getElementById("transferPopup");
    const popupDetails = document.getElementById("popupDetails");
    const closePopup = document.getElementById("closePopup");

    const user = JSON.parse(localStorage.getItem("MetroneUser"));
    if (!user) {
      alert("Please log in to make a transfer.");
      window.location.href = "login.html";
      return;
    }

  });

  // Display username and balance
  const userName = document.getElementById("userName");
  const userBalance = document.getElementById("userBalance");
  if (userName) userName.textContent = user.name;
  if (userBalance) userBalance.textContent = user.balance.toFixed(2);

  // Form handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const senderName = document.getElementById("senderName").value;
    const accountNumber = document.getElementById("accountNumber").value;
    const recipientBank = document.getElementById("recipientBank").value;
    const recipientAccount = document.getElementById("recipientAccount").value;
    const country = document.getElementById("country").value;
    const currency = document.getElementById("currency").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const purpose = document.getElementById("purpose").value || "Not specified";

    // Validation
    if (
      !senderName ||
      !accountNumber ||
      !recipientBank ||
      !recipientAccount ||
      !country ||
      !currency ||
      isNaN(amount) ||
      amount <= 0
    ) {
      alert("Please fill in all required fields correctly.");
      return;
    }

    if (user.balance < amount) {
      alert("Insufficient funds for this transfer.");
      return;
    }

    // Deduct funds and update history
    user.balance -= amount;
    user.lastTransaction = `Transferred ${currency} ${amount.toFixed(
      2
    )} to ${recipientBank} (${recipientAccount})`;
    localStorage.setItem("MetroneUser", JSON.stringify(user));

    let history = JSON.parse(localStorage.getItem("transactionHistory")) || [];
    const transaction = {
      type: "Transfer",
      senderName,
      recipientBank,
      recipientAccount,
      country,
      currency,
      amount: amount.toFixed(2),
      purpose,
      date: new Date().toLocaleString(),
    };
    history.push(transaction);
    localStorage.setItem("transactionHistory", JSON.stringify(history));

    // Update display balance
    if (userBalance) userBalance.textContent = user.balance.toFixed(2);

    // Show receipt popup
    popupDetails.innerHTML = `
        <p><strong>Amount:</strong> ${currency} ${amount.toFixed(2)}</p>
        <p><strong>To:</strong> ${recipientBank} (${recipientAccount})</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Purpose:</strong> ${purpose}</p>
        <p><strong>Date:</strong> ${transaction.date}</p>
        <hr>
        <p><strong>New Balance:</strong> £${user.balance.toFixed(2)}</p>
      `;
    popup.style.display = "flex";

    form.reset();
  });

  // Close popup handler
  closePopup.addEventListener("click", () => {
    popup.style.display = "none";
  });

  // Click outside popup closes it too
  popup.addEventListener("click", (e) => {
    if (e.target === popup) popup.style.display = "none";
  });
});

//=====FOR FAQ QUESTIONS=====//
// FAQ dropdown toggle fix
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const answer = btn.nextElementSibling;

    // Close others
    document.querySelectorAll(".faq-answer").forEach((el) => {
      if (el !== answer) {
        el.style.maxHeight = null;
        el.previousElementSibling.classList.remove("active");
      }
    });

    // Toggle selected
    btn.classList.toggle("active");
    if (answer.style.maxHeight) {
      answer.style.maxHeight = null;
    } else {
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

//=========FOR DASHBOARD=========//
const user = JSON.parse(localStorage.getItem("MetroneUser"));
const greeting = document.getElementById("greeting");
const txnList = document.getElementById("txnList");

if (!user) {
  alert("No account session found. Please log in again.");
  window.location.href = "login.html";
} else {
  const hours = new Date().getHours();
  let greet = "Good evening";
  if (hours < 12) greet = "Good morning";
  else if (hours < 18) greet = "Good afternoon";

  greeting.textContent = `${greet}, ${user.name}!`;
  document.getElementById("accName").textContent = user.name;
  document.getElementById("accType").textContent = user.accountType;
  document.getElementById("accNumber").textContent = user.accountNumber;
  document.getElementById("accBalance").textContent =
    user.balance?.toFixed(2) || "0.00";

  const history = user.transactions || [];
  txnList.innerHTML = history.length
    ? history.map((txn) => `<li>${txn}</li>`).join("")
    : "<li>No transactions yet.</li>";
}
function depositFunds() {
  window.location.href = "deposit.html";
}
function transferFunds() {
  window.location.href = "transfer.html";
}

function logout() {
  user.lastLogin = new Date().toLocaleString();
  localStorage.setItem("MetroneUser", JSON.stringify(user));
  window.location.href = "login.html";
}
