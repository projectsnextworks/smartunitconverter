/* ================= PAGE NAV STARTS================= */
/* SHOW SELECTED PAGE */


// page show karne ka function
function showPage(id) {

    // 1️⃣ sab pages hide
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // 2️⃣ target page show
    const targetPage = document.getElementById(id);
    if (!targetPage) return;

    targetPage.classList.add('active');

    // 3️⃣ 🔥 SIRF isi page ke units banao
    updateTargets(id);

    // 4️⃣ optional: old result clear
    clearResult(id);
}

// old result clear karne ka function (optional, UX ke liye)
function clearResult(type) {
    const resultBox = document.getElementById(type + "Result");
    if (resultBox) {
        resultBox.innerHTML = "";
    }
}


/* ================= PAGE NAV  ENDS ================= */

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

// converts number to scientific notation with superscript exponent for better readability
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
    },

    temp: {
        C: true, // Celsius is the base unit, so we can use 'true' as a placeholder
        F: true, // Fahrenheit to Celsius factor
        k: true  // Kelvin to Celsius offset
    },

    time: {
        s: 1,
        ms: 0.001,
        min: 60,
        h: 3600,
        day: 86400,
        week: 604800,
        month: 2629800,   // average
        year: 31557600    // average
    },

    speed: {
        mps: 1,           // meter per second
        kmph: 0.2777778,
        mph: 0.44704,
        fps: 0.3048,
        knot: 0.514444
    },

    area: {
        sqm: 1,
        sqcm: 0.0001,
        sqmm: 0.000001,
        sqkm: 1000000,
        sqft: 0.092903,
        sqyd: 0.836127,
        acre: 4046.8564224,
        hectare: 10000
    },

    volume: {
        l: 1,
        ml: 0.001,
        m3: 1000,
        cm3: 0.001,
        gallon_us: 3.78541,
        gallon_uk: 4.54609,
        pint: 0.473176,
        cup: 0.24
    },

    data: {
        bit: 1,
        byte: 8,
        kb: 8000,
        mb: 8000000,
        gb: 8000000000,
        tb: 8000000000000,
        kib: 8192,
        mib: 8388608,
        gib: 8589934592
    },

    energy: {
        j: 1,
        kj: 1000,
        cal: 4.184,
        kcal: 4184,
        wh: 3600,
        kwh: 3600000,
        ev: 0.0000000000000000001602
    },

    pressure: {
        pa: 1,
        kpa: 1000,
        mpa: 1000000,
        bar: 100000,
        atm: 101325,
        psi: 6894.757,
        mmhg: 133.322,
        inhg: 3386.39
    },

    power: {
        w: 1,
        kw: 1000,
        mw: 1000000,
        hp: 745.7,
        btu_h: 0.293071
    },

    density: {
        kgm3: 1,
        gcm3: 1000,
        lbft3: 16.0185,
        lbgal: 119.826
    },

    angle: {
        rad: 1,
        deg: 0.01745329252,
        grad: 0.01570796327,
        arcmin: 0.000290888,
        arcsec: 0.00000484814
    },

    luminance: {
        cd_m2: 1,
        nit: 1,
        stilb: 10000,
        lambert: 3183.1
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
    document.getElementById(type + "Result").innerHTML = "";

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
    // 🌡 TEMPERATURE SPECIAL CASE
    if (type === "temp") {
        let result;

        if (fromUnit === "C" && toUnit === "F")
            result = (value * 9 / 5) + 32;
        else if (fromUnit === "C" && toUnit === "k")
            result = value + 273.15;

        else if (fromUnit === "F" && toUnit === "C")
            result = (value - 32) * 5 / 9;
        else if (fromUnit === "F" && toUnit === "k")
            result = (value - 32) * 5 / 9 + 273.15;

        else if (fromUnit === "k" && toUnit === "C")
            result = value - 273.15;
        else if (fromUnit === "k" && toUnit === "F")
            result = (value - 273.15) * 9 / 5 + 32;

        resultBox.textContent =
            `${value} ${fromUnit.toUpperCase()} = ${result.toFixed(2)} ${toUnit.toUpperCase()}`;
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


/* ========================= INITIAL SETUP ========================= */
document.addEventListener("DOMContentLoaded", function () {
    showPage("length");   // default page
});



