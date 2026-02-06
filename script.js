/* ================= PAGE NAV STARTS================= */
/* SHOW SELECTED PAGE */
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    //document.getElementById(id).classList.add('active');
    const target = document.getElementById(id);
    if (target) {
        target.classList.add('active');
    }
}
/* ================= PAGE NAV  ENDS ================= */

// formats result to remove unnecessary decimals and use scientific notation for very large/small numbers
function formatResult(num) {

    // scientific notation case
    if (Math.abs(num) >= 1e6 || Math.abs(num) < 1e-4) {
        return num
            .toExponential(6)      // enough precision
            .replace(/\.?0+e/, 'e'); // 🔑 extra zeros remove
    }

    // normal number → unnecessary decimals remove
    return parseFloat(num.toFixed(6)).toString();
}

// converts normal numbers to superscript for better display in results
function toSuperscript(numStr) {
    const superscripts = {
        "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
        "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
        "-": "⁻"
    };
    return numStr.replace(/./g, c => superscripts[c] || c);
}

// converts scientific notation to a more readable format with superscript exponents
function renderScientific(num) {
    if (!num.toString().includes("e")) return num;

    const [base, exp] = num.toString().split("e");
    return `${base} × 10${toSuperscript(exp)}`;
}

// new function add kar raha hon bqi uper waly old hain sb
// smarter formatting: normal decimal for regular numbers, scientific with superscript for very large/small numbers
function formatNumberSmart(value) {

    // agar bilkul integer hai → simple
    if (Number.isInteger(value)) {
        return value.toString();
    }

    // agar bohat chhota ya bohat bara number hai
    if (Math.abs(value) < 0.0001 || Math.abs(value) >= 1e6) {
        return toScientificSuperscript(value, 6);
    }

    // warna normal decimal (extra zero remove)
    return parseFloat(value.toFixed(6)).toString();
}

function toScientificSuperscript(num, precision = 6) {

    const expStr = num.toExponential(precision); // 1.000000e-9
    const [base, exp] = expStr.split("e");

    const exponent = exp.replace("+", "");

    return `${parseFloat(base)} × 10<sup>${exponent}</sup>`;
}


// simple toast function to show messages
function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");

    setTimeout(() => toast.classList.remove("show"), 2000);
}


// copy result to clipboard
function copyResult(type) {

    const resultBox = document.getElementById(type + "Result");
    const text = resultBox.innerText;

    if (!text) {
        showToast("⚠ Nothing to copy");
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        showToast("✅ Copied to clipboard");
    });
}



const converters = {
    weight: {                     // agr unit add karna haiy yhn add hoga ur dosra html maiy bas 2 jagah add karna haiy
        kg: 1,                   // base unit  
        g: 0.001,                // 1 gram = 0.001 kg
        mg: 0.000001,            // 1 milligram = 0.000001 kg
        ton: 1000,               // 1 ton = 1000 kg
        st: 6.35029,             // 1 stone = 6.35029 kg
        cwt: 50.8023,            // 1 hundredweight = 50.8023 kg
        lb: 0.453592,
        oz: 0.0283495
    },

    length: {
        m: 1,
        cm: 0.01,
        mm: 0.001,
        km: 1000,
        in: 0.0254,
        ft: 0.3048,
        yd: 0.9144,
        mi: 1609.344,
        um: 0.000001,
        nm: 0.000000001
    }
};

/* ========================= CONVERTER BAR  STARTS (INPUT AREA) ========================= */
/* ================= CATEGORY SWITCH ================= */
function openConverter(id, el) {
    document.querySelectorAll('.converter-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');

    document.querySelectorAll('.cat').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
}
/* ========================= CONVERTER BAR  ENDS (INPUT AREA) ========================= */



/* ================= UPDATE SETUP STARTS================= */

function updateTargets(type) {

    const fromSelect = document.getElementById(type + "From");
    const targetsDiv = document.getElementById(type + "Targets");

    if (!fromSelect || !targetsDiv) return;

    const fromUnit = fromSelect.value;
    targetsDiv.innerHTML = "";

    Object.keys(converters[type]).forEach(unit => {
        if (unit === fromUnit) return;

        const btn = document.createElement("button");
        btn.className = "target-btn";
        btn.textContent = `${fromUnit} → ${unit}`;
        btn.onclick = () => convert(type, unit);

        targetsDiv.appendChild(btn);
    });
}
/* ================= UPDATE SETUP ENDS================= */


/* ========================= CONVERT FUNCTION ========================= */

function convert(type, toUnit) {

    const input = document.getElementById(type + "Input");
    const fromUnit = document.getElementById(type + "From").value;
    const resultBox = document.getElementById(type + "Result");

    const value = parseFloat(input.value);
    if (isNaN(value)) {
        resultBox.innerText = "Please enter a value";
        return;
    }

    const fromFactor = converters[type][fromUnit];
    const toFactor = converters[type][toUnit];

    // ✅ CORRECT UNIVERSAL FORMULA

    const result = value * (fromFactor / toFactor);
    const formatted = formatNumberSmart(result);

    resultBox.innerHTML =
        `${value} ${fromUnit} = <b>${formatted}</b> ${toUnit}`;
}
/* ========================= CONVERT FUNCTION ENDS ========================= */

window.onload = () => {
    showPage('home');
    updateTargets("weight");
    updateTargets("length");
};



